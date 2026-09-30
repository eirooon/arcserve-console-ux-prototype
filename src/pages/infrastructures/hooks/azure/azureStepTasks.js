/**
 * What each wizard step creates in Azure when its primary button is pressed.
 * Creating per step (not all at the end) means an error surfaces on the step
 * whose choices caused it, where it can be fixed and retried.
 *
 * Each task: [id, activeLabel, doneLabel, durationMs, description?].
 * An empty list means the step has nothing to create (e.g. an existing app
 * with a validated secret), so its button is simply "Next".
 */
export function buildStepTasks(stepId, summary) {
  const { app, role, storage } = summary;
  if (stepId === "app" && app) {
    if (app.isNew) {
      return [
        ["registerApp", `Registering ${app.name} in Microsoft Entra ID`, `Registered ${app.name} in Microsoft Entra ID`, 1500],
        ["createSecret", "Creating a client secret", "Created a client secret", 1200],
      ];
    }
    return app.secretIsNew
      ? [["createSecret", `Creating a client secret for ${app.name}`, `Created a client secret for ${app.name}`, 1200]]
      : [];
  }
  if (stepId === "permissions" && role) {
    const scope = role.scopes.map((item) => item.name).join(", ");
    return [
      ...(role.isNew ? [["createRole", `Creating custom role ${role.name}`, `Created custom role ${role.name}`, 1200]] : []),
      [
        "assignRole",
        `Assigning ${role.name} on ${scope}`,
        `Assigned ${role.name} on ${scope}`,
        2500,
        "Waiting for Azure to apply the role assignment. This is normal and can take a couple of minutes.",
      ],
    ];
  }
  if (stepId === "storage" && storage) {
    return [
      storage.resourceGroupIsNew
        ? ["resourceGroup", `Creating resource group ${storage.resourceGroup}`, `Created resource group ${storage.resourceGroup}`, 1200]
        : ["resourceGroup", `Checking resource group ${storage.resourceGroup}`, `Checked resource group ${storage.resourceGroup}`, 800],
      storage.accountIsNew
        ? ["storageAccount", `Creating storage account ${storage.account}`, `Created storage account ${storage.account}`, 1800]
        : ["storageAccount", `Connecting to storage account ${storage.account}`, `Connected to storage account ${storage.account}`, 1000],
      ...(role?.grantsStorageAccess
        ? [["storageAccess", "Giving the app access to the storage account", "Gave the app access to the storage account", 1000]]
        : []),
    ];
  }
  return [];
}

/** Primary button label for a step, before anything has run. */
export function getCreateLabel(stepId, summary) {
  const { app, role, storage } = summary;
  if (stepId === "app") return app?.isNew ? "Create App" : "Create Secret";
  if (stepId === "permissions") return role?.isNew ? "Create and Assign Role" : "Assign Role";
  if (stepId === "storage") return storage && !storage.resourceGroupIsNew && !storage.accountIsNew ? "Connect Storage" : "Create Storage";
  return "Next";
}

/** What a finished step created, for the Cancel / Start Over cleanup prompt. */
export function describeCreated(stepId, summary) {
  const { app, role, storage } = summary;
  if (stepId === "app" && app) {
    return app.isNew ? [`App registration ${app.name} and its client secret`] : [`A client secret for ${app.name}`];
  }
  if (stepId === "permissions" && role) {
    return [...(role.isNew ? [`Custom role ${role.name}`] : []), `The role assignment for ${role.name}`];
  }
  if (stepId === "storage" && storage) {
    return [
      ...(storage.resourceGroupIsNew ? [`Resource group ${storage.resourceGroup}`] : []),
      ...(storage.accountIsNew ? [`Storage account ${storage.account}`] : []),
    ];
  }
  return [];
}
