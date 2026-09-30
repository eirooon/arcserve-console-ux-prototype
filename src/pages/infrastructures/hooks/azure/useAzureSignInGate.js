import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EXISTING_APPS } from "./azureMockData";

// The mock API resolves instantly, so each simulated Azure round-trip gets a
// floor long enough for its loading state to be seen and read.
const SIGN_IN_MS = 1200;
const CHECK_MS = 900;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** What each Azure right means, in the words the Modify page shows. */
export const RIGHT_LABELS = {
  registerApps: "Register apps in Microsoft Entra ID",
  createRoles: "Create and update custom roles",
  assignRoles: "Assign roles (Owner or User Access Administrator)",
  appOwner: "Owner of the app registration",
};

/** Whether a (demo) signed-in account holds `right` in this context. */
export function hasRight(account, right, { subscriptionId, appName }) {
  switch (right) {
    case "registerApps":
      return Boolean(account.access.registerApps);
    case "createRoles":
      return Boolean(account.access.createRoles[subscriptionId]);
    case "assignRoles":
      return Boolean(account.access.assignRoles[subscriptionId]);
    case "appOwner":
      return Boolean(EXISTING_APPS.find((app) => app.name === appName)?.owners.includes(account.email));
    default:
      return false;
  }
}

/**
 * Sign-in for a Modify page change that is made in Azure. Arcserve's own app
 * only has backup permissions, so creating apps or roles or assigning roles
 * needs a person to sign in — and only the rights this change needs are
 * checked, right after they do.
 *
 * `requiredRights` can change while the dialog is open (e.g. choosing a
 * custom role adds "createRoles"); results follow without re-signing in.
 */
export function useAzureSignInGate(requiredRights, context) {
  // status: "idle" | "signingIn" | "checking" | "done"
  const [session, setSession] = useState({ status: "idle", account: null, pickerOpen: false });

  // Only the latest pick may finish, and never after the dialog unmounts.
  const pickRef = useRef(0);
  useEffect(() => {
    const current = pickRef;
    return () => {
      current.current = -1;
    };
  }, []);

  const pickAccount = useCallback(async (account) => {
    const pick = ++pickRef.current;
    setSession({ status: "signingIn", account, pickerOpen: false });
    await wait(SIGN_IN_MS);
    if (pickRef.current !== pick) return;
    setSession((current) => ({ ...current, status: "checking" }));
    await wait(CHECK_MS);
    if (pickRef.current !== pick) return;
    setSession((current) => ({ ...current, status: "done" }));
  }, []);

  const openSignIn = useCallback(() => setSession((current) => ({ ...current, pickerOpen: true })), []);
  const closePicker = useCallback(() => setSession((current) => ({ ...current, pickerOpen: false })), []);

  const { subscriptionId, appName } = context;
  const results = useMemo(
    () =>
      requiredRights.map((right) => ({
        right,
        label: RIGHT_LABELS[right],
        allowed:
          session.status === "done" ? hasRight(session.account, right, { subscriptionId, appName }) : null,
      })),
    [requiredRights, session.status, session.account, subscriptionId, appName],
  );

  return {
    required: requiredRights.length > 0,
    session,
    results,
    allAllowed: requiredRights.length === 0 || (session.status === "done" && results.every((result) => result.allowed)),
    actions: { openSignIn, closePicker, pickAccount },
  };
}

/**
 * A one-off simulated Azure check (e.g. validating a pasted client secret):
 * "idle" → "checking" → "allowed" | "denied". `reset` returns it to idle,
 * for when the input it checked changes.
 */
export function useSimulatedCheck(durationMs = CHECK_MS) {
  const [status, setStatus] = useState("idle");
  const runRef = useRef(0);

  const run = useCallback(
    async (isAllowed) => {
      const current = ++runRef.current;
      setStatus("checking");
      await wait(durationMs);
      if (runRef.current === current) setStatus(isAllowed() ? "allowed" : "denied");
    },
    [durationMs],
  );

  const reset = useCallback(() => {
    runRef.current += 1;
    setStatus("idle");
  }, []);

  useEffect(
    () => () => {
      runRef.current = -1;
    },
    [],
  );

  return { status, run, reset };
}
