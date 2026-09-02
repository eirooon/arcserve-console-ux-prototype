import { createCrudHandlers } from "../createCrudHandlers";
import { ENDPOINTS } from "../../api/endpoints";
import { sources } from "../data/sources";
import { destinations } from "../data/destinations";
import { jobs } from "../data/jobs";
import { plans } from "../data/plans";
import { alertRules } from "../data/alertRules";
import { infrastructure } from "../data/infrastructure";
import { disasterRecoveryRunbooks } from "../data/disasterRecovery";
import { auditLogs } from "../data/auditLogs";
import { reports } from "../data/reports";
import { settings } from "../data/settings";
import { needsAttentionItems } from "../data/needsAttention";
import { activityLogItems } from "../data/activityLog";

export const handlers = [
  ...createCrudHandlers(ENDPOINTS.SOURCES, sources),
  ...createCrudHandlers(ENDPOINTS.DESTINATIONS, destinations),
  ...createCrudHandlers(ENDPOINTS.JOBS, jobs),
  ...createCrudHandlers(ENDPOINTS.PLANS, plans),
  ...createCrudHandlers(ENDPOINTS.ALERT_RULES, alertRules),
  ...createCrudHandlers(ENDPOINTS.INFRASTRUCTURE, infrastructure),
  ...createCrudHandlers(ENDPOINTS.DISASTER_RECOVERY, disasterRecoveryRunbooks),
  ...createCrudHandlers(ENDPOINTS.AUDIT_LOGS, auditLogs),
  ...createCrudHandlers(ENDPOINTS.REPORTS, reports),
  ...createCrudHandlers(ENDPOINTS.SETTINGS, settings),
  ...createCrudHandlers(ENDPOINTS.NEEDS_ATTENTION, needsAttentionItems),
  ...createCrudHandlers(ENDPOINTS.ARCGENIE_ACTIVITY_LOG, activityLogItems),
];
