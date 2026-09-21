import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";

export const columns = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
  { field: "protected_data", headerName: "Protected Data", flex: 1 },
  { field: "region", headerName: "Region", flex: 1 },
  {
    field: "sources_protected",
    headerName: "Sources Protected",
    type: "number",
    flex: 1,
  },
  {
    field: "last_recovery_point",
    headerName: "Last Recovery Point",
    flex: 1,
    valueGetter: (value) => (value ? new Date(value) : null),
    type: "dateTime",
  },
];

export const fields = [
  { field: "name", label: "Name", type: "text" },
  { field: "type", label: "Type", type: "text" },
  { field: "status", label: "Status", type: "text" },
  { field: "protected_data", label: "Protected Data", type: "text" },
  { field: "region", label: "Region", type: "text" },
  { field: "sources_protected", label: "Sources Protected", type: "number" },
  { field: "last_recovery_point", label: "Last Recovery Point", type: "datetime" },
];

// Maps each Destinations sub-nav category (see subRoutes.js) to the
// destination `type` value that identifies it in the mock data (see
// src/mocks/data/destinations.js) — mirrors filterSourcesByCategory in
// ../../sources/hooks/useSourceData.jsx. Every Destinations sub-page shows
// exactly one type, so an unrecognized categoryId defensively returns rows
// unchanged instead of filtering everything out.
export function filterDestinationsByCategory(rows, categoryId) {
  switch (categoryId) {
    case "rps":
      return rows.filter((row) => row.type === "recovery_point_server");
    case "datastores":
      return rows.filter((row) => row.type === "data_store");
    case "acrsaccounts":
      return rows.filter((row) => row.type === "cloud_volume");
    case "share-folders":
      return rows.filter((row) => row.type === "shared_folder");
    default:
      return rows;
  }
}

export const destinationStore = createResourceStore(ENDPOINTS.DESTINATIONS);

export function useDestinationData(selector) {
  return useResourceStore(destinationStore, selector);
}
