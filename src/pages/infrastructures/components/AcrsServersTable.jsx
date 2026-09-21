import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import AcrsServerFormDialog from "./acrs/AcrsServerFormDialog";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { buildSampleNetworkInterfaces } from "../../../mocks/data/acrsServers";
import {
  acrsServersStore,
  useAcrsServersColumns,
  useAcrsServersData,
  useAcrsServersRowActions,
} from "../hooks/useAcrsServersData";

const selectTableState = (state) => ({
  rows: state.rows,
  loading: state.loading,
  selectionModel: state.selectionModel,
  dialog: state.dialog,
  saving: state.saving,
});

// `rows` lets AcrsServers hand down the filtered result set (see
// acrsServersFilters.js) instead of the store's full, unfiltered rows —
// loading and selection still come from the store either way.
export default function AcrsServersTable({ rows: rowsOverride }) {
  const navigate = useNavigate();
  const { rows: storeRows, loading, selectionModel, dialog, saving } = useAcrsServersData(selectTableState);
  const rows = rowsOverride ?? storeRows;
  const apiRef = useGridApiRef();
  useEffect(() => acrsServersStore.setApiRef(apiRef), [apiRef]);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const columns = useAcrsServersColumns(navigate);
  const rowActions = useAcrsServersRowActions(navigate, {
    onModify: (row) => acrsServersStore.openEdit(row),
    onDelete: (row) => setDeleteTarget(row),
  });

  const handleSave = async (values) => {
    if (dialog?.mode === "edit") return acrsServersStore.save(values);
    const newServerId = `acrs-server-${Date.now()}`;
    const result = await acrsServersStore.save({
      ...values,
      status: "Pending",
      storageUsedGb: 0,
      storageTotalGb: 0,
      createdDate: new Date().toISOString(),
      fileSystems: [],
      // New servers ship with the same example adapters as every other ACRS
      // server (see buildSampleNetworkInterfaces), but since the device was
      // just added, none of them are connected or configured yet — only the
      // read-only hostname/MAC are filled in.
      networkInterfaces: buildSampleNetworkInterfaces(newServerId, 40 + (Date.now() % 200), {
        allDisconnected: true,
        unconfigured: true,
      }),
    });
    if (result) {
      acrsServersStore.showSnackbar(`"${values.displayName}" was added successfully.`);
    }
    return result;
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await apiClient.delete(`${ENDPOINTS.ACRS_SERVERS}/${deleteTarget.id}`);
    await acrsServersStore.refetch();
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <>
      <DataTable
        ariaLabel="Arcserve Cyber Resilient Servers"
        columns={columns}
        rows={rows}
        loading={loading}
        getRowId={(row) => row.id}
        apiRef={apiRef}
        rowActions={rowActions}
        rowActionsAriaLabel={(row) => `Actions for ${row.displayName}`}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={acrsServersStore.setSelectionModel}
        onRowDoubleClick={(params) =>
          navigate(`/infrastructures/arcserve-cyber-resilient-servers/${params.row.id}`)
        }
      />
      <AcrsServerFormDialog
        open={Boolean(dialog)}
        mode={dialog?.mode}
        initialValues={dialog?.row}
        saving={saving}
        onClose={acrsServersStore.closeDialog}
        onSubmit={handleSave}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this server?"
        description={`This will remove "${deleteTarget?.displayName ?? ""}". This cannot be undone.`}
        confirmLabel="Delete"
        confirming={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

AcrsServersTable.propTypes = {
  rows: PropTypes.array,
};
