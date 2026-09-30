import { createEntityFilterStore } from "../../../utils/createEntityFilterStore";
import { CLOUD_SERVICE_OPTIONS } from "./cloudServices";
import { SITE_STATUS_OPTIONS, SITE_TYPE_OPTIONS } from "./siteStatus";

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

// Cloud Accounts have no status/host — they're identified by the cloud
// service they connect to — so they get their own fields and store.
export const CLOUD_ACCOUNT_FILTER_FIELDS = [
  {
    key: "cloudService",
    label: "Cloud Services",
    type: "select",
    field: "cloudService",
    options: CLOUD_SERVICE_OPTIONS,
  },
];

export const CLOUD_ACCOUNT_SEARCH_FIELDS = ["name", "cloudService"];

export const cloudAccountFilterStore = createEntityFilterStore({
  fields: CLOUD_ACCOUNT_FILTER_FIELDS,
  searchFields: CLOUD_ACCOUNT_SEARCH_FIELDS,
});

// Sites have their own status lifecycle (deploying → online/failed) and a
// Site vs Cloud Site type that the sub-nav doesn't split on.
export const SITE_FILTER_FIELDS = [
  { key: "status", label: "Status", type: "select", field: "status", options: SITE_STATUS_OPTIONS },
  { key: "siteType", label: "Type", type: "select", field: "siteType", options: SITE_TYPE_OPTIONS },
];

export const SITE_SEARCH_FIELDS = ["name", "host", "registeredEmail", "cloudAccount"];

export const siteFilterStore = createEntityFilterStore({
  fields: SITE_FILTER_FIELDS,
  searchFields: SITE_SEARCH_FIELDS,
});

// Resolves which filter store/fields apply to a left sub-nav category, so the
// Toolbar and Table (siblings) always read the same filter state.
export function getInfrastructureFilterConfig(categoryId) {
  if (categoryId === "cloud-accounts") {
    return { filterStore: cloudAccountFilterStore, filterFields: CLOUD_ACCOUNT_FILTER_FIELDS };
  }
  if (categoryId === "sites") {
    return { filterStore: siteFilterStore, filterFields: SITE_FILTER_FIELDS };
  }
  return { filterStore: infrastructureFilterStore, filterFields: INFRASTRUCTURE_FILTER_FIELDS };
}
