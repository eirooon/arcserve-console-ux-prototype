import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";

export const columns = [
  { field: "runbook_name", headerName: "Runbook Name", flex: 1.5 },
  { field: "status", headerName: "Status", flex: 1 },
  { field: "source_count", headerName: "Sources", type: "number", flex: 0.8 },
  {
    field: "last_run_ts",
    headerName: "Last Run",
    flex: 1,
    valueGetter: (value) => (value ? new Date(value) : null),
    type: "dateTime",
  },
  { field: "last_run_status", headerName: "Last Run Status", flex: 1 },
];

export const fields = [
  { field: "runbook_name", label: "Runbook Name", type: "text" },
  { field: "status", label: "Status", type: "text" },
  { field: "source_count", label: "Sources", type: "number" },
  { field: "last_run_ts", label: "Last Run", type: "datetime" },
  { field: "last_run_status", label: "Last Run Status", type: "text" },
];

export const disasterRecoveryStore = createResourceStore(ENDPOINTS.DISASTER_RECOVERY);

export function useDisasterRecoveryData(selector) {
  return useResourceStore(disasterRecoveryStore, selector);
}
