import { useOutletContext } from "react-router-dom";
import ListToolbar from "../../components/ListToolbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getContextLabel } from "../../routes/subRoutes";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import SettingsTable from "./components/SettingsTable";
import { settingsStore, useSettingsData } from "./hooks/useSettingsData";

const selectSelectionState = (state) => ({
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function SourceGroups() {
  const { selectedId } = useOutletContext();
  const { selectionModel, saving, apiRef } = useSettingsData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(settingsStore.deleteSelected);

  const context = getContextLabel(selectedId);

  return (
    <>
      <ListToolbar
        addLabel={`Add ${context}`}
        onAdd={settingsStore.openAdd}
        showSearch
        searchPlaceholder={`Search ${context?.toLowerCase()}`}
        selectedCount={selectionModel.length}
        actionItems={[{ label: "Delete", onClick: openConfirm }]}
        apiRef={apiRef}
      />
      <SettingsTable />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete selected settings?"
        description={`This will remove ${selectionModel.length} selected item(s). This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
