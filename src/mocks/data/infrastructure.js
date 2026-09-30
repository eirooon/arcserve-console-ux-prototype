// Field names loosely mirror the legacy app's hypervisorListData /
// proxies / storage-arrays datasets (arcservedev-cloudconsole_frontend/
// src/mockResponses/mockData.js), collapsed into one generic infrastructure
// list since this app's Infrastructures page is a single grid.
const FIVE_MINUTES_MS = 5 * 60 * 1000;

// Settings an Azure cloud account was connected with (see the Azure
// wizard's azureProvisioningStore), shown on its Modify page.
function azureDetails(overrides) {
  return {
    tenantName: "Contoso Ltd.",
    subscriptionId: "be12c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
    subscriptionName: "Contoso Production",
    setupBy: "john.doe@contoso.com",
    lastCheckedAt: new Date(Date.now() - FIVE_MINUTES_MS).toISOString(),
    permissionsStatus: "verified",
    storage: null,
    ...overrides,
  };
}

// Sites: gateways registered to the console, either on-prem ("site") or
// deployed into a cloud account ("cloud_site"). `deployProgress` is only set
// while a cloud site is still deploying.
function sites() {
  const base = {
    type: "site",
    siteType: "cloud_site",
    cloudAccount: "Sample Cloud Name A",
    registeredEmail: "john@mail.com",
    host: "sample-host-1",
    version: "1.1",
    status: "online",
    lastContact: "2026-03-23T22:02:37",
  };
  return [
    { id: "site-001", name: "Sample Cloud Agent Name 1", status: "deploying", deployProgress: 20 },
    { id: "site-002", name: "Sample Cloud Agent Name 2", status: "failed" },
    { id: "site-003", name: "Sample Cloud Agent Name 3" },
    { id: "site-004", name: "Sample Cloud Agent Name 4" },
    { id: "site-005", name: "Sample Cloud Agent Name 5" },
    { id: "site-006", name: "Sample Cloud Agent Name 6" },
    { id: "site-007", name: "Sample Cloud Agent Name 7" },
    { id: "site-008", name: "hq-datacenter", siteType: "site", cloudAccount: null },
  ].map((site) => ({ ...base, ...site }));
}

const SECRET_EXPIRES_AT = "2027-02-01T20:37:00";

export const infrastructure = [
  {
    id: "hv-001",
    name: "vcenter-hq-01",
    type: "vmware_vcenter",
    host: "vcenter-hq-01.corp.local",
    status: "online",
    version: "8.0.2",
  },
  {
    id: "hv-002",
    name: "hyperv-east-01",
    type: "hyper_v",
    host: "hyperv-east-01.corp.local",
    status: "online",
    version: "2022",
  },
  {
    id: "proxy-001",
    name: "backup-proxy-01",
    type: "backup_proxy",
    host: "10.20.1.15",
    status: "online",
    version: "9.1.0",
  },
  {
    id: "sa-001",
    name: "storage-array-west",
    type: "storage_array",
    host: "10.20.4.30",
    status: "degraded",
    version: "5.4.1",
  },
  {
    id: "hv-003",
    name: "nutanix-cluster-01",
    type: "nutanix_ahv",
    host: "nutanix-01.corp.local",
    status: "offline",
    version: "6.8",
  },
  ...sites(),
  {
    id: "oh-001",
    name: "oracle-db-01",
    type: "oracle_host",
    host: "oracle-db-01.corp.local",
    status: "online",
    version: "19c",
  },
  {
    id: "ca-001",
    name: "Sample Account Name 01",
    type: "cloud_account",
    cloudService: "Microsoft Azure",
    status: "connected",
    lastRefresh: "2026-02-01T20:37:00",
    policyCount: 3,
    azure: azureDetails({
      goals: { backupVms: true, virtualStandby: false, rpsCopy: false },
      app: {
        name: "Arcserve Backup – Contoso",
        clientId: "3f209821-34d2-4c1a-9e7b-5a0f6d8c2b41",
        clientSecret: "Xy7Q~pL2mR9.vKd4TnWb_8sHf3GcZ1eJoA5uQ",
        isNew: true,
        secretExpiresAt: SECRET_EXPIRES_AT,
      },
      role: {
        name: "Arcserve Backup Role",
        isNew: true,
        builtIn: false,
        scopes: [{ type: "subscription", name: "Contoso Production" }],
      },
      storage: { region: "East US", resourceGroup: "arcserve-backup-rg", account: "arcservebkp7f3k" },
    }),
  },
  {
    id: "ca-002",
    name: "Sample Account Name 02",
    type: "cloud_account",
    cloudService: "Microsoft Azure",
    status: "connected",
    lastRefresh: "2026-02-01T20:37:00",
    policyCount: 3,
    azure: azureDetails({
      goals: { backupVms: false, virtualStandby: true, rpsCopy: false },
      subscriptionId: "c7a9e1f3-2b4d-4f6a-8c0e-1a3c5e7a9b1d",
      subscriptionName: "Contoso Development",
      // Set up by a backup operator with the app and role their admin made.
      app: {
        name: "Contoso-Backup-Automation",
        clientId: "b91e4c07-6a2d-4f83-9c5b-2e7a0d1f8c46",
        clientSecret: "Tn4Q~aB8wK1.zPq6RmVc_3dLf9YhX2sGoE7uN",
        isNew: false,
        secretExpiresAt: null,
      },
      role: {
        name: "Arcserve Backup Role (created by IT)",
        isNew: false,
        builtIn: false,
        scopes: [{ type: "subscription", name: "Contoso Development" }],
      },
    }),
  },
];
