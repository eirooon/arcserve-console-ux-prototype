import { createCrudHandlers } from "../createCrudHandlers";
import { ENDPOINTS } from "../../api/endpoints";
import { sources } from "../data/sources";
import { destinations } from "../data/destinations";
import { jobs } from "../data/jobs";
import { plans } from "../data/plans";
import { alertRules } from "../data/alertRules";
import { infrastructure } from "../data/infrastructure";
import { acrsServers } from "../data/acrsServers";
import { disasterRecoveryRunbooks } from "../data/disasterRecovery";
import { auditLogs } from "../data/auditLogs";
import { reports } from "../data/reports";
import { settings } from "../data/settings";
import { waitingOnYouItems } from "../data/waitingOnYou";
import { activityLogItems } from "../data/activityLog";
import { dismissals } from "../data/dismissals";

export const handlers = [
  ...createCrudHandlers(ENDPOINTS.SOURCES, sources),
  ...createCrudHandlers(ENDPOINTS.DESTINATIONS, destinations),
  ...createCrudHandlers(ENDPOINTS.JOBS, jobs),
  ...createCrudHandlers(ENDPOINTS.PLANS, plans),
  ...createCrudHandlers(ENDPOINTS.ALERT_RULES, alertRules),
  ...createCrudHandlers(ENDPOINTS.INFRASTRUCTURE, infrastructure),
  ...createCrudHandlers(ENDPOINTS.ACRS_SERVERS, acrsServers),
  ...createCrudHandlers(ENDPOINTS.DISASTER_RECOVERY, disasterRecoveryRunbooks),
  ...createCrudHandlers(ENDPOINTS.AUDIT_LOGS, auditLogs),
  ...createCrudHandlers(ENDPOINTS.REPORTS, reports),
  ...createCrudHandlers(ENDPOINTS.SETTINGS, settings),
  ...createCrudHandlers(ENDPOINTS.WAITING_ON_YOU, waitingOnYouItems),
  ...createCrudHandlers(ENDPOINTS.ARCGENIE_ACTIVITY_LOG, activityLogItems),
  ...createCrudHandlers(ENDPOINTS.ARCGENIE_DISMISSALS, dismissals),
];
