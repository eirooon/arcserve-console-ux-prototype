import { useState } from "react";
import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import EntityFiltersDialog from "../../../components/EntityFiltersDialog";
import EntityFilterBar from "../../../components/EntityFilterBar";
import SaveSearchDialog from "../../../components/SaveSearchDialog";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { useDebouncedSearchInput } from "../../../hooks/useDebouncedSearchInput";
import { useEntityFilterState } from "../../../hooks/useEntityFilterState";
import { jobsStore, useJobsData } from "../hooks/useJobsData";
import { JOBS_FILTER_FIELDS, jobsFilterStore } from "../jobsFilters";

const selectToolbarState = (state) => ({
  rows: state.rows,
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function JobsToolbar() {
  const { rows, selectionModel, saving, apiRef } = useJobsData(selectToolbarState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(jobsStore.deleteSelected);

  const filterState = useEntityFilterState(jobsFilterStore, rows);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false);
  const searchInput = useDebouncedSearchInput(filterState.searchText, filterState.onSearchTextChange);

  return (
    <>
      <ListToolbar
        showSearch
        searchPlaceholder="Search jobs"
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
        fields={JOBS_FILTER_FIELDS}
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
        title="Delete selected jobs?"
        description={`This will remove ${selectionModel.length} selected job(s) from history. This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
