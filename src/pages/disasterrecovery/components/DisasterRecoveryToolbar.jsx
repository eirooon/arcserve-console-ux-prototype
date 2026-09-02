import { useOutletContext, useNavigate } from "react-router-dom";
import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { getContextLabel } from "../../../routes/subRoutes";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { disasterRecoveryStore, useDisasterRecoveryData } from "../hooks/useDisasterRecoveryData";

const selectSelectionState = (state) => ({
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function DisasterRecoveryToolbar() {
  const navigate = useNavigate();
  const { selectedId } = useOutletContext();
  const { selectionModel, saving, apiRef } = useDisasterRecoveryData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(disasterRecoveryStore.deleteSelected);

  const context = getContextLabel(selectedId);

  return (
    <>
      <ListToolbar
        addLabel={`Add ${context}`}
        onAdd={() => navigate("/disaster-recovery/dr-runbooks/new")}
        showSearch
        searchPlaceholder={`Search ${context?.toLowerCase()}`}
        showFilters
        selectedCount={selectionModel.length}
        actionItems={[{ label: "Delete", onClick: openConfirm }]}
        apiRef={apiRef}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete selected items?"
        description={`This will remove ${selectionModel.length} selected item(s). This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
