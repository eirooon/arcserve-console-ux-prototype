import { buildEmptyFilters } from "./entityFilters";

/**
 * A tiny external store (same shape/reasoning as createResourceStore.js) that
 * gives a list page's sibling Toolbar and Table/Layout components a shared,
 * synchronized view of the ad-hoc filters, saved searches, and free-text
 * search term applied via useEntityFilterState — without needing them to be
 * parent/child. One instance per entity, created once at module scope
 * alongside that entity's resource store (e.g. `sourceStore`) and imported
 * wherever `useEntityFilterState` is called for it.
 */
export function createEntityFilterStore({ fields, searchFields }) {
  const emptyFilters = buildEmptyFilters(fields);
  let state = {
    filters: emptyFilters,
    savedSearches: [],
    activeSavedSearchId: null,
    searchText: "",
  };
  const listeners = new Set();

  function setState(patch) {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  }

  return {
    fields,
    searchFields,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return state;
    },
    setFilters(next) {
      setState({ filters: next, activeSavedSearchId: null });
    },
    removeFilter(key) {
      const field = fields.find((candidate) => candidate.key === key);
      setState({
        filters: { ...state.filters, [key]: field?.type === "multiselect" ? [] : "" },
        activeSavedSearchId: null,
      });
    },
    clearFilters() {
      setState({ filters: emptyFilters, activeSavedSearchId: null });
    },
    selectSavedSearch(id) {
      setState({ activeSavedSearchId: state.activeSavedSearchId === id ? null : id });
    },
    saveSearch(name) {
      const id = crypto.randomUUID();
      setState({
        savedSearches: [...state.savedSearches, { id, name, filters: state.filters }],
        activeSavedSearchId: id,
      });
    },
    setSearchText(searchText) {
      setState({ searchText });
    },
  };
}
