// Mock Azure tenant data for the simulated "Add Cloud Account - Microsoft
// Azure" flow (Figma "UXD-17 Skyline", nodes 10301:13780 → 10306:17708).
// Nothing here talks to Azure; it only gives the prototype believable,
// internally consistent values to show on every step.

export const TENANT = {
  name: "Contoso Ltd.",
  id: "6f1c2e4a-8b3d-4c71-9a2e-5d0b7f3e1a94",
};

export const SUBSCRIPTIONS = [
  { id: "be12c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d", name: "Contoso Production" },
  { id: "c7a9e1f3-2b4d-4f6a-8c0e-1a3c5e7a9b1d", name: "Contoso Development" },
];

const [PRODUCTION, DEVELOPMENT] = SUBSCRIPTIONS;

export const DEFAULT_SUBSCRIPTION = PRODUCTION;

// Accounts offered by the simulated Microsoft sign-in window. Nothing is
// checked at sign-in; each right is checked only on the step that needs it,
// so each account reaches a different branch:
// - registerApps: create a new app registration (App Identity step)
// - createRoles / assignRoles: per subscription (Permissions step)
export const DEMO_ACCOUNTS = [
  {
    email: "it.admin@contoso.com",
    name: "Contoso IT Admin",
    initials: "IA",
    demoHint: "Owner on Contoso Production — can set up everything",
    access: {
      registerApps: true,
      createRoles: { [PRODUCTION.id]: true, [DEVELOPMENT.id]: false },
      assignRoles: { [PRODUCTION.id]: true, [DEVELOPMENT.id]: false },
    },
  },
  {
    email: "backup.operator@contoso.com",
    name: "Backup Operator",
    initials: "BO",
    demoHint: "Can't create apps or roles — uses an existing app and role",
    access: {
      registerApps: false,
      createRoles: { [PRODUCTION.id]: false, [DEVELOPMENT.id]: false },
      assignRoles: { [PRODUCTION.id]: true, [DEVELOPMENT.id]: false },
    },
  },
  {
    email: "john.doe@mail.com",
    name: "John Doe",
    initials: "JD",
    demoHint: "Can't assign roles — hands setup to an admin",
    access: {
      registerApps: true,
      createRoles: { [PRODUCTION.id]: false, [DEVELOPMENT.id]: false },
      assignRoles: { [PRODUCTION.id]: false, [DEVELOPMENT.id]: false },
    },
  },
];

export const REGIONS = ["East US", "East US 2", "West US 2", "Central US", "West Europe", "Southeast Asia"];

// Resource groups offered for the backup storage account (Storage step).
export const EXISTING_RESOURCE_GROUPS = ["contoso-shared-rg", "backup-rg"];

export const EXISTING_STORAGE_ACCOUNTS = ["contosoprodstore01", "contosobackupdata"];

// "Sensible defaults" promised by the Storage step's subtitle, and the names
// the Review step shows unless the user changes them.
export const LOCATION_DEFAULTS = {
  region: "East US",
  resourceGroupMode: "new",
  resourceGroupName: "arcserve-backup-rg",
  existingResourceGroup: "",
  storageMode: "new",
  storageAccountName: "arcservebkp7f3k",
  existingStorageAccount: "",
};

// Step 2 "What do you want to use Azure for?". `uses` lists the Azure
// services each goal needs; `needsApp` / `needsStorage` decide which steps
// the wizard shows — RPS writes with the storage account's key, so it needs
// no app, and Virtual Standby writes no backup data, so it needs no storage.
export const AZURE_SERVICES = { compute: "Azure Compute", blobStorage: "Blob Storage" };

export const GOAL_OPTIONS = [
  {
    key: "backupVms",
    label: "Back up Azure VMs",
    description: "Protect virtual machines running in Azure.",
    uses: ["compute", "blobStorage"],
    needsApp: true,
    needsStorage: true,
  },
  {
    key: "virtualStandby",
    label: "Virtual Standby in Azure",
    description: "Keep standby VMs ready in Azure so you can fail over if on-premises machines go down.",
    uses: ["compute"],
    needsApp: true,
    needsStorage: false,
  },
  {
    key: "rpsCopy",
    label: "Use Azure storage for RPS",
    description: "Let your Recovery Point Server write backups directly to Azure storage, or keep a copy there.",
    uses: ["blobStorage"],
    needsApp: false,
    needsStorage: true,
  },
];

const selectedGoals = (goals) => GOAL_OPTIONS.filter((goal) => goals[goal.key]);

/** What the selected goals require: an app identity, a storage account. */
export function getGoalNeeds(goals) {
  const selected = selectedGoals(goals);
  return {
    needsApp: selected.some((goal) => goal.needsApp),
    needsStorage: selected.some((goal) => goal.needsStorage),
    protectsVms: Boolean(goals.backupVms),
  };
}

export const APP_REGISTRATION_NAME = "Arcserve Backup – Contoso";
export const CUSTOM_ROLE_NAME = "Arcserve Backup Role";

export const GENERATED_CLIENT_ID = "a4e8c2f6-9b1d-4e7a-8f3c-2d6b0e9a5c17";
export const GENERATED_CLIENT_SECRET = "Qm8Q~vT3kZp.9xLr2WbN_fHd7sYc4GjE1uAoK6";

