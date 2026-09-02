import { useEffect } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import EntityFormDialog from "../../../components/EntityFormDialog";
import { columns, fields, alertRulesStore, useAlertRulesData } from "../hooks/useAlertRulesData";

export default function AlertRulesTable() {
  const { rows, loading, selectionModel, dialog, saving } = useAlertRulesData();
  const apiRef = useGridApiRef();
  useEffect(() => alertRulesStore.setApiRef(apiRef), [apiRef]);

  return (
    <>
      <DataTable
        ariaLabel="Alert rules"
        columns={columns}
        rows={rows}
        loading={loading}
        getRowId={(row) => row.id}
        apiRef={apiRef}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={alertRulesStore.setSelectionModel}
        onRowDoubleClick={(params) => alertRulesStore.openEdit(params.row)}
      />
      <EntityFormDialog
        open={Boolean(dialog)}
        mode={dialog?.mode}
        entityLabel="Alert Rule"
        fields={fields}
        initialValues={dialog?.row}
        saving={saving}
        onClose={alertRulesStore.closeDialog}
        onSubmit={alertRulesStore.save}
      />
    </>
  );
}
