import { useEffect } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import EntityFormDialog from "../../../components/EntityFormDialog";
import { columns, fields, settingsStore, useSettingsData } from "../hooks/useSettingsData";

export default function SettingsTable() {
  const { rows, loading, selectionModel, dialog, saving } = useSettingsData();
  const apiRef = useGridApiRef();
  useEffect(() => settingsStore.setApiRef(apiRef), [apiRef]);

  return (
    <>
      <DataTable
        ariaLabel="Settings"
        columns={columns}
        rows={rows}
        loading={loading}
        getRowId={(row) => row.id}
        apiRef={apiRef}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={settingsStore.setSelectionModel}
        onRowDoubleClick={(params) => settingsStore.openEdit(params.row)}
      />
      <EntityFormDialog
        open={Boolean(dialog)}
        mode={dialog?.mode}
        entityLabel="Setting"
        fields={fields}
        initialValues={dialog?.row}
        saving={saving}
        onClose={settingsStore.closeDialog}
        onSubmit={settingsStore.save}
      />
    </>
  );
}
