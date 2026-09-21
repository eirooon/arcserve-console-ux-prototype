import { useEffect } from "react";
import PropTypes from "prop-types";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import EntityFormDialog from "../../../components/EntityFormDialog";
import { columns, fields, alertRulesStore, useAlertRulesData } from "../hooks/useAlertRulesData";

// `rows` lets AlertRulesLayout hand down the filtered result set (see
// alertRulesFilters.js) instead of the store's full, unfiltered rows —
// loading, selection, and the edit dialog still come from the store either way.
export default function AlertRulesTable({ rows: rowsOverride }) {
  const { rows: storeRows, loading, selectionModel, dialog, saving } = useAlertRulesData();
  const rows = rowsOverride ?? storeRows;
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

AlertRulesTable.propTypes = {
  rows: PropTypes.array,
};
