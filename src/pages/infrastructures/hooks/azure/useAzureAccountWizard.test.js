import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PENDING_ADMIN_STATUS } from "../cloudServices";
import { DEMO_ACCOUNTS, LOCATION_DEFAULTS, SUBSCRIPTIONS, TENANT } from "./azureMockData";
import { getLocationErrors, getWizardSteps, useAzureAccountWizard } from "./useAzureAccountWizard";

const [itAdmin, backupOperator, noRoleRights] = DEMO_ACCOUNTS;
const [production, development] = SUBSCRIPTIONS;
const NO_ACCOUNTS = [];

const renderWizard = (cloudAccounts = NO_ACCOUNTS) =>
  renderHook(({ accounts }) => useAzureAccountWizard(accounts), { initialProps: { accounts: cloudAccounts } });

async function flushTimers() {
  await act(async () => {
    await vi.runAllTimersAsync();
  });
}

async function signInAs(result, account) {
  act(() => {
    result.current.actions.pickAccount(account);
  });
  expect(result.current.state.signIn.status).toBe("signingIn");
  await flushTimers();
}

async function goTo(result, stepId) {
  act(() => result.current.actions.goToStep(stepId));
  await flushTimers();
}

const stepIds = (goals) => getWizardSteps(goals).map((step) => step.id);

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("Sign In", () => {
  it("blocks Next before anyone signs in", () => {
    const { result } = renderWizard();
    expect(result.current.derived.canProceed).toBe(false);
  });

  it("lets any account continue — nothing is checked up front", async () => {
    const { result } = renderWizard();
    await signInAs(result, noRoleRights);
    expect(result.current.derived.canProceed).toBe(true);
    expect(Object.values(result.current.state.checks).every((check) => check.status === "idle")).toBe(true);
  });
});

describe("steps follow the chosen goals", () => {
  it("shows every step when all goals are chosen", () => {
    expect(stepIds({ backupVms: true, virtualStandby: true, rpsCopy: true })).toEqual([
      "signIn",
      "goal",
      "app",
      "permissions",
      "storage",
      "review",
    ]);
  });

  it("skips the app and permissions for RPS storage only", () => {
    expect(stepIds({ backupVms: false, virtualStandby: false, rpsCopy: true })).toEqual([
      "signIn",
      "goal",
      "storage",
      "review",
    ]);
  });

  it("skips storage for Virtual Standby only", () => {
    expect(stepIds({ backupVms: false, virtualStandby: true, rpsCopy: false })).toEqual([
      "signIn",
      "goal",
      "app",
      "permissions",
      "review",
    ]);
  });

  it("requires at least one goal", () => {
    const { result } = renderWizard();
    act(() => result.current.actions.goToStep("goal"));
    act(() => {
      ["backupVms", "virtualStandby", "rpsCopy"].forEach(result.current.actions.toggleGoal);
    });
    expect(result.current.derived.canProceed).toBe(false);
  });
});

