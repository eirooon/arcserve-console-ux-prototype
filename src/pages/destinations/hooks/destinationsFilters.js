import { createEntityFilterStore } from "../../../utils/createEntityFilterStore";

// Region options are derived from whatever values actually exist in the
// currently-selected sub-nav category's rows (see DestinationsToolbar/
// DestinationsTable, which compute `categoryRows` via
// filterDestinationsByCategory before calling useEntityFilterState), rather
// than a hardcoded list, so the Filters modal never offers a choice that
// would silently match nothing.
function getRegionOptions(rows) {
  return [...new Set(rows.map((row) => row.region).filter(Boolean))].map((value) => ({
    value,
    label: value,
  }));
}

// Field descriptors for the Destinations "Filters" modal — see
// src/utils/entityFilters.js for the shape and matching engine, and
// src/components/EntityFiltersDialog.jsx for the modal that renders these.
// There's intentionally no "Type" field here: the left sub-nav already fully
// covers it (each sub-nav page only ever shows one destination `type`).
export const DESTINATIONS_FILTER_FIELDS = [
  {
    key: "status",
    label: "Status",
    type: "select",
    field: "status",
    options: [
      { value: "protected", label: "Protected" },
      { value: "unprotected", label: "Unprotected" },
    ],
  },
  { key: "region", label: "Region", type: "select", field: "region", options: getRegionOptions },
];

// Free-text search box matches against the column most likely to identify a
// destination at a glance.
export const DESTINATIONS_SEARCH_FIELDS = ["name"];

export const destinationsFilterStore = createEntityFilterStore({
  fields: DESTINATIONS_FILTER_FIELDS,
  searchFields: DESTINATIONS_SEARCH_FIELDS,
});
