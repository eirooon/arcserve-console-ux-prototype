import { useEffect } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import EntityFormDialog from "../../../components/EntityFormDialog";
import { columns, fields, infrastructureStore, useInfrastructureData } from "../hooks/useInfrastructureData";

export default function InfrastructuresTable() {
  const { rows, loading, selectionModel, dialog, saving } = useInfrastructureData();
  const apiRef = useGridApiRef();
  useEffect(() => infrastructureStore.setApiRef(apiRef), [apiRef]);

  return (
    <>
      <DataTable
        ariaLabel="Infrastructure"
        columns={columns}
        rows={rows}
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
