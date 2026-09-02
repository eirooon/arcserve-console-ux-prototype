import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";

export const columns = [
  {
    field: "timestamp",
    headerName: "Timestamp",
    flex: 1,
    valueGetter: (value) => (value ? new Date(value) : null),
    type: "dateTime",
  },
  { field: "user", headerName: "User", flex: 1 },
  { field: "action", headerName: "Action", flex: 1 },
  { field: "target", headerName: "Target", flex: 1 },
  { field: "result", headerName: "Result", flex: 1 },
];

export const fields = [
  { field: "timestamp", label: "Timestamp", type: "datetime" },
  { field: "user", label: "User", type: "text" },
  { field: "action", label: "Action", type: "text" },
  { field: "target", label: "Target", type: "text" },
  { field: "result", label: "Result", type: "text" },
];

export const auditLogsStore = createResourceStore(ENDPOINTS.AUDIT_LOGS);

export function useAuditLogsData() {
  return useResourceStore(auditLogsStore);
}
