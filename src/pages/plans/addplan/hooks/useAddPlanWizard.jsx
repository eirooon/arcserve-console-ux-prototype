import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { plansStore, usePlansData } from "../../hooks/usePlansData";
import { PROTECTION_TYPES } from "../data/protectionTypes";
import { usePageBreadcrumb } from "../../../../hooks/usePageBreadcrumb";
import { useDirtyState } from "../../../../hooks/useDirtyState";
import { useTaskDetails } from "./useTaskDetails";

export const ADD_PLAN_STEPS = [
  {
    id: "basic",
    label: "Basic",
    description: "Select the type of protection for the sources.",
  },
  {
    id: "sources",
    label: "Sources (Optional)",
    description: "Select the sources you wish to protect under this policy.",
  },
  {
    id: "tasks",
    label: "Tasks",
    description: "Select the task for the data to be protected.",
  },
];

const selectPlansState = (state) => ({
  saving: state.saving,
  rows: state.rows,
  loading: state.loading,
});

// A form field that starts out mirroring `defaultValue` (which may only
// become available once async data — e.g. the plan being edited — finishes
// loading) but switches to the user's own input the moment they change it,
// without ever needing an effect to "seed" local state from that default.
// `setValue` is memoized so it keeps a stable identity across renders (its
// own state setters are already React-stable) — callers can safely wrap it
// with useCallback/track() without it churning on every render.
function useEditableField(defaultValue) {
  const [touched, setTouched] = useState(false);
  const [raw, setRaw] = useState(defaultValue);
  const setValue = useCallback((next) => {
    setTouched(true);
    setRaw(next);
  }, []);
  return [touched ? raw : defaultValue, setValue];
}

// `track(fn)` (see useDirtyState) returns a fresh wrapper function every
// time it's called, so calling it inline defeats useCallback's memoization.
// This keeps that wrapper's identity stable across renders too, as long as
// `track` and `fn` themselves are (which they are for everything below).
function useTrackedSetter(track, fn) {
  return useCallback((...args) => track(fn)(...args), [track, fn]);
}

/**
 * Owns all form/navigation state for the Add Plan wizard (see
 * src/pages/plans/addplan/AddPlanPage.jsx) so every step component stays a
 * pure, presentation-only view over the fields and callbacks it needs. Also
 * doubles as the Modify/View page: when the route carries a `planId` (see
 * the "/plans/:planId" route in App.jsx), the Basic step's fields are
 * pre-filled from that existing plan and submitting updates it instead of
 * creating a new one.
 */
