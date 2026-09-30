import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../../api/client", () => ({
  apiClient: { post: vi.fn(async () => ({})), put: vi.fn(async () => ({})) },
}));
vi.mock("../../../../api/toastStore", () => ({ toastStore: { pushToast: vi.fn() } }));
vi.mock("../useInfrastructureData", () => ({ infrastructureStore: { refetch: vi.fn(async () => {}) } }));

const { apiClient } = await import("../../../../api/client");
const { toastStore } = await import("../../../../api/toastStore");
const { azureProvisioningStore } = await import("./azureProvisioningStore");

const baseSummary = {
  displayName: "Azure - Contoso Ltd",
  tenantName: "Contoso Ltd.",
  tenantId: "tenant",
  subscriptionId: "sub",
  subscriptionName: "Contoso Production",
  targetAccountId: null,
  goals: ["Back up Azure VMs"],
  goalSelection: { backupVms: true, virtualStandby: false, rpsCopy: false },
  app: { isNew: true, name: "App", clientId: "id", secretIsNew: true, secretExpiryMonths: 12, clientSecret: "secret" },
  role: {
    isNew: true,
    name: "Role",
    builtIn: false,
    scopes: [{ type: "resourceGroup", name: "rg" }],
    grantsStorageAccess: true,
  },
  storage: { region: "East US", resourceGroupIsNew: true, resourceGroup: "backup-rg", accountIsNew: true, account: "store" },
  simulateFailure: false,
};

const flush = () => vi.runAllTimersAsync();
const snapshot = () => azureProvisioningStore.getSnapshot();

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(async () => {
  // Leave the module-level store idle for the next test.
  if (snapshot().status === "failed") {
    azureProvisioningStore.cleanUp();
    await flush();
  }
  azureProvisioningStore.reset();
  vi.useRealTimers();
});

const taskIds = () => snapshot().tasks.map((task) => task.id);

describe("azureProvisioningStore", () => {
  it("only verifies and connects — the wizard created everything step by step", async () => {
    azureProvisioningStore.start(baseSummary);
    expect(taskIds()).toEqual(["verify", "connect"]);
    await flush();
  });

  it("runs every task and creates the account", async () => {
    azureProvisioningStore.start(baseSummary);
    expect(snapshot().status).toBe("running");
    await flush();
    expect(snapshot().status).toBe("done");
    expect(snapshot().tasks.every((task) => task.status === "done")).toBe(true);
    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });

  it("updates the existing account instead of creating a duplicate", async () => {
    azureProvisioningStore.start({ ...baseSummary, targetAccountId: "ca-9" });
    await flush();
    expect(apiClient.post).not.toHaveBeenCalled();
    expect(apiClient.put).toHaveBeenCalledWith(expect.stringMatching(/\/ca-9$/), expect.any(Object));
  });

  it("stops on a failed task, then resumes from it on retry", async () => {
    azureProvisioningStore.start({ ...baseSummary, simulateFailure: true });
    await flush();
    expect(snapshot().status).toBe("failed");
    const failedIndex = snapshot().tasks.findIndex((task) => task.status === "failed");
    expect(snapshot().tasks.slice(0, failedIndex).every((task) => task.status === "done")).toBe(true);
    expect(apiClient.post).not.toHaveBeenCalled();

    azureProvisioningStore.retry();
    await flush();
    expect(snapshot().status).toBe("done");
    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });

  it("offers Retry from a toast when a background run fails", async () => {
    azureProvisioningStore.start({ ...baseSummary, simulateFailure: true });
    azureProvisioningStore.moveToBackground();
    await flush();
    const [, options] = toastStore.pushToast.mock.calls.at(-1);
    expect(options).toMatchObject({ severity: "error", action: { label: "Retry" } });
  });

  it("cleans up a failed run without saving anything", async () => {
    azureProvisioningStore.start({ ...baseSummary, simulateFailure: true });
    await flush();
    azureProvisioningStore.cleanUp();
    expect(snapshot().status).toBe("cleaningUp");
    await flush();
    expect(snapshot().status).toBe("idle");
    expect(apiClient.post).not.toHaveBeenCalled();
  });
});
