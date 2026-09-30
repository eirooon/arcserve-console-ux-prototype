import { describe, expect, it } from "vitest";
import { buildStepTasks, describeCreated, getCreateLabel } from "./azureStepTasks";

const summary = {
  app: { isNew: true, name: "App", secretIsNew: true },
  role: { isNew: true, name: "Role", scopes: [{ type: "subscription", name: "Sub" }], grantsStorageAccess: true },
  storage: { resourceGroupIsNew: true, resourceGroup: "rg", accountIsNew: false, account: "store" },
};
const ids = (stepId, overrides = {}) => buildStepTasks(stepId, { ...summary, ...overrides }).map(([id]) => id);

describe("buildStepTasks", () => {
  it("registers a new app and creates its secret", () => {
    expect(ids("app")).toEqual(["registerApp", "createSecret"]);
  });

  it("has nothing to create for an existing app with an existing secret", () => {
    expect(ids("app", { app: { isNew: false, name: "App", secretIsNew: false } })).toEqual([]);
  });

  it("only assigns an existing role", () => {
    expect(ids("permissions", { role: { ...summary.role, isNew: false } })).toEqual(["assignRole"]);
  });

  it("gives the app storage access only when it writes backups", () => {
    expect(ids("storage")).toEqual(["resourceGroup", "storageAccount", "storageAccess"]);
    expect(ids("storage", { role: null })).toEqual(["resourceGroup", "storageAccount"]);
  });
});

describe("step labels and cleanup", () => {
  it("names the primary button after what the step creates", () => {
    expect(getCreateLabel("permissions", summary)).toBe("Create and Assign Role");
    expect(
      getCreateLabel("storage", { ...summary, storage: { ...summary.storage, resourceGroupIsNew: false } }),
    ).toBe("Connect Storage");
  });

  it("lists only what Arcserve created, not what already existed", () => {
    expect(describeCreated("storage", summary)).toEqual(["Resource group rg"]);
  });
});