export function useAddPlanWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { planId } = useParams();
  const isEditing = Boolean(planId);
  const { saving, rows, loading } = usePlansData(selectPlansState);

  // A fresh create hands off to "/plans/:id" (see submit below) carrying the
  // step the user was on via router state, so that URL swap — needed so a
  // second Save edits the new plan instead of creating a duplicate —
  // doesn't also bounce them back to the first step.
  const [stepId, setStepId] = useState(location.state?.stepId ?? ADD_PLAN_STEPS[0].id);
  const [selectedSourceIds, setSelectedSourceIds] = useState([]);

  // See useDirtyState — the app-standard way to keep Save disabled until
  // something has actually changed, and disabled again right after saving.
  const { dirty, track, markClean } = useDirtyState();

  const existingPlan = useMemo(
    () => (isEditing ? rows.find((row) => String(row.id) === planId) : null),
    [isEditing, rows, planId],
  );

  // Basic step fields default to the existing plan's values once its row
  // has loaded (see useEditableField above) — nothing to do here until the
  // user actually edits one. If the id doesn't match any plan once rows
  // have finished loading, there's nothing to edit — bounce back.
  useEffect(() => {
    if (!isEditing || loading || existingPlan) return;
    navigate("/plans", { replace: true });
  }, [isEditing, loading, existingPlan, navigate]);

  const [planName, setPlanName] = useEditableField(existingPlan?.plan_name ?? "");
  const [protectionTypeId, setProtectionTypeId] = useEditableField(
    isEditing
      ? PROTECTION_TYPES.find((type) => type.label === existingPlan?.policy_type)?.id ?? null
      : null,
  );
  const [description, setDescription] = useEditableField(existingPlan?.description ?? "");

  // The registry-driven breadcrumb (see AppBreadcrumbs) can't know a plan's
  // name ahead of time, so publish it as the trailing "Plans > <name>"
  // crumb ourselves while editing — the Add flow keeps its static "Add
  // Plan" crumb from subRoutes.js instead.
  usePageBreadcrumb(isEditing ? planName : null);

  const protectionType = useMemo(
    () => PROTECTION_TYPES.find((type) => type.id === protectionTypeId) ?? null,
    [protectionTypeId],
  );

  // Defaults the "Activity Type" select on the Tasks step to whatever
  // Protection Type was chosen on Basic, until the user explicitly changes
  // it themselves.
  const [activityType, setActivityType] = useEditableField(protectionType?.label ?? "");

  // Owns the Tasks step's own field state (see useTaskDetails) so it
  // survives navigating away from and back to that step, and so its values
  // can be included in the payload on submit — see taskDetailsForPayload
  // and payload.task_details below. Every setter that changes real data is
  // wrapped with `track` the same way the fields above are; the two
  // accordion expand/collapse flags are left untracked since they're pure
  // UI presentation state, not something a save should be gated on.
  const taskDetailsRaw = useTaskDetails();
  const taskDetails = useMemo(
    () => ({
      ...taskDetailsRaw,
      setBackupDestinationType: track(taskDetailsRaw.setBackupDestinationType),
      setRecoveryPointServerId: track(taskDetailsRaw.setRecoveryPointServerId),
      setDataStoreId: track(taskDetailsRaw.setDataStoreId),
      setPasswordProtected: track(taskDetailsRaw.setPasswordProtected),
      setSessionPassword: track(taskDetailsRaw.setSessionPassword),
      setConfirmSessionPassword: track(taskDetailsRaw.setConfirmSessionPassword),
      addScheduleRow: track(taskDetailsRaw.addScheduleRow),
      removeScheduleRow: track(taskDetailsRaw.removeScheduleRow),
      updateScheduleRow: track(taskDetailsRaw.updateScheduleRow),
      addMergeScheduleRow: track(taskDetailsRaw.addMergeScheduleRow),
      removeMergeScheduleRow: track(taskDetailsRaw.removeMergeScheduleRow),
      updateMergeScheduleRow: track(taskDetailsRaw.updateMergeScheduleRow),
      setExecuteCopyJobsInParallel: track(taskDetailsRaw.setExecuteCopyJobsInParallel),
    }),
    [taskDetailsRaw, track],
  );

  const stepIndex = ADD_PLAN_STEPS.findIndex((step) => step.id === stepId);
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === ADD_PLAN_STEPS.length - 1;
  const isBasicValid = planName.trim().length > 0;
  // While editing, don't allow a save to go through until the plan being
  // edited has actually loaded — submitting during that window can't tell
  // an update from a create (see submit's isEditing && existingPlan check
  // below) and would silently create a duplicate instead of updating it.
  const canSubmit = isBasicValid && dirty && (!isEditing || Boolean(existingPlan));

  const goToStep = useCallback(
    (id) => {
      const targetIndex = ADD_PLAN_STEPS.findIndex((step) => step.id === id);
      // Only steps already reached (current or earlier) are navigable from
      // the left step nav — later steps stay reachable only via "Next".
      if (targetIndex !== -1 && targetIndex <= stepIndex) setStepId(id);
    },
    [stepIndex],
  );

  const goNext = useCallback(() => {
    if (isLastStep) return;
    setStepId(ADD_PLAN_STEPS[stepIndex + 1].id);
  }, [isLastStep, stepIndex]);

  const goPrevious = useCallback(() => {
    if (isFirstStep) return;
    setStepId(ADD_PLAN_STEPS[stepIndex - 1].id);
  }, [isFirstStep, stepIndex]);

  const cancel = useCallback(() => navigate("/plans"), [navigate]);

  const selectSource = useCallback(
    (id) => setSelectedSourceIds((ids) => (ids.includes(id) ? ids : [...ids, id])),
    [],
  );
  const removeSources = useCallback((ids) => {
    const removedSet = new Set(ids);
    setSelectedSourceIds((current) => current.filter((id) => !removedSet.has(id)));
  }, []);

  const submit = async () => {
    if (!canSubmit || saving) return;
    // Editing a plan doesn't currently re-load which specific sources it
    // protects (only its count is persisted on the plan record, not the ids
    // — see AUTO_PROTECT_SOURCES-style limitations elsewhere in this app),
    // so any sources picked here during an edit are additional to — not a
    // replacement for — the ones it already protects.
    const protectedSources = isEditing
      ? (existingPlan?.protected_sources ?? 0) + selectedSourceIds.length
      : selectedSourceIds.length;
    const payload = {
      plan_name: planName.trim(),
      // Plan Type and Protection Type are the same concept in this app —
      // there's no separate UI for it, so this just carries over whatever
      // the plan already had (or the default, for a new plan).
      plan_type: existingPlan?.plan_type ?? "backup_recovery",
      plan_status: existingPlan?.plan_status ?? "active",
      protected_sources: protectedSources,
      unprotected_sources: existingPlan?.unprotected_sources ?? 0,
      source_group: existingPlan?.source_group ?? null,
      policy_type: protectionType?.label ?? existingPlan?.policy_type ?? "",
      description: description.trim(),
      // Mock data model has no schema for these yet (see mocks/data/plans.js)
      // beyond round-tripping through the mock API, but they're included so
      // the Tasks step's fields are at least preserved on the saved record
      // instead of being silently dropped.
      task_details: {
        backup_destination_type: taskDetailsRaw.backupDestinationType,
        recovery_point_server_id: taskDetailsRaw.recoveryPointServerId,
        data_store_id: taskDetailsRaw.dataStoreId,
        password_protected: taskDetailsRaw.passwordProtected,
        session_password: taskDetailsRaw.passwordProtected ? taskDetailsRaw.sessionPassword : null,
        backup_schedule: taskDetailsRaw.scheduleRows,
        merge_schedule: taskDetailsRaw.mergeScheduleRows,
        execute_copy_jobs_in_parallel: taskDetailsRaw.executeCopyJobsInParallel,
      },
    };
    // save() PUTs vs POSTs based on the store's dialog state (shared with
    // the generic edit-dialog flow — see EntityFormDialog/openEdit), so set
    // it to "edit" right before saving; save() clears it again once done.
    if (isEditing && existingPlan) plansStore.openEdit(existingPlan);
    const saved = await plansStore.save(payload);
    if (!saved) {
      // save() already recorded the error on the store; let the user know
      // and leave the form dirty/editable so they can retry without losing
      // anything or accidentally issuing a duplicate create.
      plansStore.showSnackbar(
        `Couldn't ${isEditing ? "update" : "create"} "${planName.trim()}". Please try again.`,
        "error",
      );
      return;
    }
    plansStore.showSnackbar(`"${planName.trim()}" was ${isEditing ? "updated" : "created"}.`);
    markClean();
    // Stay on this page rather than returning to the Plans table — the
    // confirmation shows in the shared toast stack (see ToastHost). A
    // fresh create switches the URL to the new plan's own id (replacing
    // history so Back still goes to the list, not back to /plans/new; and
    // carrying the current step along so the page swap doesn't also bounce
    // the user back to Basic) so a second Save edits that plan instead of
    // silently creating a duplicate. That remount starts with `dirty` back
    // at false on its own, same as the explicit reset above for the
    // in-place edit path.
    if (!isEditing && saved?.id) {
      navigate(`/plans/${saved.id}`, { replace: true, state: { stepId } });
    }
  };

  // Every tracked setter below wraps an already-stable function (a plain
  // useState setter, or one of the useCallback-wrapped helpers above) with
  // `track`, via useTrackedSetter, so its identity stays stable across
  // renders too — BasicStep/SourcesStep/TasksStep get the same function
  // reference every render instead of a fresh one on every keystroke.
  const trackedSetPlanName = useTrackedSetter(track, setPlanName);
  const trackedSetProtectionTypeId = useTrackedSetter(track, setProtectionTypeId);
  const trackedSetDescription = useTrackedSetter(track, setDescription);
  const trackedSetSelectedSourceIds = useTrackedSetter(track, setSelectedSourceIds);
  const trackedSelectSource = useTrackedSetter(track, selectSource);
  const trackedRemoveSources = useTrackedSetter(track, removeSources);
  const trackedSetActivityType = useTrackedSetter(track, setActivityType);

  return {
    steps: ADD_PLAN_STEPS,
    stepId,
    stepIndex,
    isFirstStep,
    isLastStep,
    goToStep,
    goNext,
    goPrevious,
    cancel,
    submit,
    saving,
    isBasicValid,
    canSubmit,
    isEditing,

    planName,
    setPlanName: trackedSetPlanName,
    protectionTypeId,
    setProtectionTypeId: trackedSetProtectionTypeId,
    protectionType,
    description,
    setDescription: trackedSetDescription,

    selectedSourceIds,
    setSelectedSourceIds: trackedSetSelectedSourceIds,
    selectSource: trackedSelectSource,
    removeSources: trackedRemoveSources,

    activityType,
    setActivityType: trackedSetActivityType,

    taskDetails,
  };
}