describe("App Identity", () => {
  it("names a new app from the editable field, prefilled with a suggestion", () => {
    const { result } = renderWizard();
    expect(result.current.state.app.newName).toBe("Arcserve Backup – Contoso");
    act(() => result.current.actions.setAppField("newName", "Contoso VM Backups"));
    expect(result.current.derived.summary.app.name).toBe("Contoso VM Backups");
    act(() => result.current.actions.setAppField("newName", "Arcserve-Backup-App"));
    expect(result.current.derived.appNameError).toMatch(/already exists/);
  });

  it("doesn't pre-check app rights; a new app only needs a valid name", async () => {
    const { result } = renderWizard();
    await signInAs(result, backupOperator);
    await goTo(result, "app");
    expect(result.current.state.checks).not.toHaveProperty("registerApps");
    expect(result.current.derived.primary).toMatchObject({ label: "Create App", enabled: true });
  });

  it("reports a missing right when creating the app, then continues with an existing app", async () => {
    const { result } = renderWizard();
    await signInAs(result, backupOperator);
    await goTo(result, "app");
    act(() => {
      result.current.actions.createForStep("app", result.current.derived.summary);
    });
    await flushTimers();
    expect(result.current.state.creation.app.failure).toEqual({ reason: "registerApps" });
    expect(result.current.derived.primary).toMatchObject({ label: "Retry", enabled: false });

    act(() => {
      result.current.actions.setAppField("mode", "existing");
      result.current.actions.setAppField("existingAppId", "app-1");
    });
    expect(result.current.state.creation.app.status).toBe("idle");
    // Not an owner of app-1: creating a secret fails when it runs.
    act(() => {
      result.current.actions.createForStep("app", result.current.derived.summary);
    });
    await flushTimers();
    expect(result.current.state.creation.app.failure).toEqual({ reason: "appOwner" });

    act(() => {
      result.current.actions.setAppField("secretMode", "existing");
      result.current.actions.setAppField("secretValue", "too short");
    });
    act(() => {
      result.current.actions.validateSecret();
    });
    await flushTimers();
    expect(result.current.derived.results.secret).toBe("denied");

    act(() => result.current.actions.setAppField("secretValue", "Qm8Q~vT3kZp.9xLr2W"));
    act(() => {
      result.current.actions.validateSecret();
    });
    await flushTimers();
    expect(result.current.derived.results.secret).toBe("allowed");
    expect(result.current.derived.primary).toMatchObject({ kind: "next", enabled: true });
    expect(result.current.derived.summary.app).toMatchObject({ isNew: false, name: "Arcserve-Backup-App", secretIsNew: false });
  });

  it("lets an app owner create a new secret for an existing app", async () => {
    const { result } = renderWizard();
    await signInAs(result, backupOperator);
    await goTo(result, "app");
    act(() => {
      result.current.actions.setAppField("mode", "existing");
      result.current.actions.setAppField("existingAppId", "app-2");
    });
    act(() => {
      result.current.actions.createForStep("app", result.current.derived.summary);
    });
    await flushTimers();
    expect(result.current.state.creation.app.status).toBe("done");
  });
});

const createPermissions = async (result) => {
  act(() => {
    result.current.actions.createForStep("permissions", result.current.derived.summary);
  });
  await flushTimers();
};

describe("Permissions", () => {
  it("doesn't pre-check role rights; a custom role only needs a valid name", async () => {
    const { result } = renderWizard();
    await signInAs(result, noRoleRights);
    await goTo(result, "permissions");
    expect(result.current.derived.canProceed).toBe(true);
    act(() => result.current.actions.setRoleField("newName", "  "));
    expect(result.current.derived.roleNameError).toMatch(/Enter/);
    act(() => result.current.actions.setRoleField("newName", "Contributor"));
    expect(result.current.derived.roleNameError).toMatch(/already exists/);
    expect(result.current.derived.canProceed).toBe(false);
  });

  it("names the custom role from the editable field", async () => {
    const { result } = renderWizard();
    act(() => result.current.actions.setRoleField("newName", "Contoso Backup Role"));
    expect(result.current.derived.summary.role.name).toBe("Contoso Backup Role");
  });

  it("creates and assigns the role when the account has the rights", async () => {
    const { result } = renderWizard();
    await signInAs(result, itAdmin);
    await goTo(result, "permissions");
    await createPermissions(result);
    expect(result.current.state.creation.permissions.status).toBe("done");
  });

  it("reports a missing right when creating, and moves on after switching to an existing role", async () => {
    const { result } = renderWizard();
    await signInAs(result, backupOperator);
    await goTo(result, "permissions");
    await createPermissions(result);
    expect(result.current.state.creation.permissions).toMatchObject({ status: "failed", failure: { reason: "createRoles" } });
    // Retrying with the same account can't fix a missing right.
    expect(result.current.derived.primary).toMatchObject({ label: "Retry", enabled: false });

    act(() => {
      result.current.actions.setRoleField("mode", "existing");
      result.current.actions.setRoleField("existingRoleId", "role-1");
    });
    await flushTimers();
    expect(result.current.state.creation.permissions.status).toBe("idle");
    expect(result.current.derived.primary).toMatchObject({ label: "Assign Role", enabled: true });
  });

  it("validates an existing role against the required permissions", async () => {
    const { result } = renderWizard();
    await signInAs(result, backupOperator);
    await goTo(result, "permissions");
    act(() => {
      result.current.actions.setRoleField("mode", "existing");
      result.current.actions.setRoleField("existingRoleId", "role-2");
    });
    await flushTimers();
    expect(result.current.derived.results.roleFit).toBe("denied");
    expect(result.current.derived.missingRoleActions).toContain("Microsoft.Compute/snapshots/write");
    expect(result.current.derived.canProceed).toBe(false);

    act(() => result.current.actions.setRoleField("existingRoleId", "role-1"));
    await flushTimers();
    expect(result.current.derived.results.roleFit).toBe("allowed");
    expect(result.current.derived.canProceed).toBe(true);
  });

  it("treats Reader as missing every write permission", async () => {
    const { result } = renderWizard();
    await signInAs(result, backupOperator);
    await goTo(result, "permissions");
    act(() => {
      result.current.actions.setRoleField("mode", "existing");
      result.current.actions.setRoleField("existingRoleId", "role-4");
    });
    await flushTimers();
    expect(result.current.derived.missingRoleActions).not.toContain("Microsoft.Compute/disks/read");
    expect(result.current.derived.missingRoleActions).toContain("Microsoft.Compute/snapshots/delete");
  });

  it("reports that the account can't assign roles when assigning", async () => {
    const { result } = renderWizard();
    await signInAs(result, noRoleRights);
    await goTo(result, "permissions");
    act(() => {
      result.current.actions.setRoleField("mode", "existing");
      result.current.actions.setRoleField("existingRoleId", "role-1");
    });
    await flushTimers();
    await createPermissions(result);
    expect(result.current.state.creation.permissions.failure).toEqual({ reason: "assignRoles" });
  });

  it("checks rights on the subscription chosen here", async () => {
    const { result } = renderWizard();
    await signInAs(result, itAdmin);
    await goTo(result, "permissions");
    act(() => result.current.actions.setSubscription(development.id));
    await createPermissions(result);
    expect(result.current.state.creation.permissions.failure).toEqual({ reason: "createRoles" });
  });

  it("assigns the role on the chosen subscription", () => {
    const { result } = renderWizard();
    act(() => result.current.actions.setSubscription(development.id));
    expect(result.current.derived.summary.role.scopes).toEqual([{ type: "subscription", name: development.name }]);
  });
});

