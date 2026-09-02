import { useEffect } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import EntityFormDialog from "../../../components/EntityFormDialog";
import { columns, fields, destinationStore, useDestinationData } from "../hooks/useDestinationData";

export default function DestinationsTable() {
  const { rows, loading, selectionModel, dialog, saving } = useDestinationData();
  const apiRef = useGridApiRef();
  useEffect(() => destinationStore.setApiRef(apiRef), [apiRef]);

  return (
    <>
      <DataTable
        ariaLabel="Destinations"
        columns={columns}
        rows={rows}
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
