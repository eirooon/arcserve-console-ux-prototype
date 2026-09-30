import { useSyncExternalStore } from "react";
import { apiClient } from "../../../../api/client";
import { ENDPOINTS } from "../../../../api/endpoints";
import { toastStore } from "../../../../api/toastStore";
import { infrastructureStore } from "../useInfrastructureData";

/**
 * Simulated "Create and Connect" run for the Azure cloud account wizard.
 * Lives outside React (same external-store pattern as createResourceStore)
 * so "Continue in Background" can close the dialog without cancelling the
 * run: it keeps ticking, saves the account when finished, and notifies the
 * user with a toast — including when it fails, with a Retry action.
 *
 * status: "idle" | "running" | "failed" | "cleaningUp" | "done"
 */

const IDLE = { status: "idle", tasks: [], summary: null, backgrounded: false };
const CLEAN_UP_MS = 1800;
const FAILURE_TOAST_MS = 12000;

let state = IDLE;
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(patch) {
  state = { ...state, ...patch };
  emit();
}

function resetToIdle() {
  state = IDLE;
  emit();
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function describeVerification(summary) {
  const vms = Boolean(summary.app);
  const storage = Boolean(summary.storage);
  const target = vms && storage ? "your virtual machines and storage" : vms ? "your virtual machines" : "your storage account";
  return [`Verifying access to ${target}`, `Verified access to ${target}`];
}

// Everything in Azure was created step by step in the wizard (see
// azureStepTasks), so the last run only verifies access and connects the
// account to Arcserve.
function buildTasks(summary) {
  return [
    ["verify", ...describeVerification(summary), 1500],
    ["connect", `Connecting ${summary.displayName} to Arcserve`, `Connected ${summary.displayName} to Arcserve`, 1000],
  ].map(([key, activeLabel, doneLabel, durationMs, description]) => ({
    id: key,
    activeLabel,
    doneLabel,
    durationMs,
    description,
    status: "pending", // "pending" | "active" | "done" | "failed"
    // The prototype's "Simulate a setup failure" makes verifying fail once.
    willFail: summary.simulateFailure && key === "verify",
  }));
}

function patchTask(index, patch) {
  setState({ tasks: state.tasks.map((task, taskIndex) => (taskIndex === index ? { ...task, ...patch } : task)) });
}

const addMonths = (date, months) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next.toISOString();
};

// What the account's detail page (AzureCloudAccountDetails) shows and edits.
export function buildAzureDetails(summary) {
  const now = new Date();
  const { app, role, storage } = summary;
  return {
    tenantName: summary.tenantName,
    goals: summary.goalSelection,
    subscriptionId: summary.subscriptionId,
    subscriptionName: summary.subscriptionName,
    app: app && {
      name: app.name,
      clientId: app.clientId,
      clientSecret: app.clientSecret,
      isNew: app.isNew,
      // An existing secret's expiry isn't known until Azure reports it.
      secretExpiresAt: app.secretExpiryMonths ? addMonths(now, app.secretExpiryMonths) : null,
    },
    role: role && { name: role.name, isNew: role.isNew, builtIn: role.builtIn, scopes: role.scopes },
    storage: storage && { region: storage.region, resourceGroup: storage.resourceGroup, account: storage.account },
    setupBy: summary.setupBy,
    lastCheckedAt: now.toISOString(),
    permissionsStatus: "verified",
  };
}

async function saveAccount(summary) {
  const record = {
    type: "cloud_account",
    name: summary.displayName,
    cloudService: "Microsoft Azure",
    tenantId: summary.tenantId,
    subscriptionId: summary.subscriptionId,
    status: "connected",
    adminEmail: null,
    lastRefresh: new Date().toISOString(),
    policyCount: summary.policyCount ?? 0,
    azure: buildAzureDetails(summary),
  };
  if (summary.targetAccountId) {
    await apiClient.put(`${ENDPOINTS.INFRASTRUCTURE}/${summary.targetAccountId}`, record);
  } else {
    await apiClient.post(ENDPOINTS.INFRASTRUCTURE, record);
  }
  await infrastructureStore.refetch();
}

async function runFrom(startIndex) {
  const { summary } = state;
  for (let index = startIndex; index < state.tasks.length; index += 1) {
    patchTask(index, { status: "active" });
    await wait(state.tasks[index].durationMs);

    if (state.tasks[index].willFail) {
      patchTask(index, {
        status: "failed",
        willFail: false, // succeeds on retry
        description:
          "Azure didn't finish applying the role assignments in time. This is usually temporary — retrying normally fixes it.",
      });
      setState({ status: "failed" });
      if (state.backgrounded) {
        toastStore.pushToast(`Setting up ${summary.displayName} didn't finish.`, {
          severity: "error",
          duration: FAILURE_TOAST_MS,
          action: { label: "Retry", onClick: () => azureProvisioningStore.retry() },
        });
      }
      return;
    }
    patchTask(index, { status: "done" });
  }

  await saveAccount(summary);

  if (state.backgrounded) {
    // Nobody is looking at the dialog: tell them, then clear the run so the
    // next "Add Cloud Account" starts fresh.
    toastStore.pushToast(`${summary.displayName} is connected and ready to protect.`);
    resetToIdle();
  } else {
    setState({ status: "done" });
  }
}

function handleCrash() {
  toastStore.pushToast("Couldn't finish setting up Azure. Try again.", "error");
  resetToIdle();
}

export const azureProvisioningStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  start(summary) {
    if (state.status !== "idle") return;
    setState({ status: "running", tasks: buildTasks(summary), summary, backgrounded: false });
    runFrom(0).catch(handleCrash);
  },
  retry() {
    if (state.status !== "failed") return;
    const failedIndex = state.tasks.findIndex((task) => task.status === "failed");
    setState({ status: "running" });
    runFrom(failedIndex).catch(handleCrash);
  },
  /** Roll back whatever was created, then clear the run. */
  async cleanUp() {
    if (state.status !== "failed") return;
    setState({ status: "cleaningUp" });
    await wait(CLEAN_UP_MS);
    toastStore.pushToast("Setup cancelled. Arcserve removed everything it had created in Azure.", "info");
    resetToIdle();
  },
  moveToBackground() {
    setState({ backgrounded: true });
  },
  /** The wizard reopened on this run: report the outcome in the dialog again. */
  moveToForeground() {
    if (state.backgrounded) setState({ backgrounded: false });
  },
  reset() {
    if (state.status === "done") resetToIdle();
  },
};

export function useAzureProvisioning() {
  return useSyncExternalStore(azureProvisioningStore.subscribe, azureProvisioningStore.getSnapshot);
}
