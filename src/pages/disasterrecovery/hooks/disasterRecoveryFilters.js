import { createEntityFilterStore } from "../../../utils/createEntityFilterStore";

// Field descriptors for the Disaster Recovery "Filters" modal — see
// src/utils/entityFilters.js for the shape and matching engine, and
// src/components/EntityFiltersDialog.jsx for the modal that renders these.
export const DISASTER_RECOVERY_FILTER_FIELDS = [
  {
    key: "status",
    label: "Status",
    type: "select",
    field: "status",
    options: [
      { value: "active", label: "Active" },
      { value: "draft", label: "Draft" },
    ],
  },
  {
    key: "lastRunStatus",
    label: "Last Run Status",
    type: "select",
    field: "last_run_status",
    options: [
      { value: "success", label: "Success" },
      { value: "failed", label: "Failed" },
    ],
  },
  // last_run_ts is an ISO timestamp string, so the default "ms" timestampUnit
  // (new Date(...).getTime()) is correct — no override needed.
  { key: "lastRun", label: "Last Run", type: "dateRange", field: "last_run_ts" },
];

// Free-text "Search" box matches against the runbook name — the only
// human-identifiable column in the current disaster recovery data model.
export const DISASTER_RECOVERY_SEARCH_FIELDS = ["runbook_name"];

export const disasterRecoveryFilterStore = createEntityFilterStore({
  fields: DISASTER_RECOVERY_FILTER_FIELDS,
  searchFields: DISASTER_RECOVERY_SEARCH_FIELDS,
});
