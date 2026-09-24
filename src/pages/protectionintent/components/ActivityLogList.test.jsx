import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ActivityLogList from "./ActivityLogList";

const DISMISSAL_ENTRY = {
  id: "activity-1",
  actor: "person",
  initials: "ES",
  approvedBy: "Erron Sevilla",
  message: "Dismissed the suggestion to move sample_machine_05 from Standard to Business-Essential.",
  attributionText: "Dismissed by Erron Sevilla · Protection Health Check suggestion · Sep-23-2026 09:10 AM",
  date: "Sep-23-2026 09:10 AM",
  restorePayload: { id: "suggestion-1" },
  dismissalRecordId: "dismissal-1",
  viewSourceHref: "/sources/all-sources",
};

function renderList(items, props = {}) {
  return render(
    <MemoryRouter>
      <ActivityLogList items={items} {...props} />
    </MemoryRouter>,
  );
}

describe("ActivityLogList — dismissal entries", () => {
  it("renders reason and note in a gray inset when both are provided", () => {
    renderList([{ ...DISMISSAL_ENTRY, reasonLabel: "Intentional, this source is fine as is", note: "Dev box, rebuilt from image" }]);

    expect(screen.getByText("Reason: Intentional, this source is fine as is")).toBeInTheDocument();
    expect(screen.getByText("Note: Dev box, rebuilt from image")).toBeInTheDocument();
  });

  it("omits the inset entirely when neither reason nor note was given", () => {
    renderList([{ ...DISMISSAL_ENTRY, reasonLabel: null, note: null }]);

    expect(screen.queryByText(/^Reason:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Note:/)).not.toBeInTheDocument();
  });

  it("renders only the reason when no note was given", () => {
    renderList([{ ...DISMISSAL_ENTRY, reasonLabel: "Source is being retired", note: null }]);

    expect(screen.getByText("Reason: Source is being retired")).toBeInTheDocument();
    expect(screen.queryByText(/^Note:/)).not.toBeInTheDocument();
  });

  it("shows the precomputed attribution line and Restore suggestion / View source links", () => {
    renderList([DISMISSAL_ENTRY]);

    expect(
      screen.getByText("Dismissed by Erron Sevilla · Protection Health Check suggestion · Sep-23-2026 09:10 AM"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View source" })).toHaveAttribute("href", "/sources/all-sources");
    expect(screen.getByRole("button", { name: "Restore suggestion" })).toBeInTheDocument();
  });

  it("clicking Restore suggestion calls onRestoreSuggestion with the entry", async () => {
    const user = userEvent.setup();
    const onRestoreSuggestion = vi.fn();
    renderList([DISMISSAL_ENTRY], { onRestoreSuggestion });

    await user.click(screen.getByRole("button", { name: "Restore suggestion" }));

    expect(onRestoreSuggestion).toHaveBeenCalledWith(DISMISSAL_ENTRY);
  });

  it("shows a disabled 'Restored' state once isRestored reports true for the entry", () => {
    renderList([DISMISSAL_ENTRY], { isRestored: () => true });

    const restored = screen.getByRole("button", { name: "Restored" });
    expect(restored).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Restore suggestion" })).not.toBeInTheDocument();
  });
});
