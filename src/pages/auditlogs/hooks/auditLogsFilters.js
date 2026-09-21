import { createEntityFilterStore } from "../../../utils/createEntityFilterStore";

// Audit log actions use a dotted format (e.g. "plan.update", "user.login")
// rather than the underscore-delimited enums `humanize()` (see
// src/utils/text.js) is built for, so this page formats its own Action
// option labels instead of reusing that shared helper.
function formatActionLabel(action) {
  return action
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// Action/User options are derived from whatever values actually exist in the
// loaded rows, rather than a hardcoded list, so the Filters modal never
// offers a choice that would silently match nothing.
function getActionOptions(rows) {
  return [...new Set(rows.map((row) => row.action).filter(Boolean))].map((value) => ({
    value,
    label: formatActionLabel(value),
  }));
}

function getUserOptions(rows) {
  return [...new Set(rows.map((row) => row.user).filter(Boolean))].map((value) => ({
    value,
    label: value,
  }));
}

// Field descriptors for the Audit Logs "Filters" modal — see
// src/utils/entityFilters.js for the shape and matching engine, and
// src/components/EntityFiltersDialog.jsx for the modal that renders these.
export const AUDIT_LOGS_FILTER_FIELDS = [
  { key: "action", label: "Action", type: "multiselect", field: "action", options: getActionOptions },
  {
    key: "result",
    label: "Result",
    type: "select",
    field: "result",
    options: [
      { value: "success", label: "Success" },
      { value: "denied", label: "Denied" },
    ],
  },
  { key: "user", label: "User", type: "select", field: "user", options: getUserOptions },
  // `timestamp` is an ISO string (see src/mocks/data/auditLogs.js), so the
  // default "ms" timestampUnit is correct here.
  { key: "timestamp", label: "Date Range", type: "dateRange", field: "timestamp" },
];

// Free-text "Search audit logs" box matches against the columns most likely
// to identify a log entry at a glance.
export const AUDIT_LOGS_SEARCH_FIELDS = ["user", "target", "action"];

export const auditLogsFilterStore = createEntityFilterStore({
  fields: AUDIT_LOGS_FILTER_FIELDS,
  searchFields: AUDIT_LOGS_SEARCH_FIELDS,
});
