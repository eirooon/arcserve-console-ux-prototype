import { useEffect } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import EntityFormDialog from "../../../components/EntityFormDialog";
import { columns, fields, plansStore, usePlansData } from "../hooks/usePlansData";

export default function PlansTable() {
  const { rows, loading, selectionModel, dialog, saving } = usePlansData();
  const apiRef = useGridApiRef();
  useEffect(() => plansStore.setApiRef(apiRef), [apiRef]);

  return (
    <>
      <DataTable
        ariaLabel="Plans"
        columns={columns}
        rows={rows}
        loading={loading}
        getRowId={(row) => row.id}
        apiRef={apiRef}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={plansStore.setSelectionModel}
        onRowDoubleClick={(params) => plansStore.openEdit(params.row)}
      />
      <EntityFormDialog
        open={Boolean(dialog)}
        mode={dialog?.mode}
        entityLabel="Plan"
        fields={fields}
        initialValues={dialog?.row}
        saving={saving}
        onClose={plansStore.closeDialog}
        onSubmit={plansStore.save}
      />
    </>
  );
}
