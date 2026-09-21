import { useMemo, useSyncExternalStore } from "react";
import { applyEntityFilters, applySearchText, getEntityFilterChips } from "../utils/entityFilters";

/**
 * Subscribes to an entity's filter store (see createEntityFilterStore.js)
 * and computes the derived state a page's Toolbar/FilterBar/Table need: the
 * filtered rows, the removable-chip descriptors, and every handler an
 * <EntityFilterBar>/<EntityFiltersDialog>/<SaveSearchDialog> trio expects.
 * `rows` is the entity's own (unfiltered) resource-store rows — first built
 * for the Jobs page, now shared by every list page using the same
 * filter/search flow.
 */
export function useEntityFilterState(store, rows) {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const { filters, savedSearches, activeSavedSearchId, searchText } = state;

  const activeSavedSearch = savedSearches.find((search) => search.id === activeSavedSearchId);
  const activeFilters = activeSavedSearch ? activeSavedSearch.filters : filters;

  const filteredRows = useMemo(
    () => applySearchText(applyEntityFilters(rows, activeFilters, store.fields), searchText, store.searchFields),
    [rows, activeFilters, searchText, store],
  );

  const filterChips = useMemo(
    () => getEntityFilterChips(filters, store.fields, rows),
    [filters, rows, store],
  );

  return {
    filters,
    filterChips,
    savedSearches,
    activeSavedSearchId,
    searchText,
    filteredRows,
    resultCount: filteredRows.length,
    onApplyFilters: store.setFilters,
    onRemoveFilter: store.removeFilter,
    onClearFilters: store.clearFilters,
    onSelectSavedSearch: store.selectSavedSearch,
    onSaveSearch: store.saveSearch,
    onSearchTextChange: store.setSearchText,
  };
}
