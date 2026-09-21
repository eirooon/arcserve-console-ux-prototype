import { createEntityFilterStore } from "../../../utils/createEntityFilterStore";

// Field descriptors for the Infrastructures "Filters" modal — see
// src/utils/entityFilters.js for the shape and matching engine, and
// src/components/EntityFiltersDialog.jsx for the modal that renders these.
// No "Type" field here: the left sub-nav (see filterInfrastructureByCategory
// in useInfrastructureData.jsx) already fully partitions rows by type, so a
// redundant Type filter would just duplicate that navigation.
export const INFRASTRUCTURE_FILTER_FIELDS = [
  {
    key: "status",
    label: "Status",
    type: "select",
    field: "status",
    // The only status values used across the mock infrastructure rows.
    options: [
      { value: "online", label: "Online" },
      { value: "degraded", label: "Degraded" },
      { value: "offline", label: "Offline" },
    ],
  },
];

// Free-text "Search infrastructure" box matches against the two columns most
// likely to identify a row at a glance.
export const INFRASTRUCTURE_SEARCH_FIELDS = ["name", "host"];

export const infrastructureFilterStore = createEntityFilterStore({
  fields: INFRASTRUCTURE_FILTER_FIELDS,
  searchFields: INFRASTRUCTURE_SEARCH_FIELDS,
});
