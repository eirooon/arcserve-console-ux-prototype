import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../../../api/client";
import { toastStore } from "../../../api/toastStore";
import { ENDPOINTS } from "../../../api/endpoints";
import { useWaitingOnYou } from "./useWaitingOnYou";

vi.mock("../../../api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../../api/toastStore", () => ({
  toastStore: {
    pushToast: vi.fn(() => 1),
    dismissToast: vi.fn(),
  },
}));

const SUGGESTION_ITEM = {
  id: "suggestion-1",
  goalId: "protection-fitness-check",
  type: "suggestion",
  changeType: "plan-frequency",
  category: "Protection Health Check",
  title: "Consider a more frequent plan for this source",
  source: "sample_machine_05",
  currentPlan: "Standard",
  proposedPlan: "Business-Essential",
};

// Flushes the mock apiClient.get promise + its state update without relying
// on RTL's waitFor, whose internal polling uses real setTimeout — which
// hangs forever once fake timers are active (see beforeEach below).
async function setupHook() {
  apiClient.get.mockResolvedValue([SUGGESTION_ITEM]);
  const view = renderHook(() => useWaitingOnYou());
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
  return view;
}

describe("useWaitingOnYou dismissSuggestion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiClient.post.mockResolvedValue({ id: "dismissal-server-id" });
    apiClient.delete.mockResolvedValue(undefined);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("removes the card immediately and posts a dismissal record, with or without a reason", async () => {
    const { result } = await setupHook();

    await act(async () => {
      result.current.dismissSuggestion(SUGGESTION_ITEM, { reason: null, note: null });
      await Promise.resolve();
    });

    expect(result.current.items).toHaveLength(0);
    expect(apiClient.delete).toHaveBeenCalledWith(`${ENDPOINTS.WAITING_ON_YOU}/suggestion-1`);
    expect(apiClient.post).toHaveBeenCalledWith(
      ENDPOINTS.ARCGENIE_DISMISSALS,
      expect.objectContaining({
        suggestionId: "suggestion-1",
        sourceId: "sample_machine_05",
        workflowId: "protection-fitness-check",
        changeType: "plan-frequency",
        reason: null,
        note: null,
      }),
    );
  });

  it("includes the chosen reason and note in the dismissal record", async () => {
    const { result } = await setupHook();

    await act(async () => {
      result.current.dismissSuggestion(SUGGESTION_ITEM, {
        reason: "wrong-plan",
        note: "Dev box, rebuilt from image",
      });
      await Promise.resolve();
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      ENDPOINTS.ARCGENIE_DISMISSALS,
      expect.objectContaining({ reason: "wrong-plan", note: "Dev box, rebuilt from image" }),
    );
  });

  it("shows a snackbar with an Undo action instead of writing the log entry right away", async () => {
    const { result } = await setupHook();

    await act(async () => {
      result.current.dismissSuggestion(SUGGESTION_ITEM, { reason: null, note: null });
      await Promise.resolve();
    });

    expect(toastStore.pushToast).toHaveBeenCalledWith(
      "Suggestion dismissed for sample_machine_05",
      expect.objectContaining({
        duration: 8000,
        action: expect.objectContaining({ label: "Undo", onClick: expect.any(Function) }),
      }),
    );
    expect(apiClient.post).not.toHaveBeenCalledWith(
      ENDPOINTS.ARCGENIE_ACTIVITY_LOG,
      expect.anything(),
    );
  });

  it("Undo restores the card to its original position and never writes a log entry", async () => {
    const otherItem = { ...SUGGESTION_ITEM, id: "other-1", source: "other_machine" };
    apiClient.get.mockResolvedValue([otherItem, SUGGESTION_ITEM]);
    const { result } = renderHook(() => useWaitingOnYou());
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    await act(async () => {
      result.current.dismissSuggestion(SUGGESTION_ITEM, { reason: null, note: null });
      await Promise.resolve();
    });
    expect(result.current.items.map((item) => item.id)).toEqual(["other-1"]);

    const undo = toastStore.pushToast.mock.calls[0][1].action.onClick;
    await act(async () => {
      undo();
      await Promise.resolve();
    });

    // Back in its original (second) position, not just re-appended.
    expect(result.current.items.map((item) => item.id)).toEqual(["other-1", "suggestion-1"]);
    expect(apiClient.post).toHaveBeenCalledWith(ENDPOINTS.WAITING_ON_YOU, SUGGESTION_ITEM);
    expect(apiClient.delete).toHaveBeenCalledWith(
      `${ENDPOINTS.ARCGENIE_DISMISSALS}/dismissal-server-id`,
    );

    // Let the (cancelled) log-write timer's window fully elapse — it must
    // never fire after Undo cancelled it.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(8000);
    });
    expect(apiClient.post).not.toHaveBeenCalledWith(
      ENDPOINTS.ARCGENIE_ACTIVITY_LOG,
      expect.anything(),
    );
  });

  it("writes an Activity Log entry once the undo window elapses without Undo", async () => {
    const { result } = await setupHook();

    await act(async () => {
      result.current.dismissSuggestion(SUGGESTION_ITEM, {
        reason: "intentional",
        note: "Fine as is",
      });
      await Promise.resolve();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(8000);
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      ENDPOINTS.ARCGENIE_ACTIVITY_LOG,
      expect.objectContaining({
        message:
          "Dismissed the suggestion to move sample_machine_05 from Standard to Business-Essential.",
        reasonLabel: "Intentional, this source is fine as is",
        note: "Fine as is",
        restorePayload: SUGGESTION_ITEM,
        dismissalRecordId: "dismissal-server-id",
        viewSourceHref: "/sources/all-sources",
      }),
    );
  });

  it("does nothing if Undo is clicked again after the window already elapsed", async () => {
    const { result } = await setupHook();

    await act(async () => {
      result.current.dismissSuggestion(SUGGESTION_ITEM, { reason: null, note: null });
      await Promise.resolve();
    });

    const undo = toastStore.pushToast.mock.calls[0][1].action.onClick;

    await act(async () => {
      await vi.advanceTimersByTimeAsync(8000);
    });
    apiClient.post.mockClear();
    apiClient.delete.mockClear();

    await act(async () => {
      undo();
      await Promise.resolve();
    });

    expect(result.current.items).toHaveLength(0);
    expect(apiClient.post).not.toHaveBeenCalled();
    expect(apiClient.delete).not.toHaveBeenCalled();
  });
});
