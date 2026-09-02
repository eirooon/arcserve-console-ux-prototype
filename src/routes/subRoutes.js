export const subRoutes = {
  "/dashboard/protection-intent-setup": {
    id: "protection-intent-setup",
    label: "ArcGenie Protection Intent Setup",
    parent: "/dashboard",
  },
  "/arcgenie/overview/needs-attention": {
    id: "arcgenie-needs-attention",
    label: "Needs Attention",
    parent: "/arcgenie/overview",
  },
  "__section__/arcgenie-backup-protection": {
    id: "arcgenie-backup-protection",
    label: "Backup Protection",
    parent: "/arcgenie/overview",
  },
  "/arcgenie/overview/auto-protect": {
    id: "arcgenie-goal-detail-auto-protect",
    label: "Goal Details",
    parent: "__section__/arcgenie-backup-protection",
  },
  "/sources/all-sources": {
    id: "all",
    label: "All Sources",
    parent: "/sources",
    count: 123,
  },
  "/sources/machines": {
    id: "machines",
    label: "Machines",
    parent: "/sources",
    count: 2,
  },
  "/sources/machines-without-plan": {
    id: "no-plan",
    label: "Machines without Plan",
    parent: "/sources",
    count: 30,
  },
  "/sources/agentless-vms": {
    id: "agentless",
    label: "Agentless VMs",
    parent: "/sources",
    count: 60,
  },
  "/sources/unc-nfs-paths": {
    id: "unc",
    label: "UNC/NFS Paths",
    parent: "/sources",
    count: 8,
  },
  "/destinations/recovery-point-servers": {
    id: "rps",
    label: "Recovery Point Servers",
    parent: "/destinations",
    count: 21,
  },
  "/destinations/data-stores": {
    id: "datastores",
    label: "Data Stores",
    parent: "/destinations",
    count: 21,
  },
  "/destinations/arcserve-cyber-resilient-storage-accounts": {
    id: "acrsaccounts",
    label: "Arcserve Cyber Resilient Storage Accounts",
    parent: "/destinations",
    count: 21,
  },
  "/destinations/shared-folders": {
    id: "share-folders",
    label: "Shared Folders",
    parent: "/destinations",
    count: 21,
  },
  "/infrastructures/hypervisors": {
    id: "hypervisors",
    label: "Hypervisors",
    parent: "/infrastructures",
    count: 22,
  },
  "/infrastructures/sites": {
    id: "sites",
    label: "Sites",
    parent: "/infrastructures",
    count: 11,
  },
  "/infrastructures/storage-arrays": {
    id: "storage-arrays",
    label: "Storage Arrays",
    parent: "/infrastructures",
    count: 2,
  },
  "/infrastructures/proxies": {
    id: "proxies",
    label: "Proxies",
    parent: "/infrastructures",
    count: 5,
  },
  "/infrastructures/oracle-hosts": {
    id: "oracle-hosts",
    label: "Oracle Hosts",
    parent: "/infrastructures",
    count: 5,
  },
  "/infrastructures/cloud-accounts": {
    id: "cloud-accounts",
    label: "Cloud Accounts",
    parent: "/infrastructures",
    count: 5,
  },
  "/infrastructures/cloud-protection-orchestrators": {
    id: "cloud-protection-orchestrators",
    label: "Cloud Protection Orchestrators",
    parent: "/infrastructures",
    count: 5,
  },
  "/disaster-recovery/dr-runbooks": {
    id: "dr-runbooks",
    label: "DR Runbooks",
    parent: "/disaster-recovery",
    count: 18,
  },
  "/disaster-recovery/instant-vms": {
    id: "instant-vms",
    label: "Instant VMs",
    parent: "/disaster-recovery",
    count: 18,
  },
  "/disaster-recovery/mounted-recovery-points": {
    id: "mounted-recovery-points",
    label: "Mounted Recovery Points",
    parent: "/disaster-recovery",
    count: 18,
  },
  "/disaster-recovery/virtual-standby": {
    id: "virtual-standby",
    label: "Virtual Standby",
    parent: "/disaster-recovery",
    count: 18,
  },
  "/disaster-recovery/dr-runbooks/new": {
    id: "dr-runbook-new",
    label: "Add DR Runbook",
    parent: "/disaster-recovery/dr-runbooks",
  },
  "/reports/backup-jobs": {
    id: "backup-jobs",
    label: "Backup Jobs",
    parent: "/reports",
    count: 5,
  },
  "/reports/data-transfer": {
    id: "data-transfer",
    label: "Data Transfer",
    parent: "/reports",
    count: 5,
  },
  "/reports/managed-report-schedules": {
    id: "managed-report-schedules",
    label: "Managed Report Schedules",
    parent: "/reports",
    count: 5,
  },
  "/reports/recovery-point": {
    id: "recovery-point",
    label: "Recovery Point",
    parent: "/reports",
    count: 5,
  },
  "/reports/source-protection": {
    id: "source-protection",
    label: "Source Protection",
    parent: "/reports",
    count: 5,
  },
  "/reports/stored-data": {
    id: "stored-data",
    label: "Stored Data",
    parent: "/reports",
    count: 5,
  },
  "/settings/source-groups": {
    id: "source-groups",
    label: "Source Groups",
    parent: "/settings",
    count: 5,
  },
  "/settings/roles": {
    id: "roles",
    label: "Roles",
    parent: "/settings",
    count: 5,
  },
  "/settings/entitlements": {
    id: "entitlements",
    label: "Entitlements",
    parent: "/settings",
    count: 5,
  },
  "/settings/branding": {
    id: "branding",
    label: "Branding",
    parent: "/settings",
    count: 5,
  },
  "/settings/source-discovery-configuration": {
    id: "source-discovery-configuration",
    label: "Source Discovery Configuration",
    parent: "/settings",
    count: 5,
  },
  "/settings/default-deployment-settings": {
    id: "default-deployment-settings",
    label: "Default Deployment Settings",
    parent: "/settings",
    count: 5,
  },
  "/settings/approval-workflows": {
    id: "approval-workflows",
    label: "Approval Workflows",
    parent: "/settings",
    count: 5,
  },
};

const subRouteIdToLabel = Object.fromEntries(
  Object.values(subRoutes).map((route) => [route.id, route.label]),
);

/**
 * Resolves a sub-nav selection id (e.g. from useOutletContext) to the
 * contextual entity label shown in toolbars ("Add Source", "Search plans"),
 * stripping a leading "All " (e.g. "All Sources" -> "Sources").
 */
export function getContextLabel(selectedId) {
  return (subRouteIdToLabel[selectedId] ?? "").replace(/^All\s+/i, "") || null;
}
