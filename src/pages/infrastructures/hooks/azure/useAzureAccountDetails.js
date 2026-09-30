import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "../../../../api/client";
import { ENDPOINTS } from "../../../../api/endpoints";
import { toastStore } from "../../../../api/toastStore";
import { infrastructureStore, useInfrastructureData } from "../useInfrastructureData";
import {
  EXISTING_APPS,
  GENERATED_CLIENT_SECRET,
  GOAL_OPTIONS,
  getAppServicesForGoals,
  getGoalNeeds,
  getRoleActions,
} from "./azureMockData";

// The mock API resolves instantly, so each simulated Azure round-trip gets a
// floor long enough for its in-progress state to be seen and read.
const CONNECTION_CHECK_MS = 1500;
const PERMISSION_CHECK_MS = 1200;
const RENAME_MS = 600;
const CHANGE_SECRET_MS = 1200;
const CHANGE_CLIENT_ID_MS = 1200;
const DISCONNECT_MS = 1500;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const selectRows = (state) => ({ rows: state.rows, loading: state.loading });

const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** An Application (client) ID is a GUID, e.g. 7d2f9a41-3c8e-4b6d-a1f0-9e5c2b8d4a73. */
export function isValidClientId(value) {
  return GUID_PATTERN.test(value.trim());
}

const normalizeName = (name) => name.trim().toLowerCase();

/** Account names must be present and unique among cloud accounts. */
export function getAccountNameError(name, otherNames) {
  if (!name.trim()) return "Enter a name.";
  if (otherNames.some((other) => normalizeName(other) === normalizeName(name))) {
    return "Another cloud account already uses this name.";
  }
  return null;
}

async function copyToClipboard(value, label) {
  try {
    await navigator.clipboard.writeText(value);
    toastStore.pushToast(`${label} copied.`);
  } catch {
    toastStore.pushToast(`Couldn't copy the ${label.toLowerCase()}. Select it and copy it manually.`, "error");
  }
}

function addMonths(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
}

/**
 * State and actions behind the Azure cloud account's Modify page. After
 * setup, only the account's name, its Client ID and its client secret can be
 * changed; everything else is shown read-only. Every Azure-side operation is
 * simulated (a delay, then the saved record is updated); the page and its
 * dialogs stay presentational.
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
      // Other cloud accounts' names, which a rename must not reuse.
      otherNames: rows.filter((row) => row.type === "cloud_account" && row.id !== account.id).map((row) => row.name),
      goalRows: GOAL_OPTIONS.map((goal) => ({ key: goal.key, label: goal.label, active: Boolean(azure.goals[goal.key]) })),
    };
  }, [azure, rows, account]);

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
          toastStore.pushToast(
            "The role is missing permissions Arcserve needs. Ask your Azure admin to add them back.",
            "warning",
          );
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

      rename: (name) =>
        runChange(
          RENAME_MS,
          async () => {
            await apiClient.put(`${ENDPOINTS.INFRASTRUCTURE}/${account.id}`, { name: name.trim() });
            await infrastructureStore.refetch();
          },
          `Renamed to ${name.trim()}.`,
        ),

      // A secret belongs to one app, so a new Client ID always comes with that
      // app's secret (validated in the dialog).
      changeClientId({ clientId, clientSecret }) {
        const trimmedId = clientId.trim();
        const knownApp = EXISTING_APPS.find((candidate) => candidate.clientId.toLowerCase() === trimmedId.toLowerCase());
        const app = {
          name: knownApp?.name ?? `App ${trimmedId.slice(0, 8)}`,
          clientId: trimmedId,
          clientSecret: clientSecret.trim(),
          isNew: false,
          secretExpiresAt: null,
        };
        return runChange(
          CHANGE_CLIENT_ID_MS,
          () => updateAzure({ app, health: { ...azure.health, secretExpired: false } }),
          `Arcserve now signs in to Azure as ${app.name}.`,
        );
      },

      checkConnection: () =>
        runCheck("connection", CONNECTION_CHECK_MS, `${account.name} is connected. Arcserve can reach Azure.`),
      recheckPermissions: () => runCheck("permissions", PERMISSION_CHECK_MS, "All required permissions verified."),

      copyClientId: () => copyToClipboard(azure.app.clientId, "Client ID"),
      copyClientSecret: () => copyToClipboard(azure.app.clientSecret, "Client secret"),

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
