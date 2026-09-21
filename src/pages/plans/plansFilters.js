import { createEntityFilterStore } from "../../utils/createEntityFilterStore";

// Source Group/Protection Type options are derived from whatever values
// actually exist in the loaded rows, rather than a hardcoded list, so the
// Filters modal never offers a choice that would silently match nothing (some
// plans have no source_group at all — see mocks/data/plans.js).
function getSourceGroupOptions(rows) {
  return [...new Set(rows.map((row) => row.source_group).filter(Boolean))].map((value) => ({
    value,
    label: value,
  }));
}

function getProtectionTypeOptions(rows) {
  return [...new Set(rows.map((row) => row.policy_type).filter(Boolean))].map((value) => ({
    value,
    label: value,
  }));
}

// Field descriptors for the Plans "Filters" modal — see
// src/utils/entityFilters.js for the shape and matching engine, and
// src/components/EntityFiltersDialog.jsx for the modal that renders these.
export const PLANS_FILTER_FIELDS = [
  {
    key: "planType",
    label: "Plan Type",
    type: "select",
    field: "plan_type",
    // plan_type values mirror PLAN_TYPE_ICON_META in usePlansData.jsx so a
    // plan's type reads consistently wherever it appears in the app.
    options: [
      { value: "backup_recovery", label: "Backup & Recovery" },
      { value: "archive", label: "Archive" },
      { value: "replication", label: "Replication" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    field: "plan_status",
    // plan_status values mirror PLAN_STATUS_ICON_META in usePlansData.jsx.
    options: [
      { value: "active", label: "Active" },
      { value: "paused", label: "Paused" },
    ],
  },
  {
    key: "sourceGroup",
    label: "Source Group",
    type: "select",
    field: "source_group",
    options: getSourceGroupOptions,
  },
  {
    key: "protectionType",
    label: "Protection Type",
    type: "select",
    field: "policy_type",
    options: getProtectionTypeOptions,
  },
];

// Free-text "Search plans" box matches against the plan's own name.
export const PLANS_SEARCH_FIELDS = ["plan_name"];

export const plansFilterStore = createEntityFilterStore({
  fields: PLANS_FILTER_FIELDS,
  searchFields: PLANS_SEARCH_FIELDS,
});
