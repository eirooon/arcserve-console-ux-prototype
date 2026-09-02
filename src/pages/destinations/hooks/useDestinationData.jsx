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

export const destinationStore = createResourceStore(ENDPOINTS.DESTINATIONS);

export function useDestinationData(selector) {
  return useResourceStore(destinationStore, selector);
}
