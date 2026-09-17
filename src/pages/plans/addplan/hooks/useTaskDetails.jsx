import { useCallback, useState } from "react";
import { createMergeScheduleRow, createScheduleRow } from "../data/scheduleOptions";

// Shared add/remove/update semantics for a schedule builder's row list —
// used for both the Backup Schedule and Merge Schedule sections, which only
// differ in their row shape (see createScheduleRow / createMergeScheduleRow).
// addRow/removeRow/updateRow are wrapped in useCallback so their identity
// stays stable across renders (setRows is itself stable) — useAddPlanWizard
// relies on that to keep the props it hands down to step components stable.
function useRowList(createRow) {
  const [rows, setRows] = useState(() => [createRow()]);
  const addRow = useCallback(() => setRows((current) => [...current, createRow()]), [createRow]);
  const removeRow = useCallback(
    (id) => setRows((current) => current.filter((row) => row.id !== id)),
    [],
  );
  const updateRow = useCallback(
    (id, patch) =>
      setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row))),
    [],
  );
  return { rows, addRow, removeRow, updateRow };
}

/**
 * Owns the "Where to Protect" / "When to Protect" / "Additional Settings"
 * field state for the Tasks step (Figma nodes 6478:6168, 6478:6498,
 * 7567:9589, 8327:27661). Lifted into useAddPlanWizard (rather than being
 * called locally by TasksStep) so this state survives navigating away from
 * and back to the Tasks step, gets dirty-tracked like every other field, and
 * is available to include in the plan payload on submit.
 */
export function useTaskDetails() {
  const [backupDestinationType, setBackupDestinationType] = useState("recovery_point_server");
  const [recoveryPointServerId, setRecoveryPointServerId] = useState("");
  const [dataStoreId, setDataStoreId] = useState("");
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [sessionPassword, setSessionPassword] = useState("");
  const [confirmSessionPassword, setConfirmSessionPassword] = useState("");

  const backupSchedule = useRowList(createScheduleRow);
  const [backupScheduleExpanded, setBackupScheduleExpanded] = useState(true);

  const mergeSchedule = useRowList(createMergeScheduleRow);
  const [mergeScheduleExpanded, setMergeScheduleExpanded] = useState(true);

  const [executeCopyJobsInParallel, setExecuteCopyJobsInParallel] = useState(false);

  return {
    backupDestinationType,
    setBackupDestinationType,
    recoveryPointServerId,
    setRecoveryPointServerId,
    dataStoreId,
    setDataStoreId,
    passwordProtected,
    setPasswordProtected,
    sessionPassword,
    setSessionPassword,
    confirmSessionPassword,
    setConfirmSessionPassword,

    scheduleRows: backupSchedule.rows,
    addScheduleRow: backupSchedule.addRow,
    removeScheduleRow: backupSchedule.removeRow,
    updateScheduleRow: backupSchedule.updateRow,
    backupScheduleExpanded,
    setBackupScheduleExpanded,

    mergeScheduleRows: mergeSchedule.rows,
    addMergeScheduleRow: mergeSchedule.addRow,
    removeMergeScheduleRow: mergeSchedule.removeRow,
    updateMergeScheduleRow: mergeSchedule.updateRow,
    mergeScheduleExpanded,
    setMergeScheduleExpanded,

    executeCopyJobsInParallel,
    setExecuteCopyJobsInParallel,
  };
}
