import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import EntityFiltersDialog from "../../../components/EntityFiltersDialog";
import EntityFilterBar from "../../../components/EntityFilterBar";
import SaveSearchDialog from "../../../components/SaveSearchDialog";
import { getContextLabel } from "../../../routes/subRoutes";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { useDebouncedSearchInput } from "../../../hooks/useDebouncedSearchInput";
import { useEntityFilterState } from "../../../hooks/useEntityFilterState";
import { filterSourcesByCategory, sourceStore, useSourceData } from "../hooks/useSourceData";
import { SOURCES_FILTER_FIELDS, sourcesFilterStore } from "../hooks/sourcesFilters";

const selectSelectionState = (state) => ({
  rows: state.rows,
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

// The "Add Source(s)" split-button menu. `sourceType`, where present, is
// prefilled into the generic add form's Type field (see `fields` in
// useSourceData.jsx) so picking e.g. "Add Windows Source" doesn't leave the
// user to type "udp_windows" themselves. The hypervisor/AD entries open the
// same form blank — this prototype has no bulk-discovery flow behind them.
const ADD_SOURCE_MENU_ITEMS = [
  { label: "Add Source(s) from Hypervisor" },
  { label: "Add Windows Source", sourceType: "udp_windows" },
  { label: "Add Linux Source", sourceType: "udp_linux" },
  { label: "Add Linux Backup Server", sourceType: "udp_linux_backup_server" },
  { label: "Add a UNC or NFS Path", sourceType: "unc_nfs_path" },
  { label: "Discover Source(s) from Active Directory" },
];

// Hoisted to module scope (rather than rebuilt on every render) so their
// object/array identity stays stable — ListToolbar's alignment-check effect
// depends on `extraAction`, and a fresh reference on every render would
// tear down and recreate its ResizeObserver for no reason.
const ADD_MENU_ITEMS = ADD_SOURCE_MENU_ITEMS.map(({ label, sourceType }) => ({
  label,
  onClick: () => sourceStore.openAdd(sourceType ? { source_type: sourceType } : undefined),
}));

const DOWNLOAD_AGENT_ACTION = {
  label: "Download Agent",
  icon: <FileDownloadOutlined />,
  onClick: () => sourceStore.showSnackbar("Downloading agent installer..."),
};

export default function SourcesToolbar() {
  const { selectedId } = useOutletContext();
  const { rows, selectionModel, saving, apiRef } = useSourceData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(sourceStore.deleteSelected);

  const context = getContextLabel(selectedId);

  // Entity filters/search apply on top of whatever the left sub-nav category
  // already narrowed down to, so the Filters modal's dynamic option lists
  // (Site, Organization, etc.) only offer values present in that category —
  // mirrors the same categoryRows computation SourcesTable does internally.
  const categoryRows = filterSourcesByCategory(rows, selectedId);
  const filterState = useEntityFilterState(sourcesFilterStore, categoryRows);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false);
  const searchInput = useDebouncedSearchInput(filterState.searchText, filterState.onSearchTextChange);

  return (
    <>
      <ListToolbar
        addLabel="Add Source(s)"
        addMenuItems={ADD_MENU_ITEMS}
        extraAction={DOWNLOAD_AGENT_ACTION}
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
        fields={SOURCES_FILTER_FIELDS}
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
