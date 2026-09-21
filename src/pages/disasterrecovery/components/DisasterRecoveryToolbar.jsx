import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import EntityFiltersDialog from "../../../components/EntityFiltersDialog";
import EntityFilterBar from "../../../components/EntityFilterBar";
import SaveSearchDialog from "../../../components/SaveSearchDialog";
import { getContextLabel } from "../../../routes/subRoutes";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { useDebouncedSearchInput } from "../../../hooks/useDebouncedSearchInput";
import { useEntityFilterState } from "../../../hooks/useEntityFilterState";
import { disasterRecoveryStore, useDisasterRecoveryData } from "../hooks/useDisasterRecoveryData";
import { DISASTER_RECOVERY_FILTER_FIELDS, disasterRecoveryFilterStore } from "../hooks/disasterRecoveryFilters";

const selectSelectionState = (state) => ({
  rows: state.rows,
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function DisasterRecoveryToolbar() {
  const navigate = useNavigate();
  const { selectedId } = useOutletContext();
  const { rows, selectionModel, saving, apiRef } = useDisasterRecoveryData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(disasterRecoveryStore.deleteSelected);

  const context = getContextLabel(selectedId);

  // Entity filters/search — all 4 sub-nav pages share the same underlying
  // runbook rows today (see disasterRecoveryFilters.js), so this mirrors the
  // same rows DisasterRecoveryTable independently filters against.
  const filterState = useEntityFilterState(disasterRecoveryFilterStore, rows);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false);
  const searchInput = useDebouncedSearchInput(filterState.searchText, filterState.onSearchTextChange);

  return (
    <>
      <ListToolbar
        addLabel={`Add ${context}`}
        onAdd={() => navigate("/disaster-recovery/dr-runbooks/new")}
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
        fields={DISASTER_RECOVERY_FILTER_FIELDS}
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
