import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "../../../../api/client";
import { ENDPOINTS } from "../../../../api/endpoints";
import { toastStore } from "../../../../api/toastStore";
import { infrastructureStore, useInfrastructureData } from "../useInfrastructureData";
import {
  APP_REGISTRATION_NAME,
  AZURE_SERVICES,
  CUSTOM_ROLE_NAME,
  EXISTING_ROLES,
  GENERATED_CLIENT_ID,
  GENERATED_CLIENT_SECRET,
  GOAL_OPTIONS,
  LOCATION_DEFAULTS,
  getAppServicesForGoals,
  getGoalNeeds,
  getMissingRoleActions,
  getRoleActions,
  getRoleScopes,
} from "./azureMockData";

// The mock API resolves instantly, so each simulated Azure round-trip gets a
// floor long enough for its in-progress state to be seen and read.
const CONNECTION_CHECK_MS = 1500;
const PERMISSION_CHECK_MS = 1200;
const APPLY_GOALS_MS = 1800;
const CHANGE_STORAGE_MS = 1000;
const CHANGE_SECRET_MS = 1200;
const CHANGE_ROLE_MS = 1500;
const DISCONNECT_MS = 1500;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const selectRows = (state) => ({ rows: state.rows, loading: state.loading });

async function copyToClipboard(value, label) {
  try {
    await navigator.clipboard.writeText(value);
    toastStore.pushToast(`${label} copied.`);
  } catch {
    toastStore.pushToast(`Couldn't copy the ${label.toLowerCase()}. Select it and copy it manually.`, "error");
  }
}

const listServices = (services) => services.map((service) => AZURE_SERVICES[service]).join(" and ");

const DEFAULT_SECRET_EXPIRY_MONTHS = 12;

/**
 * What changing "Using Azure for" does in Azure: which services' permissions
 * the app's role gains or loses, and whether an app identity or a storage
 * account has to be set up because a newly chosen goal needs one. An app or
 * storage account no goal needs anymore stays in Azure, unused.
 */
export function describeGoalChange(currentGoals, nextGoals, { hasApp, hasStorage, role = null }) {
  const current = getAppServicesForGoals(currentGoals);
  const next = getAppServicesForGoals(nextGoals);
  const before = getGoalNeeds(currentGoals);
  const after = getGoalNeeds(nextGoals);
  const addedServices = hasApp ? next.filter((service) => !current.includes(service)) : [];
  const removedServices = hasApp && after.needsApp ? current.filter((service) => !next.includes(service)) : [];
  const createsApp = after.needsApp && !hasApp;
  const createsStorage = after.needsStorage && !hasStorage;
  const keepsApp = hasApp && after.needsApp;

  // An existing role Arcserve didn't create can't be edited by Arcserve, so
  // new permissions must already be in it.
  const existingRole = keepsApp && role && !role.isNew ? EXISTING_ROLES.find((candidate) => candidate.name === role.name) : null;
  const missingRoleActions =
    existingRole && addedServices.length ? getMissingRoleActions(existingRole, getRoleActions(next)) : [];

  // Azure rights the person saving needs (see useAzureSignInGate).
  const rights = new Set();
  if (createsApp) ["registerApps", "createRoles", "assignRoles"].forEach((right) => rights.add(right));
  if (keepsApp && role?.isNew && (addedServices.length || removedServices.length)) rights.add("createRoles");
  if (after.protectsVms && (createsStorage || !before.protectsVms) && hasApp) rights.add("assignRoles");

  return {
    addedServices,
    removedServices,
    addedActionCount: getRoleActions(addedServices).length,
    removedActionCount: getRoleActions(removedServices).length,
    createsApp,
    stopsUsingApp: before.needsApp && !after.needsApp,
    createsStorage,
    stopsUsingStorage: before.needsStorage && !after.needsStorage,
    missingRoleActions,
    requiredRights: [...rights],
  };
}

// Where the role goes: the account's subscription.
function scopesFor(goals, azure) {
  const scopes = getRoleScopes(goals, azure.subscriptionName);
  return scopes.length ? scopes : [{ type: "subscription", name: azure.subscriptionName }];
}

