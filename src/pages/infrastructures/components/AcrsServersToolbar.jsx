import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { acrsServersStore, useAcrsServersData } from "../hooks/useAcrsServersData";

const selectSelectionState = (state) => ({
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function AcrsServersToolbar() {
  const { selectionModel, saving, apiRef } = useAcrsServersData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(acrsServersStore.deleteSelected);

  return (
    <>
      <ListToolbar
        addLabel="Add Arcserve Cyber Resilient Server"
        onAdd={() => acrsServersStore.openAdd()}
        selectedCount={selectionModel.length}
        actionItems={[{ label: "Delete", onClick: openConfirm }]}
        apiRef={apiRef}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete selected servers?"
        description={`This will remove ${selectionModel.length} selected Arcserve Cyber Resilient Server(s). This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
