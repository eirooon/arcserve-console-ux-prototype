import { humanize } from "../../../utils/text";
import { createEntityFilterStore } from "../../../utils/createEntityFilterStore";
import { getSourceTypeIconMeta } from "./useSourceData";

// Type/Site/Organization options are derived from whatever values actually
// exist in the currently-selected sub-nav category's rows (see
// SourcesToolbar/SourcesTable, which compute `categoryRows` via
// filterSourcesByCategory before calling useEntityFilterState), rather than a
// hardcoded list, so the Filters modal never offers a choice that would
// silently match nothing.
function getSourceTypeOptions(rows) {
  return [...new Set(rows.map((row) => row.source_type).filter(Boolean))].map((value) => ({
    value,
    // Prefer the curated icon/label metadata already maintained for the
    // Type column (e.g. "udp_windows" -> "Windows Agent") over a generic
    // title-cased fallback.
    label: getSourceTypeIconMeta(value)?.label ?? humanize(value),
  }));
}

function getSiteOptions(rows) {
  return [...new Set(rows.map((row) => row.site_name).filter(Boolean))].map((value) => ({
    value,
    label: value,
  }));
}

function getOrganizationOptions(rows) {
  return [...new Set(rows.map((row) => row.organization_name).filter(Boolean))].map((value) => ({
    value,
    label: value,
  }));
}

// Field descriptors for the Sources "Filters" modal — see
// src/utils/entityFilters.js for the shape and matching engine, and
// src/components/EntityFiltersDialog.jsx for the modal that renders these.
export const SOURCES_FILTER_FIELDS = [
  { key: "type", label: "Type", type: "multiselect", field: "source_type", options: getSourceTypeOptions },
  {
    key: "protectionStatus",
    label: "Protection Status",
    type: "select",
    field: "protection_status",
    options: [
      { value: "protect", label: "Protected" },
      { value: "unprotect", label: "Unprotected" },
    ],
  },
  {
    key: "connectionStatus",
    label: "Connection Status",
    type: "select",
    field: "connection_status",
    options: [
      { value: "online", label: "Online" },
      { value: "offline", label: "Offline" },
    ],
  },
  { key: "site", label: "Site", type: "select", field: "site_name", options: getSiteOptions },
  {
    key: "organization",
    label: "Organization",
    type: "select",
    field: "organization_name",
    options: getOrganizationOptions,
  },
];

// Free-text "Search sources" box matches against the column most likely to
// identify a source at a glance.
export const SOURCES_SEARCH_FIELDS = ["source_name"];

export const sourcesFilterStore = createEntityFilterStore({
  fields: SOURCES_FILTER_FIELDS,
  searchFields: SOURCES_SEARCH_FIELDS,
});
