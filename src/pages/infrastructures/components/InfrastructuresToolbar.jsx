import { useOutletContext } from "react-router-dom";
import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { getContextLabel } from "../../../routes/subRoutes";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { infrastructureStore, useInfrastructureData } from "../hooks/useInfrastructureData";

const selectSelectionState = (state) => ({
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function InfrastructuresToolbar({ secondaryAction, showColumnsButton }) {
  const { selectedId } = useOutletContext();
  const { selectionModel, saving, apiRef } = useInfrastructureData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(infrastructureStore.deleteSelected);

  const context = getContextLabel(selectedId);

  return (
    <>
      <ListToolbar
        addLabel={`Add ${context}`}
        onAdd={infrastructureStore.openAdd}
        secondaryAction={secondaryAction}
        showColumnsButton={showColumnsButton}
        selectedCount={selectionModel.length}
        actionItems={[{ label: "Delete", onClick: openConfirm }]}
        apiRef={apiRef}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete selected infrastructure?"
        description={`This will remove ${selectionModel.length} selected item(s). This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
