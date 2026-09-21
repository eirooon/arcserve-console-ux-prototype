import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import EntityFiltersDialog from "../../../components/EntityFiltersDialog";
import EntityFilterBar from "../../../components/EntityFilterBar";
import SaveSearchDialog from "../../../components/SaveSearchDialog";
import { getContextLabel } from "../../../routes/subRoutes";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { useDebouncedSearchInput } from "../../../hooks/useDebouncedSearchInput";
import { useEntityFilterState } from "../../../hooks/useEntityFilterState";
import { destinationStore, filterDestinationsByCategory, useDestinationData } from "../hooks/useDestinationData";
import { DESTINATIONS_FILTER_FIELDS, destinationsFilterStore } from "../hooks/destinationsFilters";

const selectSelectionState = (state) => ({
  rows: state.rows,
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function DestinationsToolbar() {
  const { selectedId } = useOutletContext();
  const { rows, selectionModel, saving, apiRef } = useDestinationData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(destinationStore.deleteSelected);

  const context = getContextLabel(selectedId);

  const categoryRows = useMemo(
    () => filterDestinationsByCategory(rows, selectedId),
    [rows, selectedId],
  );
  const filterState = useEntityFilterState(destinationsFilterStore, categoryRows);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false);
  const searchInput = useDebouncedSearchInput(filterState.searchText, filterState.onSearchTextChange);

  return (
    <>
      <ListToolbar
        addLabel={`Add ${context}`}
        onAdd={destinationStore.openAdd}
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
        fields={DESTINATIONS_FILTER_FIELDS}
        rows={categoryRows}
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
