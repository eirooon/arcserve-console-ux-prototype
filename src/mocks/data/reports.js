// Modeled after the legacy app's report catalog
// (/analyze/reports/* routes in
// arcservedev-cloudconsole_frontend/src/routes/router.config.js: backup
// jobs, policy tasks, restore jobs, data transfer, capacity usage, etc).
export const reports = [
  {
    id: "rpt-001",
    report_name: "Backup Job Summary",
    report_type: "backup_jobs",
    schedule: "Daily 06:00",
    last_generated: "2026-08-27T06:00:00.000Z",
  },
  {
    id: "rpt-002",
    report_name: "Capacity Usage Trend",
    report_type: "capacity_usage",
    schedule: "Weekly - Mon 07:00",
    last_generated: "2026-08-25T07:00:00.000Z",
  },
  {
    id: "rpt-003",
    report_name: "Restore Jobs",
    report_type: "restore_jobs",
    schedule: "On demand",
    last_generated: "2026-08-20T14:12:00.000Z",
  },
  {
    id: "rpt-004",
    report_name: "Plan Tasks",
    report_type: "policy_tasks",
    schedule: "Monthly - 1st 08:00",
    last_generated: "2026-08-01T08:00:00.000Z",
  },
];
