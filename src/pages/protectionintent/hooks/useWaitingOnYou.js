import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { toastStore } from "../../../api/toastStore";
import { CURRENT_USER } from "../../../data/currentUser";
import {
  DISMISS_LOG_COPY,
  DISMISS_TOAST_COPY,
  DISMISS_TOAST_DURATION_MS,
  getDismissReasonLabel,
} from "../suggestionDismissal";

const ACTION_MESSAGES = {
  approve: (item) => `${item.source} approved and assigned to the ${item.proposedPlan} plan.`,
  assign: (item) => `${item.source} sent for manual policy assignment.`,
  review: (item) => `Opening ${item.source} for review.`,
  "apply-in-plans": (item) => `Opening Plans to apply ${item.proposedPlan} for ${item.source}.`,
};

// A destination for "View source" on a dismissal log entry — there's no
// per-source detail page in this app yet, only list pages, so this is the
// closest real destination rather than a dead link.
const VIEW_SOURCE_HREF = "/sources/all-sources";

function formatTimestamp(date = new Date()) {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function useWaitingOnYou() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // dismissalKey -> { item, index, timer, dismissalRecordId }, for suggestion
  // dismissals still inside their undo window (see dismissSuggestion).
  const pendingDismissals = useRef(new Map());

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get(ENDPOINTS.WAITING_ON_YOU)
      .then((data) => {
        if (!cancelled) setItems(data ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const resolveItem = useCallback((item) => {
    setItems((current) => current.filter((existing) => existing.id !== item.id));
    return apiClient.delete(`${ENDPOINTS.WAITING_ON_YOU}/${item.id}`);
  }, []);

  const handleAction = useCallback(
    (item, actionKey) => {
      const message = ACTION_MESSAGES[actionKey]?.(item);
      if (message) toastStore.pushToast(message);

      if (actionKey === "approve" || actionKey === "assign") {
        resolveItem(item);
        apiClient.post(ENDPOINTS.ARCGENIE_ACTIVITY_LOG, {
          message: `${item.source} was assigned to the ${item.proposedPlan} plan.`,
          approvedBy: "You",
          date: formatTimestamp(),
        });
      }
    },
    [resolveItem],
  );

  const handleDismiss = useCallback(
    (item) => {
      resolveItem(item);
      toastStore.pushToast(`${item.title} set aside for now.`);
    },
    [resolveItem],
  );

  // Cancels a still-pending dismissal's deferred log write and puts the item
  // back where it was. If the window already elapsed (timer fired, log
  // entry written), the key is gone from the map and this is a no-op — by
  // then "Undo" isn't offered anymore anyway (the toast has closed).
  const undoDismissSuggestion = useCallback((dismissalKey) => {
    const pending = pendingDismissals.current.get(dismissalKey);
    if (!pending) return;

    clearTimeout(pending.timer);
    pendingDismissals.current.delete(dismissalKey);

    setItems((current) => {
      const next = [...current];
      const index = pending.index === -1 ? next.length : Math.min(pending.index, next.length);
      next.splice(index, 0, pending.item);
      return next;
    });

    apiClient.post(ENDPOINTS.WAITING_ON_YOU, pending.item);
    if (pending.dismissalRecordId) {
      apiClient.delete(`${ENDPOINTS.ARCGENIE_DISMISSALS}/${pending.dismissalRecordId}`);
    }
  }, []);

  // Suggestion-only dismiss: removes the card immediately (optimistic, like
  // resolveItem), but defers writing an Activity Log entry until the undo
  // window actually elapses — Undo cancels that timer, so nothing is ever
  // logged for a dismissal the user took back.
  const dismissSuggestion = useCallback(
    (item, { reason, note }) => {
      let removedIndex = -1;
      setItems((current) => {
        removedIndex = current.findIndex((existing) => existing.id === item.id);
        return current.filter((existing) => existing.id !== item.id);
      });
      apiClient.delete(`${ENDPOINTS.WAITING_ON_YOU}/${item.id}`);

      const dismissalKey = crypto.randomUUID();
      const pending = { item, index: removedIndex, timer: null, dismissalRecordId: null };
      pendingDismissals.current.set(dismissalKey, pending);

      // The dismissal record itself is written right away (it's the audit
      // trail / isDismissed() source of truth, independent of the Activity
      // Log entry) — only the *log* entry waits out the undo window. Its
      // server-assigned id is captured for undo's DELETE, since
      // createCrudHandlers always mints its own id on POST.
      apiClient
        .post(ENDPOINTS.ARCGENIE_DISMISSALS, {
          suggestionId: item.id,
          sourceId: item.source,
          workflowId: item.goalId,
          changeType: item.changeType ?? null,
          reason: reason ?? null,
          note: note ?? null,
          dismissedBy: CURRENT_USER.name,
          dismissedAt: new Date().toISOString(),
        })
        .then((created) => {
          pending.dismissalRecordId = created.id;
        });

      pending.timer = setTimeout(() => {
        pendingDismissals.current.delete(dismissalKey);
        apiClient.post(ENDPOINTS.ARCGENIE_ACTIVITY_LOG, {
          actor: "person",
          initials: CURRENT_USER.initials,
          approvedBy: CURRENT_USER.name,
          message: DISMISS_LOG_COPY.message(item.source, item.currentPlan, item.proposedPlan),
          reasonLabel: getDismissReasonLabel(reason),
          note: note || null,
          attributionText: DISMISS_LOG_COPY.attribution(
            CURRENT_USER.name,
            item.category,
            formatTimestamp(),
          ),
          date: formatTimestamp(),
          restorePayload: item,
          dismissalRecordId: pending.dismissalRecordId,
          viewSourceHref: VIEW_SOURCE_HREF,
        });
      }, DISMISS_TOAST_DURATION_MS);

      toastStore.pushToast(DISMISS_TOAST_COPY.message(item.source), {
        duration: DISMISS_TOAST_DURATION_MS,
        action: {
          label: DISMISS_TOAST_COPY.undoLabel,
          onClick: () => undoDismissSuggestion(dismissalKey),
        },
      });
    },
    [undoDismissSuggestion],
  );

  return {
    items,
    loading,
    handleAction,
    handleDismiss,
    dismissSuggestion,
  };
}