function addMonths(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
}

/**
 * State and actions behind the Azure cloud account's Modify page. Every
 * Azure-side operation is simulated (a delay, then the saved record is
 * updated); the page and its dialogs stay presentational.
 */
export function useAzureAccountDetails(accountId) {
  const { rows, loading } = useInfrastructureData(selectRows);
  const account = useMemo(
    () => rows.find((row) => row.id === accountId && row.type === "cloud_account" && row.azure) ?? null,
    [rows, accountId],
  );

  // "connection" | "permissions" | null — only one Azure check runs at a time.
  const [checking, setChecking] = useState(null);
  const [busy, setBusy] = useState(false);
  // Prototype only: what the next check finds wrong in Azure.
  // "none" | "secretExpired" | "missingPermissions"
  const [simulatedIssue, setSimulatedIssue] = useState("none");

  // Ignore simulated results that land after the page unmounts.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const azure = account?.azure ?? null;

  const derived = useMemo(() => {
    if (!azure) return null;
    const needs = getGoalNeeds(azure.goals);
    const appServices = getAppServicesForGoals(azure.goals);
    return {
      appServices,
      roleActions: getRoleActions(appServices),
      protectsVms: needs.protectsVms,
      health: {
        secretExpired: Boolean(azure.health?.secretExpired),
        missingActions: azure.health?.missingActions ?? [],
      },
      // A no-longer-needed app or storage account stays in the record (and
      // in Azure) but isn't shown or used.
      showApp: needs.needsApp && Boolean(azure.app),
      showStorage: needs.needsStorage && Boolean(azure.storage),
      goalRows: GOAL_OPTIONS.map((goal) => ({ key: goal.key, label: goal.label, active: Boolean(azure.goals[goal.key]) })),
    };
  }, [azure]);

  const updateAzure = useCallback(
    async (patch, topLevel = {}) => {
      await apiClient.put(`${ENDPOINTS.INFRASTRUCTURE}/${account.id}`, { ...topLevel, azure: { ...azure, ...patch } });
      await infrastructureStore.refetch();
    },
    [account, azure],
  );

  const runCheck = useCallback(
    async (kind, durationMs, message) => {
      setChecking(kind);
      try {
        await wait(durationMs);
        const now = new Date().toISOString();
        const roleActions = getRoleActions(getAppServicesForGoals(azure.goals));
        const health = {
          secretExpired: simulatedIssue === "secretExpired" && Boolean(azure.app),
          // Someone removed permissions from the role in Azure.
          missingActions: simulatedIssue === "missingPermissions" && azure.role ? roleActions.slice(-2) : [],
        };
        await updateAzure({ lastCheckedAt: now, health }, { lastRefresh: now });
        if (health.secretExpired) {
          toastStore.pushToast("The client secret has expired. Backups will fail until you replace it.", "warning");
        } else if (health.missingActions.length) {
          toastStore.pushToast("The role is missing permissions Arcserve needs. Fix it to keep backups running.", "warning");
        } else {
          toastStore.pushToast(message);
        }
      } catch {
        toastStore.pushToast("Couldn't reach Azure. Try again.", "error");
      } finally {
        if (mountedRef.current) setChecking(null);
      }
    },
    [azure, simulatedIssue, updateAzure],
  );

  // Wraps a dialog's save: shows the busy state, reports failure, and
  // resolves true only when the change was applied.
  const runChange = useCallback(async (durationMs, apply, successMessage) => {
    setBusy(true);
    try {
      await wait(durationMs);
      await apply();
      toastStore.pushToast(successMessage);
      return true;
    } catch {
      toastStore.pushToast("Couldn't save the change in Azure. Try again.", "error");
      return false;
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  }, []);

  const actions = useMemo(
    () => ({
      setSimulatedIssue,

      replaceSecret({ mode, value, expiryMonths }) {
        const app = {
          ...azure.app,
          // A new secret gets a fresh value; a pasted one is used as is.
          clientSecret: mode === "new" ? `${GENERATED_CLIENT_SECRET.slice(0, 6)}${Date.now().toString(36)}` : value.trim(),
          secretExpiresAt: mode === "new" ? addMonths(expiryMonths) : null,
        };
        return runChange(
          CHANGE_SECRET_MS,
          () => updateAzure({ app, health: { ...azure.health, secretExpired: false } }),
          "Client secret replaced. Arcserve uses the new secret from now on.",
        );
      },

      changeRole({ isNew, name, builtIn }) {
        const role = { ...azure.role, isNew, name, builtIn };
        const repaired = azure.role.name === name && azure.health?.missingActions?.length;
        return runChange(
          CHANGE_ROLE_MS,
          () => updateAzure({ role, health: { ...azure.health, missingActions: [] } }),
          repaired ? `${name} has every required permission again.` : `${name} is now assigned to the app.`,
        );
      },


      checkConnection: () =>
        runCheck("connection", CONNECTION_CHECK_MS, `${account.name} is connected. Arcserve can reach Azure.`),
      recheckPermissions: () => runCheck("permissions", PERMISSION_CHECK_MS, "All required permissions verified."),

      copyClientId: () => copyToClipboard(azure.app.clientId, "Client ID"),
      copyClientSecret: () => copyToClipboard(azure.app.clientSecret, "Client secret"),

      saveGoals(nextGoals) {
        const change = describeGoalChange(azure.goals, nextGoals, {
          hasApp: Boolean(azure.app),
          hasStorage: Boolean(azure.storage),
          role: azure.role,
        });
        const patch = { goals: nextGoals };
        if (change.createsApp) {
          patch.app = {
            name: APP_REGISTRATION_NAME,
            clientId: GENERATED_CLIENT_ID,
            clientSecret: GENERATED_CLIENT_SECRET,
            isNew: true,
            secretExpiresAt: addMonths(DEFAULT_SECRET_EXPIRY_MONTHS),
          };
          patch.role = { name: CUSTOM_ROLE_NAME, isNew: true, builtIn: false, scopes: scopesFor(nextGoals, azure) };
        } else if (azure.role) {
          patch.role = { ...azure.role, scopes: scopesFor(nextGoals, azure) };
        }
        if (change.createsStorage) {
          patch.storage = {
            region: LOCATION_DEFAULTS.region,
            resourceGroup: LOCATION_DEFAULTS.resourceGroupName,
            account: LOCATION_DEFAULTS.storageAccountName,
          };
        }
        const parts = [];
        if (change.createsApp) parts.push(`created app registration ${APP_REGISTRATION_NAME} with ${CUSTOM_ROLE_NAME}`);
        if (change.addedServices.length) parts.push(`added ${listServices(change.addedServices)} permissions`);
        if (change.removedServices.length) parts.push(`removed ${listServices(change.removedServices)} permissions`);
        if (change.createsStorage) parts.push(`created storage account ${LOCATION_DEFAULTS.storageAccountName}`);
        const detail = parts.length ? ` Arcserve ${parts.join(", ")}.` : "";
        return runChange(APPLY_GOALS_MS, () => updateAzure(patch), `Updated what ${account.name} is used for.${detail}`);
      },

      changeStorageAccount: (storageAccount) =>
        runChange(
          CHANGE_STORAGE_MS,
          () => updateAzure({ storage: { ...azure.storage, account: storageAccount } }),
          `New backups will go to ${storageAccount}. Existing backups stay where they are.`,
        ),

      // `onDisconnected` runs before the list is refetched, so the page can
      // leave before its account disappears from under it.
      async disconnect({ removeAppIdentity, removeStorage }, onDisconnected) {
        const removed = [removeAppIdentity && "its app access", removeStorage && "the storage account"].filter(Boolean);
        const detail = removed.length ? ` Arcserve removed ${removed.join(" and ")} from Azure.` : "";
        const disconnected = await runChange(
          DISCONNECT_MS,
          () => apiClient.delete(`${ENDPOINTS.INFRASTRUCTURE}/${account.id}`),
          `${account.name} disconnected.${detail}`,
        );
        if (!disconnected) return;
        onDisconnected();
        infrastructureStore.refetch();
      },
    }),
    [account, azure, runCheck, runChange, updateAzure],
  );

  return { account, loading, derived, checking, busy, simulatedIssue, actions };
}
