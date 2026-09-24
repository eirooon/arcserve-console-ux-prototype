import { useCallback, useState } from "react";
import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { toastStore } from "../../../api/toastStore";
import { CURRENT_USER } from "../../../data/currentUser";
import { DISMISS_LOG_COPY } from "../suggestionDismissal";

function formatTimestamp(date = new Date()) {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Lets an Activity Log view restore a dismissed suggestion from its log
 * entry's "Restore suggestion" link. The app has no shared cross-page store
 * (see useWaitingOnYou.js's own note on this), so restoring only guarantees
 * the *next* Waiting on You fetch (a fresh mount/navigation) will see the
 * item again. To make the action feel immediate on the page it was clicked
 * from, this keeps a small local overlay of the "Restored by" entry it just
 * wrote and tracks which entries were just restored, so re-clicking is a
 * no-op instead of writing a duplicate log entry.
 */
export function useActivityLogRestore() {
  const [overlayEntries, setOverlayEntries] = useState([]);
  const [restoredEntryIds, setRestoredEntryIds] = useState(() => new Set());

  const restoreSuggestion = useCallback((logEntry) => {
    if (!logEntry.restorePayload) return;

    apiClient.post(ENDPOINTS.WAITING_ON_YOU, logEntry.restorePayload);
    if (logEntry.dismissalRecordId) {
      apiClient.delete(`${ENDPOINTS.ARCGENIE_DISMISSALS}/${logEntry.dismissalRecordId}`);
    }

    const message = DISMISS_LOG_COPY.restoredMessage(CURRENT_USER.name);
    const date = formatTimestamp();
    const restoredEntry = {
      id: `restored-${logEntry.id}`,
      actor: "person",
      initials: CURRENT_USER.initials,
      approvedBy: CURRENT_USER.name,
      message,
      attributionText: `${message} · ${date}`,
      date,
    };
    apiClient.post(ENDPOINTS.ARCGENIE_ACTIVITY_LOG, restoredEntry);

    setOverlayEntries((current) => [restoredEntry, ...current]);
    setRestoredEntryIds((current) => new Set(current).add(logEntry.id));
    toastStore.pushToast(`${logEntry.restorePayload.source} suggestion restored.`);
  }, []);

  const withOverlay = useCallback((fetchedItems) => [...overlayEntries, ...fetchedItems], [overlayEntries]);
  const isRestored = useCallback((entryId) => restoredEntryIds.has(entryId), [restoredEntryIds]);

  return { withOverlay, restoreSuggestion, isRestored };
}
