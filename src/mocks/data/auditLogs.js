// Modeled after the legacy app's audit trail
// (/analyze/audit_logs/all in arcservedev-cloudconsole_frontend, backed by
// SEARCH_SOURCES-style query params in state/api/apiUrlConstants.js).
export const auditLogs = [
  {
    id: "log-001",
    timestamp: "2026-08-27T20:12:00.000Z",
    user: "erron.sevilla@arcserve.com",
    action: "plan.update",
    target: "Daily SQL Backup",
    result: "success",
  },
  {
    id: "log-002",
    timestamp: "2026-08-27T18:44:00.000Z",
    user: "admin@arcserve.com",
    action: "source.add",
    target: "SQL-PROD-01",
    result: "success",
  },
  {
    id: "log-003",
    timestamp: "2026-08-27T16:05:00.000Z",
    user: "admin@arcserve.com",
    action: "user.login",
    target: "-",
    result: "success",
  },
  {
    id: "log-004",
    timestamp: "2026-08-26T22:30:00.000Z",
    user: "svc-automation",
    action: "destination.delete",
    target: "Cloud Volume - Archive",
    result: "denied",
  },
];