export const SECRET_EXPIRY_OPTIONS = [
  { months: 6, label: "6 months" },
  { months: 12, label: "12 months" },
  { months: 24, label: "24 months" },
];

// App registrations an Azure admin already created in the tenant. Creating
// a new client secret on one needs you to be one of its owners.
export const EXISTING_APPS = [
  {
    id: "app-1",
    name: "Arcserve-Backup-App",
    clientId: "7d2f9a41-3c8e-4b6d-a1f0-9e5c2b8d4a73",
    owners: ["it.admin@contoso.com"],
  },
  {
    id: "app-2",
    name: "Contoso-Backup-Automation",
    clientId: "b91e4c07-6a2d-4f83-9c5b-2e7a0d1f8c46",
    owners: ["it.admin@contoso.com", "backup.operator@contoso.com"],
  },
];

// The actions the app's role needs, grouped by the Azure service that needs
// them, so the role only carries what the chosen goals use. Shown by "View"
// on the Review step and "View Permissions" on the account page.
export const ROLE_ACTIONS_BY_SERVICE = {
  compute: [
    "Microsoft.Compute/virtualMachines/read",
    "Microsoft.Compute/virtualMachines/write",
    "Microsoft.Compute/virtualMachines/delete",
    "Microsoft.Compute/virtualMachines/start/action",
    "Microsoft.Compute/virtualMachines/powerOff/action",
    "Microsoft.Compute/virtualMachines/instanceView/read",
    "Microsoft.Compute/disks/read",
    "Microsoft.Compute/disks/write",
    "Microsoft.Compute/disks/delete",
    "Microsoft.Compute/disks/beginGetAccess/action",
    "Microsoft.Compute/disks/endGetAccess/action",
    "Microsoft.Compute/snapshots/read",
    "Microsoft.Compute/snapshots/write",
    "Microsoft.Compute/snapshots/delete",
    "Microsoft.Compute/snapshots/beginGetAccess/action",
    "Microsoft.Compute/snapshots/endGetAccess/action",
    "Microsoft.Network/networkInterfaces/read",
    "Microsoft.Network/networkInterfaces/write",
    "Microsoft.Network/virtualNetworks/subnets/join/action",
  ],
  blobStorage: [
    "Microsoft.Storage/storageAccounts/read",
    "Microsoft.Storage/storageAccounts/listKeys/action",
    "Microsoft.Storage/storageAccounts/blobServices/containers/read",
    "Microsoft.Storage/storageAccounts/blobServices/containers/write",
    "Microsoft.Storage/storageAccounts/blobServices/containers/delete",
    "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action",
  ],
};

export const ROLE_ACTIONS = Object.values(ROLE_ACTIONS_BY_SERVICE).flat();

// Roles already defined in the subscription. "*" grants every action.
export const EXISTING_ROLES = [
  { id: "role-1", name: "Arcserve Backup Role (created by IT)", builtIn: false, actions: ROLE_ACTIONS },
  {
    id: "role-2",
    name: "Contoso VM Operator",
    builtIn: false,
    actions: [
      "Microsoft.Compute/virtualMachines/read",
      "Microsoft.Compute/virtualMachines/instanceView/read",
      "Microsoft.Compute/disks/read",
      "Microsoft.Network/networkInterfaces/read",
    ],
  },
  { id: "role-3", name: "Contributor", builtIn: true, actions: ["*"] },
  { id: "role-4", name: "Reader", builtIn: true, actions: ["*/read"] },
];

/** Azure services (keys of AZURE_SERVICES) used by the selected goals. */
export function getServicesForGoals(goals) {
  const services = new Set(selectedGoals(goals).flatMap((goal) => goal.uses));
  return Object.keys(AZURE_SERVICES).filter((service) => services.has(service));
}

/** Services the app identity acts on — goals that need no app are left out. */
export function getAppServicesForGoals(goals) {
  const services = new Set(
    selectedGoals(goals)
      .filter((goal) => goal.needsApp)
      .flatMap((goal) => goal.uses),
  );
  return Object.keys(AZURE_SERVICES).filter((service) => services.has(service));
}

export function getRoleActions(services) {
  return services.flatMap((service) => ROLE_ACTIONS_BY_SERVICE[service]);
}

// Azure-style wildcard match: "*" matches everything, "*/read" any read.
function grants(roleAction, required) {
  if (roleAction === "*") return true;
  if (roleAction === "*/read") return required.endsWith("/read");
  return roleAction === required;
}

/** Required actions an existing role doesn't grant (empty = enough). */
export function getMissingRoleActions(role, requiredActions) {
  return requiredActions.filter((required) => !role.actions.some((roleAction) => grants(roleAction, required)));
}

/** Where the app's role is assigned: the chosen subscription. */
export function getRoleScopes(goals, subscriptionName) {
  return getGoalNeeds(goals).needsApp ? [{ type: "subscription", name: subscriptionName }] : [];
}

/** "subscription Contoso Production", "resource group x", "3 resource groups". */
export function describeScopes(scopes) {
  if (scopes.length === 0) return "";
  if (scopes.length > 1) return `${scopes.length} resource groups`;
  const [scope] = scopes;
  return `${scope.type === "subscription" ? "subscription" : "resource group"} ${scope.name}`;
}
