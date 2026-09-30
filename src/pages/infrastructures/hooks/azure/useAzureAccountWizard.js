import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  APP_REGISTRATION_NAME,
  CUSTOM_ROLE_NAME,
  DEFAULT_SUBSCRIPTION,
  EXISTING_APPS,
  EXISTING_ROLES,
  GENERATED_CLIENT_ID,
  GENERATED_CLIENT_SECRET,
  GOAL_OPTIONS,
  LOCATION_DEFAULTS,
  SUBSCRIPTIONS,
  TENANT,
  getAppServicesForGoals,
  getGoalNeeds,
  getMissingRoleActions,
  getRoleActions,
  getRoleScopes,
  getServicesForGoals,
} from "./azureMockData";
import { buildStepTasks, describeCreated, getCreateLabel } from "./azureStepTasks";

// Every step the wizard can show. App Identity and Permissions only appear
// when a chosen goal needs an app; Storage only when one needs storage.
const STEP_DEFINITIONS = [
  { id: "signIn", label: "Sign In" },
  { id: "goal", label: "Goal" },
  { id: "app", label: "App", when: (needs) => needs.needsApp },
  { id: "permissions", label: "Permissions", when: (needs) => needs.needsApp },
  { id: "storage", label: "Storage", when: (needs) => needs.needsStorage },
  { id: "review", label: "Review" },
];

export function getWizardSteps(goals) {
  const needs = getGoalNeeds(goals);
  return STEP_DEFINITIONS.filter((step) => !step.when || step.when(needs));
}

// The mock API resolves instantly, so each simulated Azure round-trip gets a
// floor long enough for its loading state to actually be seen and read.
const SIGN_IN_MS = 1200;
const CHECK_MS = 1000;

const STORAGE_NAME_PATTERN = /^[a-z0-9]{3,24}$/;
export const STORAGE_NAME_RULE = "Use 3–24 lowercase letters and numbers only.";
const RESOURCE_GROUP_PATTERN = /^[\w\-.()]{1,90}$/;
const MIN_SECRET_LENGTH = 10;
const TENANT_DISPLAY_NAME = `Azure - ${TENANT.name.replace(/\.$/, "")}`;

// Azure rights are only checked on the step that needs them, never up front
// (a backup operator may be able to finish with an existing app and role).
// `run` is bumped whenever a check restarts or is invalidated, so a result
// that lands late for an old account or subscription is ignored.
const CHECK_KEYS = ["registerApps", "appOwner", "secret", "createRoles", "assignRoles", "roleFit"];
const IDLE_CHECK = { status: "idle", run: 0 };

// Steps that create something in Azure when their primary button is pressed.
export const CREATION_STEPS = ["app", "permissions", "storage"];
const IDLE_CREATION = { status: "idle", tasks: [] }; // status: "idle" | "running" | "done" | "failed"

const FAILURE_MESSAGES = {
  app: "Azure didn’t finish creating the client secret in time. This is usually temporary — retrying normally fixes it.",
  permissions:
    "Azure didn’t finish applying the role assignment in time. This is usually temporary — retrying normally fixes it.",
  storage: "Azure didn’t finish setting up the storage account in time. This is usually temporary — retrying normally fixes it.",
};

function resetChecks(checks, keys) {
  const next = { ...checks };
  keys.forEach((key) => {
    next[key] = { status: "idle", run: checks[key].run + 1 };
  });
  return next;
}

