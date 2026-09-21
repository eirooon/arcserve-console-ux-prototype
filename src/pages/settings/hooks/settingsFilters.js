import { createEntityFilterStore } from "../../../utils/createEntityFilterStore";

// Category options are derived from whatever values actually exist in the
// loaded rows, rather than a hardcoded list, so the Filters modal never
// offers a choice that would silently match nothing.
function getCategoryOptions(rows) {
  return [...new Set(rows.map((row) => row.category).filter(Boolean))].map((value) => ({
    value,
    label: value,
  }));
}

// Field descriptors for the Source Groups "Filters" modal — see
// src/utils/entityFilters.js for the shape and matching engine, and
// src/components/EntityFiltersDialog.jsx for the modal that renders these.
export const SETTINGS_FILTER_FIELDS = [
  { key: "category", label: "Category", type: "select", field: "category", options: getCategoryOptions },
];

// Free-text "Search" box matches against the setting's own name.
export const SETTINGS_SEARCH_FIELDS = ["setting_name"];

export const settingsFilterStore = createEntityFilterStore({
  fields: SETTINGS_FILTER_FIELDS,
  searchFields: SETTINGS_SEARCH_FIELDS,
});
