import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { alertRulesStore, useAlertRulesData } from "../hooks/useAlertRulesData";

const selectSelectionState = (state) => ({
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function AlertRulesToolbar() {
  const { selectionModel, saving, apiRef } = useAlertRulesData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(alertRulesStore.deleteSelected);

  return (
    <>
      <ListToolbar
        addLabel="Create Alert Rule"
        onAdd={alertRulesStore.openAdd}
        selectedCount={selectionModel.length}
        actionItems={[{ label: "Delete", onClick: openConfirm }]}
        apiRef={apiRef}
        sx={{ backgroundColor: "background.paper" }}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete selected alert rules?"
        description={`This will remove ${selectionModel.length} selected rule(s). This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