const initialState = {
  stepId: "signIn",
  pickerOpen: false, // simulated Microsoft sign-in window
  signIn: { status: "idle", account: null }, // status: "idle" | "signingIn" | "done"
  subscriptionId: DEFAULT_SUBSCRIPTION.id,
  // When the tenant is already connected: update that account, or add a
  // separate one (e.g. for another subscription).
  connectionChoice: "update", // "update" | "separate"
  goals: { backupVms: true, virtualStandby: true, rpsCopy: true },
  app: {
    mode: "new", // "new" | "existing"
    existingAppId: "",
    secretMode: "new", // existing app: "new" | "existing"
    secretValue: "",
    secretExpiryMonths: 12,
  },
  role: { mode: "create", existingRoleId: "" }, // mode: "create" | "existing"
  location: LOCATION_DEFAULTS,
  checks: Object.fromEntries(CHECK_KEYS.map((key) => [key, IDLE_CHECK])),
  creation: Object.fromEntries(CREATION_STEPS.map((stepId) => [stepId, IDLE_CREATION])),
  // Bumped on Start Over, so a creation run in progress stops reporting.
  creationRun: 0,
  failureUsed: false, // the prototype's simulated failure happens once
  adminEmail: "",
  adminLinkSentTo: null,
  displayName: null, // null = use the suggested name
  simulateFailure: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "openPicker":
      return { ...state, pickerOpen: true };
    case "closePicker":
      return { ...state, pickerOpen: false };
    case "signInStarted":
      return {
        ...state,
        pickerOpen: false,
        signIn: { status: "signingIn", account: action.account },
        adminLinkSentTo: null,
        checks: resetChecks(state.checks, CHECK_KEYS),
      };
    case "signInDone":
      return { ...state, signIn: { ...state.signIn, status: "done" } };
    case "setSubscription":
      return {
        ...state,
        subscriptionId: action.value,
        role: { ...state.role, existingRoleId: "" },
        checks: resetChecks(state.checks, ["createRoles", "assignRoles", "roleFit"]),
      };
    case "setConnectionChoice":
      return { ...state, connectionChoice: action.value };
    case "toggleGoal":
      return { ...state, goals: { ...state.goals, [action.key]: !state.goals[action.key] } };
    case "setAppField": {
      const app = { ...state.app, [action.field]: action.value };
      // A different app or secret needs checking again.
      const stale = { existingAppId: ["appOwner", "secret"], secretValue: ["secret"] }[action.field] ?? [];
      return { ...state, app, checks: resetChecks(state.checks, stale) };
    }
    case "setRoleField": {
      const stale = action.field === "existingRoleId" ? ["roleFit"] : [];
      return { ...state, role: { ...state.role, [action.field]: action.value }, checks: resetChecks(state.checks, stale) };
    }
    case "restart":
      return {
        ...initialState,
        checks: resetChecks(state.checks, CHECK_KEYS),
        creationRun: state.creationRun + 1,
      };
    case "creationStarted":
      return {
        ...state,
        creation: { ...state.creation, [action.stepId]: { status: "running", tasks: action.tasks } },
      };
    case "taskUpdated": {
      if (action.run !== state.creationRun) return state;
      const step = state.creation[action.stepId];
      const tasks = step.tasks.map((task, index) => (index === action.index ? { ...task, ...action.patch } : task));
      return { ...state, creation: { ...state.creation, [action.stepId]: { ...step, tasks } } };
    }
    case "creationFinished":
      if (action.run !== state.creationRun) return state;
      return {
        ...state,
        creation: { ...state.creation, [action.stepId]: { ...state.creation[action.stepId], status: action.status } },
      };
    case "failureUsed":
      return { ...state, failureUsed: true };
    case "setLocationField":
      return { ...state, location: { ...state.location, [action.field]: action.value } };
    case "checkStarted":
      return {
        ...state,
        checks: { ...state.checks, [action.key]: { status: "checking", run: state.checks[action.key].run + 1 } },
      };
    case "checkDone":
      if (state.checks[action.key].run !== action.run) return state;
      return { ...state, checks: { ...state.checks, [action.key]: { ...state.checks[action.key], status: "done" } } };
    case "setAdminEmail":
      return { ...state, adminEmail: action.value };
    case "adminLinkSent":
      return { ...state, adminLinkSentTo: action.email };
    case "setDisplayName":
      return { ...state, displayName: action.value };
    case "setSimulateFailure":
      return { ...state, simulateFailure: action.value };
    case "goToStep":
      return { ...state, stepId: action.stepId };
    default:
      return state;
  }
}