describe("creating per step", () => {
  it("creates the app from the App step, then moves on with Next", async () => {
    const { result } = renderWizard();
    await signInAs(result, itAdmin);
    await goTo(result, "app");
    expect(result.current.derived.primary).toMatchObject({ kind: "create", label: "Create App", enabled: true });

    act(() => {
      result.current.actions.createForStep("app", result.current.derived.summary);
    });
    expect(result.current.derived.primary.kind).toBe("running");
    await flushTimers();
    expect(result.current.state.creation.app.status).toBe("done");
    expect(result.current.derived.primary).toMatchObject({ kind: "next", enabled: true });
    // What was made from the App and Goal steps is now fixed.
    expect(result.current.derived.locked).toMatchObject({ app: true, goal: true, signIn: true });
    expect(result.current.derived.createdItems[0]).toMatch(/App registration/);
  });

  it("needs nothing created for an existing app with a validated secret", async () => {
    const { result } = renderWizard();
    await signInAs(result, backupOperator);
    await goTo(result, "app");
    act(() => {
      result.current.actions.setAppField("mode", "existing");
      result.current.actions.setAppField("existingAppId", "app-1");
      result.current.actions.setAppField("secretMode", "existing");
      result.current.actions.setAppField("secretValue", "Qm8Q~vT3kZp.9xLr2W");
    });
    act(() => {
      result.current.actions.validateSecret();
    });
    await flushTimers();
    expect(result.current.derived.primary).toMatchObject({ kind: "next", enabled: true });
  });

  it("stops on a simulated failure and retries from the failed task", async () => {
    const { result } = renderWizard();
    await signInAs(result, itAdmin);
    act(() => result.current.actions.setSimulateFailure(true));
    await goTo(result, "app");
    act(() => {
      result.current.actions.createForStep("app", result.current.derived.summary);
    });
    await flushTimers();
    expect(result.current.state.creation.app.status).toBe("failed");
    expect(result.current.derived.primary).toMatchObject({ kind: "create", label: "Retry" });

    act(() => {
      result.current.actions.createForStep("app", result.current.derived.summary);
    });
    await flushTimers();
    expect(result.current.state.creation.app.status).toBe("done");
  });

  it("starts over from Sign In, signed out, with nothing kept", async () => {
    const { result } = renderWizard();
    await signInAs(result, itAdmin);
    await goTo(result, "app");
    act(() => {
      result.current.actions.createForStep("app", result.current.derived.summary);
    });
    await flushTimers();
    act(() => result.current.actions.restart());
    expect(result.current.state.stepId).toBe("signIn");
    expect(result.current.derived.signedIn).toBe(false);
    expect(result.current.derived.anyCreated).toBe(false);
  });
});

