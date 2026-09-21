import { useEffect } from "react";
import PropTypes from "prop-types";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import EntityFormDialog from "../../../components/EntityFormDialog";
import { columns, fields, settingsStore, useSettingsData } from "../hooks/useSettingsData";

// `rows` lets SourceGroups hand down the filtered result set (see
// settingsFilters.js) instead of the store's full, unfiltered rows —
// loading, selection, and the dialog still come from the store either way.
export default function SettingsTable({ rows: rowsOverride }) {
  const { rows: storeRows, loading, selectionModel, dialog, saving } = useSettingsData();
  const rows = rowsOverride ?? storeRows;
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

SettingsTable.propTypes = {
  rows: PropTypes.array,
};
