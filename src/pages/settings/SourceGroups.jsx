import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ListToolbar from "../../components/ListToolbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import EntityFiltersDialog from "../../components/EntityFiltersDialog";
import EntityFilterBar from "../../components/EntityFilterBar";
import SaveSearchDialog from "../../components/SaveSearchDialog";
import { getContextLabel } from "../../routes/subRoutes";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import { useDebouncedSearchInput } from "../../hooks/useDebouncedSearchInput";
import { useEntityFilterState } from "../../hooks/useEntityFilterState";
import SettingsTable from "./components/SettingsTable";
import { settingsStore, useSettingsData } from "./hooks/useSettingsData";
import { SETTINGS_FILTER_FIELDS, settingsFilterStore } from "./hooks/settingsFilters";

const selectSelectionState = (state) => ({
  rows: state.rows,
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function SourceGroups() {
  const { selectedId } = useOutletContext();
  const { rows, selectionModel, saving, apiRef } = useSettingsData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(settingsStore.deleteSelected);

  const context = getContextLabel(selectedId);

  const filterState = useEntityFilterState(settingsFilterStore, rows);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false);
  const searchInput = useDebouncedSearchInput(filterState.searchText, filterState.onSearchTextChange);

  return (
    <>
      <ListToolbar
        addLabel={`Add ${context}`}
        onAdd={settingsStore.openAdd}
        showSearch
        searchPlaceholder={`Search ${context?.toLowerCase()}`}
        searchValue={searchInput.value}
        onSearchChange={searchInput.onChange}
        onSearchSubmit={searchInput.onSubmit}
        showFilters
        onFiltersClick={() => setFiltersDialogOpen(true)}
        selectedCount={selectionModel.length}
        actionItems={[{ label: "Delete", onClick: openConfirm }]}
        apiRef={apiRef}
      />
      <EntityFilterBar
        resultCount={filterState.resultCount}
        savedSearches={filterState.savedSearches}
        activeSavedSearchId={filterState.activeSavedSearchId}
        onSelectSavedSearch={filterState.onSelectSavedSearch}
        filterChips={filterState.filterChips}
        onRemoveFilter={filterState.onRemoveFilter}
        onClearAll={filterState.onClearFilters}
        onSaveSearch={() => setSaveSearchDialogOpen(true)}
        searchText={filterState.searchText}
        onClearSearch={() => filterState.onSearchTextChange("")}
      />
      <EntityFiltersDialog
        open={filtersDialogOpen}
        fields={SETTINGS_FILTER_FIELDS}
        rows={rows}
        initialFilters={filterState.filters}
        onClose={() => setFiltersDialogOpen(false)}
        onSearch={(next) => {
          filterState.onApplyFilters(next);
          setFiltersDialogOpen(false);
        }}
      />
      <SaveSearchDialog
        open={saveSearchDialogOpen}
        onClose={() => setSaveSearchDialogOpen(false)}
        onSave={(name) => {
          filterState.onSaveSearch(name);
          setSaveSearchDialogOpen(false);
        }}
      />
      <SettingsTable rows={filterState.filteredRows} />
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
