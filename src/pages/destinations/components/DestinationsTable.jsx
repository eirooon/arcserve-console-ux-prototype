import { useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import EntityFormDialog from "../../../components/EntityFormDialog";
import { useEntityFilterState } from "../../../hooks/useEntityFilterState";
import {
  columns,
  fields,
  destinationStore,
  filterDestinationsByCategory,
  useDestinationData,
} from "../hooks/useDestinationData";
import { destinationsFilterStore } from "../hooks/destinationsFilters";

export default function DestinationsTable() {
  const { selectedId } = useOutletContext();
  const { rows, loading, selectionModel, dialog, saving } = useDestinationData();
  const apiRef = useGridApiRef();
  useEffect(() => destinationStore.setApiRef(apiRef), [apiRef]);

  const categoryRows = useMemo(
    () => filterDestinationsByCategory(rows, selectedId),
    [rows, selectedId],
  );
  const { filteredRows } = useEntityFilterState(destinationsFilterStore, categoryRows);

  return (
    <>
      <DataTable
        ariaLabel="Destinations"
        columns={columns}
        rows={filteredRows}
        loading={loading}
        getRowId={(row) => row.id}
        apiRef={apiRef}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={destinationStore.setSelectionModel}
        onRowDoubleClick={(params) => destinationStore.openEdit(params.row)}
      />
      <EntityFormDialog
        open={Boolean(dialog)}
        mode={dialog?.mode}
        entityLabel="Destination"
        fields={fields}
        initialValues={dialog?.row}
        saving={saving}
        onClose={destinationStore.closeDialog}
        onSubmit={destinationStore.save}
      />
    </>
  );
}
