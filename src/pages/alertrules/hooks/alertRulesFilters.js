import { createEntityFilterStore } from "../../../utils/createEntityFilterStore";

// Field descriptors for the Alert Rules "Filters" modal — see
// src/utils/entityFilters.js for the shape and matching engine, and
// src/components/EntityFiltersDialog.jsx for the modal that renders these.
export const ALERT_RULES_FILTER_FIELDS = [
  {
    key: "severity",
    label: "Severity",
    type: "select",
    field: "severity",
    options: [
      { value: "critical", label: "Critical" },
      { value: "warning", label: "Warning" },
      { value: "info", label: "Info" },
    ],
  },
  {
    key: "enabled",
    label: "Enabled",
    type: "select",
    field: "enabled",
    // `enabled` is a boolean row field; option values are matched as strings
    // (String(row.enabled) === value), so "true"/"false" is intentional here.
    options: [
      { value: "true", label: "Enabled" },
      { value: "false", label: "Disabled" },
    ],
  },
];

// Free-text "Search alert rules" box matches against the two columns most
// likely to identify a rule at a glance.
export const ALERT_RULES_SEARCH_FIELDS = ["rule_name", "condition"];

export const alertRulesFilterStore = createEntityFilterStore({
  fields: ALERT_RULES_FILTER_FIELDS,
  searchFields: ALERT_RULES_SEARCH_FIELDS,
});
