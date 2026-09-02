// NOTE: The legacy app only models triggered alerts (alertListData in
// mockData.js), not configurable alert *rules*. This page is a new concept
// in this redesign, so the shape below is invented rather than ported —
// adjust once the real alert-rules API contract is defined.
export const alertRules = [
  {
    id: "rule-001",
    rule_name: "Backup job failed",
    condition: "job_status == failed",
    severity: "critical",
    notify_via: "email, slack",
    enabled: true,
  },
  {
    id: "rule-002",
    rule_name: "Source offline > 24h",
    condition: "connection_status == offline for 24h",
    severity: "warning",
    notify_via: "email",
    enabled: true,
  },
  {
    id: "rule-003",
    rule_name: "Storage capacity > 90%",
    condition: "capacity_used_pct > 90",
    severity: "warning",
    notify_via: "email, sms",
    enabled: true,
  },
  {
    id: "rule-004",
    rule_name: "Plan unprotected sources",
    condition: "unprotected_sources > 0",
    severity: "info",
    notify_via: "email",
    enabled: false,
  },
];
