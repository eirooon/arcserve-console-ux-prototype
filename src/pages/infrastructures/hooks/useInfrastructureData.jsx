import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";

export const columns = [
  { field: "name", headerName: "Name", flex: 1.5 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "host", headerName: "Host", flex: 1.5 },
  { field: "status", headerName: "Status", flex: 1 },
  { field: "version", headerName: "Version", flex: 1 },
];

export const fields = [
  { field: "name", label: "Name", type: "text" },
  { field: "type", label: "Type", type: "text" },
  { field: "host", label: "Host", type: "text" },
  { field: "status", label: "Status", type: "text" },
  { field: "version", label: "Version", type: "text" },
];

export const infrastructureStore = createResourceStore(ENDPOINTS.INFRASTRUCTURE);

export function useInfrastructureData(selector) {
  return useResourceStore(infrastructureStore, selector);
}
