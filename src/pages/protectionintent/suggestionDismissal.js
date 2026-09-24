// Fixtures + copy for the Waiting on You "suggestion" dismiss flow, kept in
// one place because the app has no i18n library installed yet (see the
// research note on this feature) — centralizing every user-facing string
// here means wiring in real i18n later is a find-and-replace of this file,
// not a hunt through components.

export const DISMISS_TOAST_DURATION_MS = 8000;

export const DISMISS_REASON_OPTIONS = [
  { value: "intentional", label: "Intentional, this source is fine as is" },
  { value: "wrong-plan", label: "The suggested plan is wrong" },
  { value: "retiring", label: "Source is being retired" },
  { value: "other", label: "Other" },
];

export function getDismissReasonLabel(value) {
  return DISMISS_REASON_OPTIONS.find((option) => option.value === value)?.label ?? null;
}

export const DISMISS_PANEL_COPY = {
  radioGroupLabel: "Why are you dismissing this?",
  radioGroupOptionalSuffix: "(optional)",
  noteLabel: "Note for the audit trail (optional)",
  notePlaceholder: "Add context for the audit trail",
  helperText: (source) =>
    `ArcGenie won't suggest this again for ${source} unless its recovery points fall further behind.`,
  dismissButtonLabel: "Dismiss suggestion",
  cancelButtonLabel: "Cancel",
};

export const DISMISS_TOAST_COPY = {
  message: (source) => `Suggestion dismissed for ${source}`,
  undoLabel: "Undo",
};

export const DISMISS_LOG_COPY = {
  message: (source, currentPlan, proposedPlan) =>
    `Dismissed the suggestion to move ${source} from ${currentPlan} to ${proposedPlan}.`,
  attribution: (userName, workflowLabel, timestamp) =>
    `Dismissed by ${userName} · ${workflowLabel} suggestion · ${timestamp}`,
  restoreLabel: "Restore suggestion",
  viewSourceLabel: "View source",
  restoredMessage: (userName) => `Restored by ${userName}`,
};

/**
 * Whether a suggestion for this exact (source, workflow, change type) has
 * already been dismissed — a future re-suggest rule can call this before
 * surfacing the same suggestion again. Pure over an already-fetched
 * dismissals list rather than doing its own I/O, so it's trivially testable
 * and reusable wherever the list is already in hand.
 */
export function isDismissed(dismissalRecords, sourceId, workflowId, changeType) {
  return dismissalRecords.some(
    (record) =>
      record.sourceId === sourceId &&
      record.workflowId === workflowId &&
      record.changeType === changeType,
  );
}
