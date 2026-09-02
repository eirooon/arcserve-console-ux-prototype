import { useOutletContext } from "react-router-dom";
import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { getContextLabel } from "../../../routes/subRoutes";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { sourceStore, useSourceData } from "../hooks/useSourceData";

const selectSelectionState = (state) => ({
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function SourcesToolbar() {
  const { selectedId } = useOutletContext();
  const { selectionModel, saving, apiRef } = useSourceData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(sourceStore.deleteSelected);

  const context = getContextLabel(selectedId);

  return (
    <>
      <ListToolbar
        addLabel={`Add ${context}`}
        onAdd={sourceStore.openAdd}
        showSearch
        searchPlaceholder={`Search ${context?.toLowerCase()}`}
        showFilters
        selectedCount={selectionModel.length}
        actionItems={[{ label: "Delete", onClick: openConfirm }]}
        apiRef={apiRef}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete selected sources?"
        description={`This will remove ${selectionModel.length} selected source(s). This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
