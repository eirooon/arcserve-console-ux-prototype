import { useOutletContext } from "react-router-dom";
import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { getContextLabel } from "../../../routes/subRoutes";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { destinationStore, useDestinationData } from "../hooks/useDestinationData";

const selectSelectionState = (state) => ({
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function DestinationsToolbar() {
  const { selectedId } = useOutletContext();
  const { selectionModel, saving, apiRef } = useDestinationData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(destinationStore.deleteSelected);

  const context = getContextLabel(selectedId);

  return (
    <>
      <ListToolbar
        addLabel={`Add ${context}`}
        onAdd={destinationStore.openAdd}
        showSearch
        searchPlaceholder={`Search ${context?.toLowerCase()}`}
        selectedCount={selectionModel.length}
        actionItems={[{ label: "Delete", onClick: openConfirm }]}
        apiRef={apiRef}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete selected destinations?"
        description={`This will remove ${selectionModel.length} selected destination(s). This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
