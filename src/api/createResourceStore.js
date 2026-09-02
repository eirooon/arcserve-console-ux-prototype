import { useEffect } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import { apiClient } from "./client";

function shallowEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

const identitySelector = (state) => state;

/**
 * A tiny external store (no Context/Provider needed) that gives every
 * sibling component for one CRUD resource (typically a *Toolbar and a
 * *Table) a shared, synchronized view of: the fetched rows, the current
 * grid selection, and any open add/edit dialog — plus the mutation actions
 * (create/update/delete) that talk to the mocked (or real) API.
 *
 * One store instance is created per resource in its hooks/use<Entity>Data
 * file and imported by both the Toolbar and Table components for that page.
 */
export function createResourceStore(endpoint) {
  let state = {
    rows: [],
    loading: true,
    error: null,
    saving: false,
    selectionModel: [],
    dialog: null, // null | { mode: "add" } | { mode: "edit", row }
    // The DataGrid apiRef (see @mui/x-data-grid's useGridApiRef), published
    // once by the Table component so the sibling Toolbar can drive the grid
    // imperatively — e.g. opening the columns panel from its "Edit Columns"
    // button — without any prop-drilling between the two.
    apiRef: null,
  };
  let hasLoaded = false;
  const listeners = new Set();

  function setState(patch) {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  }

  async function load() {
    setState({ loading: true, error: null });
    try {
      const data = await apiClient.get(endpoint);
      setState({ rows: data ?? [], loading: false });
    } catch (error) {
      setState({ error, loading: false });
    }
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return state;
    },
    ensureLoaded() {
      if (hasLoaded) return;
      hasLoaded = true;
      load();
    },
    refetch: load,
    setSelectionModel(selectionModel) {
      setState({ selectionModel });
    },
    setApiRef(apiRef) {
      setState({ apiRef });
    },
    openAdd() {
      setState({ dialog: { mode: "add" } });
    },
    openEdit(row) {
      setState({ dialog: { mode: "edit", row } });
    },
    closeDialog() {
      setState({ dialog: null });
    },
    async save(values) {
      setState({ saving: true });
      try {
        if (state.dialog?.mode === "edit") {
          await apiClient.put(`${endpoint}/${state.dialog.row.id}`, values);
        } else {
          await apiClient.post(endpoint, values);
        }
        setState({ saving: false, dialog: null });
        await load();
      } catch (error) {
        setState({ saving: false, error });
      }
    },
    async deleteSelected() {
      if (state.selectionModel.length === 0) return;
      setState({ saving: true });
      try {
        await Promise.all(
          state.selectionModel.map((id) => apiClient.delete(`${endpoint}/${id}`)),
        );
        setState({ saving: false, selectionModel: [] });
        await load();
      } catch (error) {
        setState({ saving: false, error });
      }
    },
  };
}

/**
 * Subscribes to a resource store. Pass `selector` to read only the slice of
 * state a component actually renders with (e.g. a Toolbar reading just
 * `{ selectionModel, saving }`) — the returned slice is shallow-compared
 * against the previous one so the component only re-renders when the
 * fields it selected actually change, not on every store update.
 */
export function useResourceStore(store, selector = identitySelector) {
  const state = useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    selector,
    shallowEqual,
  );

  useEffect(() => {
    store.ensureLoaded();
  }, [store]);

  return state;
}
