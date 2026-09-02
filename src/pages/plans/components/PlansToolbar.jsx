import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { plansStore, usePlansData } from "../hooks/usePlansData";

const selectSelectionState = (state) => ({
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function PlansToolbar() {
  const { selectionModel, saving, apiRef } = usePlansData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(plansStore.deleteSelected);

  return (
    <>
      <ListToolbar
        addLabel="Add Plans"
        onAdd={plansStore.openAdd}
        showSearch
        searchPlaceholder="Search plans"
        selectedCount={selectionModel.length}
        actionItems={[{ label: "Delete", onClick: openConfirm }]}
        apiRef={apiRef}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete selected plans?"
        description={`This will remove ${selectionModel.length} selected plan(s). This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
