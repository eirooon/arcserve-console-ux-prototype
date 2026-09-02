/*
 * Endpoint catalog for the console API.
 *
 * Path naming intentionally mirrors the equivalent constants in the legacy
 * arcservedev-cloudconsole_frontend project's src/state/api/apiUrlConstants.js
 * so this list can be swapped from mocked (MSW) to a real backend later by
 * only changing VITE_API_BASE_URL and removing the mock worker.
 */
const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const ENDPOINTS = {
  SOURCES: `${BASE}/sources`,
  DESTINATIONS: `${BASE}/destinations`,
  JOBS: `${BASE}/jobs`,
  PLANS: `${BASE}/plans`,
  ALERT_RULES: `${BASE}/alert-rules`,
  INFRASTRUCTURE: `${BASE}/infrastructure`,
  DISASTER_RECOVERY: `${BASE}/dr-runbooks`,
  AUDIT_LOGS: `${BASE}/audit-logs`,
  REPORTS: `${BASE}/reports`,
  SETTINGS: `${BASE}/settings`,
  NEEDS_ATTENTION: `${BASE}/arcgenie/needs-attention`,
  ARCGENIE_ACTIVITY_LOG: `${BASE}/arcgenie/activity-log`,
};
