import { useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import EntityFormDialog from "../../../components/EntityFormDialog";
import { useEntityFilterState } from "../../../hooks/useEntityFilterState";
import { infrastructureFilterStore } from "../hooks/infrastructureFilters";
import {
  columns,
  fields,
  filterInfrastructureByCategory,
  infrastructureStore,
  useInfrastructureData,
} from "../hooks/useInfrastructureData";

export default function InfrastructuresTable() {
  const { selectedId } = useOutletContext();
  const { rows, loading, selectionModel, dialog, saving } = useInfrastructureData();
  const apiRef = useGridApiRef();
  useEffect(() => infrastructureStore.setApiRef(apiRef), [apiRef]);

  // Entity filters/search (see InfrastructuresToolbar, which independently
  // computes the same categoryRows against the shared
  // infrastructureFilterStore) apply on top of whichever left sub-nav
  // category is currently selected.
  const categoryRows = useMemo(
    () => filterInfrastructureByCategory(rows, selectedId),
    [rows, selectedId],
  );
  const { filteredRows } = useEntityFilterState(infrastructureFilterStore, categoryRows);

  return (
    <>
      <DataTable
        ariaLabel="Infrastructure"
        columns={columns}
        rows={filteredRows}
        loading={loading}
        getRowId={(row) => row.id}
        apiRef={apiRef}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={infrastructureStore.setSelectionModel}
        onRowDoubleClick={(params) => infrastructureStore.openEdit(params.row)}
      />
      <EntityFormDialog
        open={Boolean(dialog)}
        mode={dialog?.mode}
        entityLabel="Infrastructure"
        fields={fields}
        initialValues={dialog?.row}
        saving={saving}
        onClose={infrastructureStore.closeDialog}
        onSubmit={infrastructureStore.save}
      />
    </>
  );
}