// Which checks the current step needs that haven't run yet.
function pendingChecks(state) {
  if (state.signIn.status !== "done") return [];
  const keys = [];
  if (state.stepId === "app") {
    if (state.app.mode === "new") keys.push("registerApps");
    if (state.app.mode === "existing" && state.app.existingAppId && state.app.secretMode === "new") keys.push("appOwner");
  }
  if (state.stepId === "permissions") {
    keys.push("assignRoles");
    if (state.role.mode === "create") keys.push("createRoles");
    if (state.role.mode === "existing" && state.role.existingRoleId) keys.push("roleFit");
  }
  return keys.filter((key) => state.checks[key].status === "idle");
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Stand-in for Azure accepting the secret: prototype testers can type any
// value of 10+ characters with no spaces.
export function isAcceptedSecret(value) {
  const trimmed = value.trim();
  return trimmed.length >= MIN_SECRET_LENGTH && !/\s/.test(trimmed);
}

export function getLocationErrors(location) {
  const errors = {};
  if (location.resourceGroupMode === "new" && !RESOURCE_GROUP_PATTERN.test(location.resourceGroupName)) {
    errors.resourceGroupName = "Use up to 90 letters, numbers, hyphens, underscores, periods or parentheses.";
  }
  if (location.resourceGroupMode === "existing" && !location.existingResourceGroup) {
    errors.existingResourceGroup = "Select a resource group.";
  }
  if (location.storageMode === "new" && !STORAGE_NAME_PATTERN.test(location.storageAccountName)) {
    errors.storageAccountName = STORAGE_NAME_RULE;
  }
  if (location.storageMode === "existing" && !location.existingStorageAccount) {
    errors.existingStorageAccount = "Select a storage account.";
  }
  return errors;
}

const normalizeName = (name) => name.trim().toLowerCase();

export function isValidStorageAccountName(name) {
  return STORAGE_NAME_PATTERN.test(name);
}

/**
 * State and actions for the Azure "Add Cloud Account" wizard. Keeps every
 * rule (which steps apply, who may continue past each one, duplicate-tenant
 * handling, what the summary says) here so the step components stay purely
 * presentational.
 *
 * `cloudAccounts` is the current Cloud Accounts table rows — used to spot a
 * tenant that's already connected and to keep display names unique.
 */
export function useAzureAccountWizard(cloudAccounts) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Mirror of the reducer state, advanced in step with every dispatch, so an
  // action can see the state it produces and start that step's checks.
  const stateRef = useRef(initialState);

  // Ignore simulated async results that land after the dialog unmounts.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const send = useCallback((action) => {
    stateRef.current = reducer(stateRef.current, action);
    dispatch(action);
    return stateRef.current;
  }, []);

  const runCheck = useCallback(
    async (key) => {
      const { run } = send({ type: "checkStarted", key }).checks[key];
      await wait(CHECK_MS);
      if (mountedRef.current) send({ type: "checkDone", key, run });
    },
    [send],
  );

  // Dispatch, then start whatever checks the resulting step still needs.
  const act = useCallback(
    (action) => {
      pendingChecks(send(action)).forEach(runCheck);
    },
    [send, runCheck],
  );

  const { signIn, subscriptionId, goals, app, role, location, checks } = state;
  const account = signIn.account;
  const signedIn = signIn.status === "done" && Boolean(account);

  const steps = useMemo(() => getWizardSteps(goals), [goals]);
  const stepIndex = Math.max(
    steps.findIndex((step) => step.id === state.stepId),
    0,
  );
  const needs = getGoalNeeds(goals);

  // Same tenant already in the table (connected, or waiting on an admin).
  const existingTenantAccount = useMemo(
    () => cloudAccounts.find((row) => row.tenantId === TENANT.id) ?? null,
    [cloudAccounts],
  );
  const updatingExisting = Boolean(existingTenantAccount) && state.connectionChoice === "update";

  const subscription = SUBSCRIPTIONS.find((sub) => sub.id === subscriptionId);
  const selectedApp = EXISTING_APPS.find((candidate) => candidate.id === app.existingAppId) ?? null;
  const selectedRole = EXISTING_ROLES.find((candidate) => candidate.id === role.existingRoleId) ?? null;

  const appServices = useMemo(() => getAppServicesForGoals(goals), [goals]);
  const requiredActions = useMemo(() => getRoleActions(appServices), [appServices]);
  const missingRoleActions = useMemo(
    () => (selectedRole ? getMissingRoleActions(selectedRole, requiredActions) : []),
    [selectedRole, requiredActions],
  );

  // "idle" | "checking" | "allowed" | "denied" for each lazily checked right.
  const checkResult = (key, allowed) => {
    if (signIn.status === "signingIn" || checks[key].status === "checking") return "checking";
    if (checks[key].status === "idle") return "idle";
    return allowed ? "allowed" : "denied";
  };
  const access = account?.access;
  const results = {
    registerApps: checkResult("registerApps", access?.registerApps),
    appOwner: checkResult("appOwner", Boolean(selectedApp?.owners.includes(account?.email))),
    secret: checkResult("secret", isAcceptedSecret(app.secretValue)),
    createRoles: checkResult("createRoles", access?.createRoles[subscriptionId]),
    assignRoles: checkResult("assignRoles", access?.assignRoles[subscriptionId]),
    roleFit: checkResult("roleFit", missingRoleActions.length === 0),
  };

  const suggestedDisplayName = useMemo(() => {
    const taken = new Set(cloudAccounts.map((row) => normalizeName(row.name)));
    return taken.has(normalizeName(TENANT_DISPLAY_NAME))
      ? `${TENANT_DISPLAY_NAME} - ${subscription?.name ?? ""}`.trim()
      : TENANT_DISPLAY_NAME;
  }, [cloudAccounts, subscription]);

  const displayName = updatingExisting ? existingTenantAccount.name : state.displayName ?? suggestedDisplayName;

  const displayNameError = useMemo(() => {
    if (updatingExisting) return null;
    if (!displayName.trim()) return "Enter a display name.";
    const clash = cloudAccounts.some((row) => normalizeName(row.name) === normalizeName(displayName));
    return clash ? "Another cloud account already uses this name." : null;
  }, [cloudAccounts, displayName, updatingExisting]);

  const locationErrors = useMemo(() => getLocationErrors(location), [location]);

  // Everything the Review step, the provisioning run and the "Connected"
  // screen need, derived once so they can never disagree.
  const summary = useMemo(() => {
    const appIsNew = app.mode === "new";
    const secretIsNew = appIsNew || app.secretMode === "new";
    const roleIsNew = role.mode === "create";
    return {
      tenantName: TENANT.name,
      tenantId: TENANT.id,
      displayName,
      targetAccountId: updatingExisting ? existingTenantAccount.id : null,
      // A pending (admin handoff) row has no policy count yet; keep a real one.
      policyCount: updatingExisting ? existingTenantAccount.policyCount ?? 0 : 0,
      goals: GOAL_OPTIONS.filter((goal) => goals[goal.key]).map((goal) => goal.label),
      goalSelection: goals,
      services: getServicesForGoals(goals),
      backsUpVms: goals.backupVms,
      subscriptionName: subscription?.name ?? "",
      subscriptionId: subscription?.id ?? "",
      app: needs.needsApp
        ? {
            isNew: appIsNew,
            name: appIsNew ? APP_REGISTRATION_NAME : selectedApp?.name ?? "",
            clientId: appIsNew ? GENERATED_CLIENT_ID : selectedApp?.clientId ?? "",
            secretIsNew,
            secretExpiryMonths: secretIsNew ? app.secretExpiryMonths : null,
            clientSecret: secretIsNew ? GENERATED_CLIENT_SECRET : app.secretValue.trim(),
          }
        : null,
      role: needs.needsApp
        ? {
            isNew: roleIsNew,
            name: roleIsNew ? CUSTOM_ROLE_NAME : selectedRole?.name ?? "",
            builtIn: !roleIsNew && Boolean(selectedRole?.builtIn),
            services: appServices,
            requiredActions,
            scopes: getRoleScopes(goals, subscription?.name ?? ""),
            // Backing up VMs writes to the storage account as the app.
            grantsStorageAccess: needs.protectsVms,
          }
        : null,
      storage: needs.needsStorage
        ? {
            region: location.region,
            resourceGroupIsNew: location.resourceGroupMode === "new",
            resourceGroup:
              location.resourceGroupMode === "new" ? location.resourceGroupName : location.existingResourceGroup,
            accountIsNew: location.storageMode === "new",
            account: location.storageMode === "new" ? location.storageAccountName : location.existingStorageAccount,
          }
        : null,
      setupBy: account?.email ?? null,
      simulateFailure: state.simulateFailure,
    };
  }, [
    app,
    role,
    goals,
    needs.needsApp,
    needs.needsStorage,
    needs.protectsVms,
    displayName,
    updatingExisting,
    existingTenantAccount,
    subscription,
    selectedApp,
    selectedRole,
    appServices,
    requiredActions,
    location,
    account,
    state.simulateFailure,
  ]);

  const canProceedByStep = {
    signIn: signedIn,
    goal: GOAL_OPTIONS.some((goal) => goals[goal.key]),
    app:
      app.mode === "new"
        ? results.registerApps === "allowed"
        : Boolean(selectedApp) && (app.secretMode === "new" ? results.appOwner === "allowed" : results.secret === "allowed"),
    permissions:
      results.assignRoles === "allowed" &&
      (role.mode === "create" ? results.createRoles === "allowed" : results.roleFit === "allowed"),
    storage: Object.keys(locationErrors).length === 0,
    review: displayNameError === null,
  };

  const pickAccount = useCallback(
    async (pickedAccount) => {
      act({ type: "signInStarted", account: pickedAccount });
      await wait(SIGN_IN_MS);
      // Re-runs the current step's checks for the new account.
      if (mountedRef.current) act({ type: "signInDone" });
    },
    [act],
  );

  // Runs a step's Azure creation tasks one by one. A retry resumes from the
  // task that failed; tasks already done aren't run again.
  const createForStep = useCallback(
    async (stepId, currentSummary) => {
      const previous = stateRef.current.creation[stepId];
      const tasks =
        previous.status === "failed"
          ? previous.tasks.map((task) =>
              task.status === "failed" ? { ...task, status: "pending", description: task.baseDescription } : task,
            )
          : buildStepTasks(stepId, currentSummary).map(([id, activeLabel, doneLabel, durationMs, description]) => ({
              id,
              activeLabel,
              doneLabel,
              durationMs,
              description,
              baseDescription: description,
              status: "pending", // "pending" | "active" | "done" | "failed"
            }));
      const { creationRun: run } = send({ type: "creationStarted", stepId, tasks });
      const stillRunning = () => mountedRef.current && stateRef.current.creationRun === run;

      for (let index = 0; index < tasks.length; index += 1) {
        if (tasks[index].status === "done") continue;
        send({ type: "taskUpdated", stepId, index, patch: { status: "active" }, run });
        await wait(tasks[index].durationMs);
        if (!stillRunning()) return;
        const { simulateFailure, failureUsed } = stateRef.current;
        if (simulateFailure && !failureUsed && index === tasks.length - 1) {
          send({ type: "failureUsed" });
          send({ type: "taskUpdated", stepId, index, patch: { status: "failed", description: FAILURE_MESSAGES[stepId] }, run });
          send({ type: "creationFinished", stepId, status: "failed", run });
          return;
        }
        send({ type: "taskUpdated", stepId, index, patch: { status: "done" }, run });
      }
      send({ type: "creationFinished", stepId, status: "done", run });
    },
    [send],
  );

  const actions = useMemo(
    () => ({
      openSignIn: () => act({ type: "openPicker" }),
      closePicker: () => act({ type: "closePicker" }),
      pickAccount,
      setSubscription: (value) => act({ type: "setSubscription", value }),
      setConnectionChoice: (value) => act({ type: "setConnectionChoice", value }),
      toggleGoal: (key) => act({ type: "toggleGoal", key }),
      setAppField: (field, value) => act({ type: "setAppField", field, value }),
      validateSecret: () => runCheck("secret"),
      setRoleField: (field, value) => act({ type: "setRoleField", field, value }),
      createForStep,
      restart: () => act({ type: "restart" }),
      setLocationField: (field, value) => act({ type: "setLocationField", field, value }),
      setAdminEmail: (value) => act({ type: "setAdminEmail", value }),
      markAdminLinkSent: (email) => act({ type: "adminLinkSent", email }),
      setDisplayName: (value) => act({ type: "setDisplayName", value }),
      setSimulateFailure: (value) => act({ type: "setSimulateFailure", value }),
      goToStep: (stepId) => act({ type: "goToStep", stepId }),
    }),
    [act, pickAccount, runCheck, createForStep],
  );

  const currentStepId = steps[stepIndex].id;
  const created = CREATION_STEPS.filter((stepId) => state.creation[stepId].status === "done");
  const busyCreating = CREATION_STEPS.some((stepId) => state.creation[stepId].status === "running");
  const anyCreated = created.length > 0 || busyCreating;
  const stepCreation = CREATION_STEPS.includes(currentStepId) ? state.creation[currentStepId] : null;
  const stepHasTasks = stepCreation ? buildStepTasks(currentStepId, summary).length > 0 : false;
  const stepValid = canProceedByStep[currentStepId];

  // What the footer's primary button does on this step.
  let primary;
  if (currentStepId === "review") {
    primary = { kind: "connect", label: "Connect", enabled: stepValid };
  } else if (!stepCreation || !stepHasTasks || stepCreation.status === "done") {
    primary = { kind: "next", label: "Next", enabled: stepCreation?.status === "done" || stepValid };
  } else if (stepCreation.status === "running") {
    primary = { kind: "running", label: "Creating…", enabled: false };
  } else {
    primary = {
      kind: "create",
      label: stepCreation.status === "failed" ? "Retry" : getCreateLabel(currentStepId, summary),
      enabled: stepValid,
    };
  }

  // Once something exists in Azure, the choices it was made from are fixed;
  // changing them means starting over.
  const locked = {
    signIn: anyCreated,
    goal: anyCreated,
    app: state.creation.app.status !== "idle" && state.creation.app.status !== "failed",
    permissions: state.creation.permissions.status !== "idle" && state.creation.permissions.status !== "failed",
    storage: state.creation.storage.status !== "idle" && state.creation.storage.status !== "failed",
  };
  locked.subscription = locked.permissions || locked.storage;

  return {
    state,
    derived: {
      primary,
      locked,
      stepCreation,
      anyCreated,
      busyCreating,
      createdItems: created.flatMap((stepId) => describeCreated(stepId, summary)),
      steps,
      stepIndex,
      isLastStep: stepIndex === steps.length - 1,
      needs,
      signedIn,
      existingTenantAccount,
      updatingExisting,
      subscriptionName: subscription?.name ?? "",
      selectedApp,
      selectedRole,
      requiredActions,
      missingRoleActions,
      results,
      displayName,
      displayNameError,
      canProceed: canProceedByStep[steps[stepIndex].id],
      canSendAdminLink: isValidEmail(state.adminEmail),
      locationErrors,
      summary,
    },
    actions,
  };
}
