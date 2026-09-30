import { describe, expect, it } from "vitest";
import { ROLE_ACTIONS_BY_SERVICE } from "./azureMockData";
import { describeGoalChange } from "./useAzureAccountDetails";

const goals = (backupVms, virtualStandby, rpsCopy) => ({ backupVms, virtualStandby, rpsCopy });

describe("describeGoalChange", () => {
  it("needs no Azure changes when the services used stay the same", () => {
    // Backing up VMs already uses Compute and Blob Storage.
    const change = describeGoalChange(goals(true, false, false), goals(true, true, true), { hasApp: true, hasStorage: true });
    expect(change.addedServices).toEqual([]);
    expect(change.removedServices).toEqual([]);
    expect(change.createsStorage).toBe(false);
  });

  it("adds Blob Storage permissions and a storage account when none exists", () => {
    const change = describeGoalChange(goals(false, true, false), goals(true, true, false), { hasApp: true, hasStorage: false });
    expect(change.addedServices).toEqual(["blobStorage"]);
    expect(change.addedActionCount).toBe(ROLE_ACTIONS_BY_SERVICE.blobStorage.length);
    expect(change.createsStorage).toBe(true);
  });

  it("reuses the storage account that's already there", () => {
    const change = describeGoalChange(goals(false, true, false), goals(true, true, false), { hasApp: true, hasStorage: true });
    expect(change.createsStorage).toBe(false);
  });

  it("removes permissions the app no longer needs", () => {
    // RPS storage writes with the storage key, so it keeps no app permissions.
    const change = describeGoalChange(goals(true, true, false), goals(false, true, true), { hasApp: true, hasStorage: true });
    expect(change.removedServices).toEqual(["blobStorage"]);
    expect(change.removedActionCount).toBe(ROLE_ACTIONS_BY_SERVICE.blobStorage.length);
  });
});

describe("describeGoalChange — app identity", () => {
  it("sets up an app when a goal that needs one is added to an RPS-only account", () => {
    const change = describeGoalChange(goals(false, false, true), goals(false, true, true), { hasApp: false, hasStorage: true });
    expect(change.createsApp).toBe(true);
    expect(change.addedServices).toEqual([]);
  });

  it("stops using the app when only RPS storage is left", () => {
    const change = describeGoalChange(goals(true, false, false), goals(false, false, true), { hasApp: true, hasStorage: true });
    expect(change.stopsUsingApp).toBe(true);
    expect(change.removedServices).toEqual([]);
  });
});

describe("describeGoalChange — who needs to sign in", () => {
  const custom = { name: "Arcserve Backup Role", isNew: true };
  const adminRole = { name: "Contoso VM Operator", isNew: false };

  it("needs no sign-in when no app or role changes", () => {
    const change = describeGoalChange(goals(true, false, false), goals(true, false, true), {
      hasApp: true,
      hasStorage: true,
      role: custom,
    });
    expect(change.requiredRights).toEqual([]);
  });

  it("needs every right to set up a new app", () => {
    const change = describeGoalChange(goals(false, false, true), goals(true, false, true), { hasApp: false, hasStorage: true });
    expect(change.requiredRights).toEqual(expect.arrayContaining(["registerApps", "createRoles", "assignRoles"]));
  });

  it("needs to update Arcserve's custom role when its permissions change", () => {
    const change = describeGoalChange(goals(false, true, false), goals(true, true, false), {
      hasApp: true,
      hasStorage: false,
      role: custom,
    });
    expect(change.requiredRights).toContain("createRoles");
  });

  it("blocks adding permissions an admin's role doesn't have", () => {
    const change = describeGoalChange(goals(false, true, false), goals(true, true, false), {
      hasApp: true,
      hasStorage: false,
      role: adminRole,
    });
    expect(change.missingRoleActions).toContain("Microsoft.Storage/storageAccounts/blobServices/containers/write");
  });
});
