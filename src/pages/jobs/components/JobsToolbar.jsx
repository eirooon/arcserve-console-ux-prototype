import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { jobsStore, useJobsData } from "../hooks/useJobsData";

const selectSelectionState = (state) => ({
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function JobsToolbar() {
  const { selectionModel, saving, apiRef } = useJobsData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(jobsStore.deleteSelected);

  return (
    <>
      <ListToolbar
        showSearch
        searchPlaceholder="Search jobs"
        selectedCount={selectionModel.length}
        actionItems={[{ label: "Delete", onClick: openConfirm }]}
        apiRef={apiRef}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete selected jobs?"
        description={`This will remove ${selectionModel.length} selected job(s) from history. This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
