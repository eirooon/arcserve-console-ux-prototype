import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";

export const columns = [
  { field: "report_name", headerName: "Report Name", flex: 1.5 },
  { field: "report_type", headerName: "Type", flex: 1 },
  { field: "schedule", headerName: "Schedule", flex: 1 },
  {
    field: "last_generated",
    headerName: "Last Generated",
    flex: 1,
    valueGetter: (value) => (value ? new Date(value) : null),
    type: "dateTime",
  },
];

export const fields = [
  { field: "report_name", label: "Report Name", type: "text" },
  { field: "report_type", label: "Type", type: "text" },
  { field: "schedule", label: "Schedule", type: "text" },
  { field: "last_generated", label: "Last Generated", type: "datetime" },
];

export const reportsStore = createResourceStore(ENDPOINTS.REPORTS);

export function useReportsData(selector) {
  return useResourceStore(reportsStore, selector);
}
