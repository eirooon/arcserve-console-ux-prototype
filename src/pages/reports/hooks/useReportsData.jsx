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

// Mirrors the left sub-navigation items in subRoutes.js (id -> report_type)
// so selecting "Backup Jobs", "Data Transfer", etc. filters the shared
// Reports table down to just that category.
export function filterReportsByCategory(rows, categoryId) {
  switch (categoryId) {
    case "backup-jobs":
      return rows.filter((row) => row.report_type === "backup_jobs");
    case "data-transfer":
      return rows.filter((row) => row.report_type === "capacity_usage");
    case "managed-report-schedules":
      return rows.filter((row) => row.report_type === "report_schedule");
    case "recovery-point":
      return rows.filter((row) => row.report_type === "restore_jobs");
    case "source-protection":
      return rows.filter((row) => row.report_type === "policy_tasks");
    case "stored-data":
      return rows.filter((row) => row.report_type === "stored_data");
    default:
      return rows;
  }
}

export const reportsStore = createResourceStore(ENDPOINTS.REPORTS);

export function useReportsData(selector) {
  return useResourceStore(reportsStore, selector);
}
