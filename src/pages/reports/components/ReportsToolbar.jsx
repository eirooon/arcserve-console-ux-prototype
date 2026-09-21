import { useState } from "react";
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
import { filterReportsByCategory, reportsStore, useReportsData } from "../hooks/useReportsData";
import { REPORTS_FILTER_FIELDS, reportsFilterStore } from "../hooks/reportsFilters";

const selectSelectionState = (state) => ({
  rows: state.rows,
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

export default function ReportsToolbar() {
  const { selectedId } = useOutletContext();
  const { rows, selectionModel, saving, apiRef } = useReportsData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(reportsStore.deleteSelected);

  const context = getContextLabel(selectedId);

  // Entity filters/search apply on top of whatever the left sub-nav category
  // already narrowed down to, so the Filters modal's dynamic option list
  // (Schedule) only offers values present in that category — mirrors the
  // same categoryRows computation ReportsTable does internally.
  const categoryRows = filterReportsByCategory(rows, selectedId);
  const filterState = useEntityFilterState(reportsFilterStore, categoryRows);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false);
  const searchInput = useDebouncedSearchInput(filterState.searchText, filterState.onSearchTextChange);

  return (
    <>
      <ListToolbar
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
        fields={REPORTS_FILTER_FIELDS}
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
        title="Delete selected reports?"
        description={`This will remove ${selectionModel.length} selected report(s). This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
