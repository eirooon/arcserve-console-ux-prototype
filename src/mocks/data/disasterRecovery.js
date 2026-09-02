// Modeled after the legacy app's DR Runbooks feature
// (/protect/recovered_resources/dr_runbooks in
// arcservedev-cloudconsole_frontend/src/routes/router.config.js).
export const disasterRecoveryRunbooks = [
  {
    id: "rb-001",
    runbook_name: "SQL Cluster Failover",
    status: "active",
    source_count: 4,
    last_run_ts: "2026-08-20T10:00:00.000Z",
    last_run_status: "success",
  },
  {
    id: "rb-002",
    runbook_name: "Full Site Failover - East",
    status: "draft",
    source_count: 12,
    last_run_ts: null,
    last_run_status: null,
  },
  {
    id: "rb-003",
    runbook_name: "Web Tier Recovery",
    status: "active",
    source_count: 3,
    last_run_ts: "2026-08-15T09:30:00.000Z",
    last_run_status: "failed",
  },
];
