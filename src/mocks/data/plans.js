import { jobs } from "./jobs";
import { getLatestJobForPlan } from "./getLatestJobForPlan";

// Field names mirror the legacy app's policiesDataSet shape
// (arcservedev-cloudconsole_frontend/src/mockResponses/mockData.js). The
// legacy app calls this concept a "policy"; this app calls it a "plan".
const basePlans = [
  {
    id: "84777c50-80a5-4b6d-a5f8-038bd5015d36",
    plan_name: "Daily SQL Backup",
    plan_type: "backup_recovery",
    plan_status: "active",
    protected_sources: 4,
    unprotected_sources: 0,
    source_group: "UDP sources",
    policy_type: "Agent Based Windows Backups",
  },
  {
    id: "c76bf67c-da15-41df-b7b3-474ec0113ee6",
    plan_name: "Hypervisor Nightly",
    plan_type: "backup_recovery",
    plan_status: "active",
    protected_sources: 12,
    unprotected_sources: 1,
    source_group: null,
    policy_type: "Cloud Direct BaaS",
  },
  {
    id: "e1a5e9c1-2a3f-4b1f-9b8c-1a7e2c8f9d10",
    plan_name: "Weekly Archive",
    plan_type: "archive",
    plan_status: "paused",
    protected_sources: 0,
    unprotected_sources: 6,
    source_group: null,
    policy_type: "Agentless VM Backups",
  },
  {
    id: "f3c8b6d2-5e4a-4c9b-8a2d-3f1e0b7c6a45",
    plan_name: "DR Replication - East",
    plan_type: "replication",
    plan_status: "active",
    protected_sources: 8,
    unprotected_sources: 0,
    source_group: "UDP sources",
    policy_type: "Agent Based Windows Backups",
  },
];

// Each plan's latest_job is looked up from the shared jobs history (./jobs.js)
// rather than hardcoded, so the Plans table always reflects the same job
// records shown on the Jobs page and the Dashboard's Recent Jobs widget.
export const plans = basePlans.map((plan) => ({
  ...plan,
  latest_job: getLatestJobForPlan(jobs, plan.id),
}));
