import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";

export const columns = [
  { field: "job_name", headerName: "Job Name", flex: 1.5 },
  { field: "job_type", headerName: "Type", flex: 1 },
  { field: "job_status", headerName: "Status", flex: 1 },
  { field: "source_name", headerName: "Source", flex: 1 },
  {
    field: "start_time_ts",
    headerName: "Start Time",
    flex: 1,
    valueGetter: (value) => (value ? new Date(value) : null),
    type: "dateTime",
  },
  { field: "duration", headerName: "Duration", flex: 1 },
];

export const jobsStore = createResourceStore(ENDPOINTS.JOBS);

export function useJobsData(selector) {
  return useResourceStore(jobsStore, selector);
}
