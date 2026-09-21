import { createEntityFilterStore } from "../../../utils/createEntityFilterStore";

// Site options are derived from whatever values actually exist in the loaded
// rows, rather than a hardcoded list, so the Filters modal never offers a
// choice that would silently match nothing (mirrors jobsFilters.js).
function getSiteOptions(rows) {
  return [...new Set(rows.map((row) => row.site).filter(Boolean))].map((value) => ({
    value,
    label: value,
  }));
}

// Field descriptors for the ACRS Servers "Filters" modal — see
// src/utils/entityFilters.js for the shape and matching engine, and
// src/components/EntityFiltersDialog.jsx for the modal that renders these.
export const ACRS_SERVERS_FILTER_FIELDS = [
  {
    key: "status",
    label: "Status",
    type: "select",
    field: "status",
    // status values mirror STATUS_META in useAcrsServersData.jsx so a
    // server's status reads consistently wherever it appears in the app.
    options: [
      { value: "Pending", label: "Pending" },
      { value: "Online", label: "Online" },
      { value: "Offline", label: "Offline" },
    ],
  },
  { key: "site", label: "Site", type: "select", field: "site", options: getSiteOptions },
];

// Free-text "Search" box matches against the two columns most likely to
// identify a server at a glance.
export const ACRS_SERVERS_SEARCH_FIELDS = ["displayName", "hostnameIp"];

export const acrsServersFilterStore = createEntityFilterStore({
  fields: ACRS_SERVERS_FILTER_FIELDS,
  searchFields: ACRS_SERVERS_SEARCH_FIELDS,
});
