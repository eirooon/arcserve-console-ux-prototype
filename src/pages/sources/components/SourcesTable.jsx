import { useCallback, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import EntityFormDialog from "../../../components/EntityFormDialog";
import {
  columns,
  columnVisibilityModel,
  fields,
  filterSourcesByCategory,
  getSourceRowActionGroups,
  sourceStore,
  useSourceData,
} from "../hooks/useSourceData";

export default function SourcesTable() {
  const { selectedId } = useOutletContext();
  const { rows, loading, selectionModel, dialog, saving } = useSourceData();
  const apiRef = useGridApiRef();
  useEffect(() => sourceStore.setApiRef(apiRef), [apiRef]);

  const filteredRows = useMemo(
    () => filterSourcesByCategory(rows, selectedId),
    [rows, selectedId],
  );
  // Stable identity so it doesn't defeat DataTable's effectiveColumns
  // useMemo (which depends on this prop) on every render.
  const rowActionsAriaLabel = useCallback((row) => `Actions for ${row.source_name}`, []);

  return (
    <>
      <DataTable
        ariaLabel="Sources"
        columns={columns}
        rows={filteredRows}
        loading={loading}
        getRowId={(row) => row.id}
        apiRef={apiRef}
        initialState={{ columns: { columnVisibilityModel } }}
        rowActions={getSourceRowActionGroups}
        rowActionsAriaLabel={rowActionsAriaLabel}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={sourceStore.setSelectionModel}
        onRowDoubleClick={(params) => sourceStore.openEdit(params.row)}
      />
      <EntityFormDialog
        open={Boolean(dialog)}
        mode={dialog?.mode}
        entityLabel="Source"
        fields={fields}
        initialValues={dialog?.row}
        saving={saving}
        onClose={sourceStore.closeDialog}
        onSubmit={sourceStore.save}
      />
    </>
  );
}
