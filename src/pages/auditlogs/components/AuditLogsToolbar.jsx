import { useState } from "react";
import { FileDownload } from "@mui/icons-material";
import ListToolbar from "../../../components/ListToolbar";
import EntityFiltersDialog from "../../../components/EntityFiltersDialog";
import EntityFilterBar from "../../../components/EntityFilterBar";
import SaveSearchDialog from "../../../components/SaveSearchDialog";
import { useDebouncedSearchInput } from "../../../hooks/useDebouncedSearchInput";
import { useEntityFilterState } from "../../../hooks/useEntityFilterState";
import { useAuditLogsData } from "../hooks/useAuditLogsData";
import { AUDIT_LOGS_FILTER_FIELDS, auditLogsFilterStore } from "../hooks/auditLogsFilters";

const selectToolbarState = (state) => ({ rows: state.rows, apiRef: state.apiRef });

export default function AuditLogsToolbar() {
  const { rows, apiRef } = useAuditLogsData(selectToolbarState);
  const filterState = useEntityFilterState(auditLogsFilterStore, rows);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false);
  const searchInput = useDebouncedSearchInput(filterState.searchText, filterState.onSearchTextChange);

  return (
    <>
      <ListToolbar
        showSearch
        searchPlaceholder="Search audit logs"
        searchValue={searchInput.value}
        onSearchChange={searchInput.onChange}
        onSearchSubmit={searchInput.onSubmit}
        showFilters
        onFiltersClick={() => setFiltersDialogOpen(true)}
        secondaryAction={{ label: "Export", icon: <FileDownload /> }}
        apiRef={apiRef}
        sx={{ backgroundColor: "background.paper" }}
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
        fields={AUDIT_LOGS_FILTER_FIELDS}
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
    </>
  );
}