describe("summary", () => {
  it("has no app or role for RPS storage only", () => {
    const { result } = renderWizard();
    act(() => {
      result.current.actions.toggleGoal("backupVms");
      result.current.actions.toggleGoal("virtualStandby");
    });
    expect(result.current.derived.summary.app).toBeNull();
    expect(result.current.derived.summary.role).toBeNull();
    expect(result.current.derived.summary.storage).not.toBeNull();
  });

  it("has no storage for Virtual Standby only", () => {
    const { result } = renderWizard();
    act(() => {
      result.current.actions.toggleGoal("backupVms");
      result.current.actions.toggleGoal("rpsCopy");
    });
    expect(result.current.derived.summary.storage).toBeNull();
    expect(result.current.derived.summary.role.grantsStorageAccess).toBe(false);
  });
});

describe("already-connected tenant", () => {
  const connected = { id: "ca-9", type: "cloud_account", name: "Azure - Contoso Ltd", tenantId: TENANT.id };

  it("updates the existing account by default instead of creating a duplicate", async () => {
    const { result } = renderWizard([connected]);
    await signInAs(result, itAdmin);
    expect(result.current.derived.existingTenantAccount).toBe(connected);
    expect(result.current.derived.summary.targetAccountId).toBe("ca-9");
    expect(result.current.derived.displayName).toBe(connected.name);
  });

  it("suggests a unique name when adding a separate account for the same tenant", async () => {
    const { result } = renderWizard([connected]);
    await signInAs(result, itAdmin);
    act(() => result.current.actions.setConnectionChoice("separate"));
    expect(result.current.derived.summary.targetAccountId).toBeNull();
    expect(result.current.derived.displayName).toBe(`Azure - Contoso Ltd - ${production.name}`);
    expect(result.current.derived.displayNameError).toBeNull();
  });

  it("finishes a setup that is pending with an admin", async () => {
    const pending = { ...connected, status: PENDING_ADMIN_STATUS, adminEmail: "admin@contoso.com" };
    const { result } = renderWizard([pending]);
    await signInAs(result, itAdmin);
    expect(result.current.derived.summary.targetAccountId).toBe(pending.id);
    expect(result.current.derived.summary.policyCount).toBe(0);
  });
});

describe("display name and admin link", () => {
  it("rejects empty and duplicate names", () => {
    const { result } = renderWizard([{ id: "x", type: "cloud_account", name: "Finance Azure" }]);
    act(() => result.current.actions.setDisplayName("  "));
    expect(result.current.derived.displayNameError).toMatch(/Enter/);
    act(() => result.current.actions.setDisplayName("finance azure"));
    expect(result.current.derived.displayNameError).toMatch(/already uses/);
    act(() => result.current.actions.setDisplayName("Azure - Finance"));
    expect(result.current.derived.displayNameError).toBeNull();
  });

  it("only enables Send Link for a valid email", () => {
    const { result } = renderWizard();
    act(() => result.current.actions.setAdminEmail("admin@"));
    expect(result.current.derived.canSendAdminLink).toBe(false);
    act(() => result.current.actions.setAdminEmail("admin@contoso.com"));
    expect(result.current.derived.canSendAdminLink).toBe(true);
  });
});

describe("getLocationErrors", () => {
  it("accepts the prefilled defaults", () => {
    expect(getLocationErrors(LOCATION_DEFAULTS)).toEqual({});
  });

  it("rejects storage account names Azure wouldn't accept", () => {
    for (const name of ["ab", "Has-Upper", "has-dash", "a".repeat(25)]) {
      expect(getLocationErrors({ ...LOCATION_DEFAULTS, storageAccountName: name })).toHaveProperty("storageAccountName");
    }
  });

  it("requires a pick when using an existing resource group or storage account", () => {
    const errors = getLocationErrors({ ...LOCATION_DEFAULTS, resourceGroupMode: "existing", storageMode: "existing" });
    expect(errors).toHaveProperty("existingResourceGroup");
    expect(errors).toHaveProperty("existingStorageAccount");
  });
});
