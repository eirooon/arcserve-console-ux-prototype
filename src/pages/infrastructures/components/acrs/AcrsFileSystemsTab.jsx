import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Divider, Menu, MenuItem, Stack, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FolderCopyOutlinedIcon from "@mui/icons-material/FolderCopyOutlined";
import { green, blueGrey } from "@mui/material/colors";
import DataTable from "../../../../components/DataTable";
import StatusPill from "../../../../components/StatusPill";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import CreateFileSystemDialog from "./CreateFileSystemDialog";
import { apiClient } from "../../../../api/client";
import { ENDPOINTS } from "../../../../api/endpoints";
import { acrsServersStore } from "../../hooks/useAcrsServersData";
import { useDeleteConfirmation } from "../../../../hooks/useDeleteConfirmation";

const FILE_SYSTEM_STATUS_META = {
  Mounted: { color: green[700], bgcolor: green[50] },
  Unmounted: { color: blueGrey[900], bgcolor: blueGrey[50] },
};

function useFileSystemColumns() {
  return useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 160,
        renderCell: ({ value }) => (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ height: "100%" }}>
            <FolderCopyOutlinedIcon fontSize="small" sx={{ color: "action.active" }} />
            <Typography variant="body2">{value}</Typography>
          </Stack>
        ),
      },
      { field: "pool", headerName: "Pool", flex: 1, minWidth: 120 },
      {
        field: "status",
        headerName: "Status",
        width: 124,
        renderCell: ({ value }) => {
          const meta = FILE_SYSTEM_STATUS_META[value];
          if (!meta) return value ?? "-";
          return (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <StatusPill label={value} bgcolor={meta.bgcolor} color={meta.color} />
            </Box>
          );
        },
      },
      { field: "free", headerName: "Free", width: 100, align: "right", headerAlign: "right" },
      {
        field: "poolUsage",
        headerName: "Pool Usage",
        width: 120,
        align: "right",
        headerAlign: "right",
      },
      { field: "used", headerName: "Used", width: 100, align: "right", headerAlign: "right" },
      {
        field: "recoveryPointServer",
        headerName: "Recovery Point Server",
        flex: 1,
        minWidth: 160,
        valueGetter: (value) => value ?? "-",
      },
      {
        field: "dataStore",
        headerName: "Data Store",
        flex: 1,
        minWidth: 160,
        valueGetter: (value) => value ?? "-",
      },
    ],
    [],
  );
}

export default function AcrsFileSystemsTab({ server }) {
  const rows = useMemo(() => server.fileSystems ?? [], [server.fileSystems]);
  const columns = useFileSystemColumns();

  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [actionsAnchor, setActionsAnchor] = useState(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);

  const persistFileSystems = useCallback(
    async (nextFileSystems) => {
      setSaving(true);
      await apiClient.put(`${ENDPOINTS.ACRS_SERVERS}/${server.id}`, { fileSystems: nextFileSystems });
      await acrsServersStore.refetch();
      setSaving(false);
    },
    [server.id],
  );

  const handleCreate = async (values) => {
    const fileSystem = {
      id: `${server.id}-fs-${Date.now()}`,
      name: values.name,
      pool: values.pool,
      mountAutomatically: values.mountAutomatically,
      status: "Mounted",
      free: "-",
      poolUsage: "-",
      used: "-",
      recoveryPointServer: "-",
      dataStore: "-",
    };
    await persistFileSystems([...rows, fileSystem]);
    acrsServersStore.showSnackbar(
      `You have successfully created the file system ${fileSystem.name} in ${server.displayName}.`,
    );
    setCreating(false);
  };

  const setStatusForIds = useCallback(
    async (ids, status) => {
      const idSet = new Set(ids);
      await persistFileSystems(rows.map((row) => (idSet.has(row.id) ? { ...row, status } : row)));
    },
    [rows, persistFileSystems],
  );

  const deleteFileSystems = useCallback(async () => {
    const idSet = new Set(pendingDeleteIds);
    await persistFileSystems(rows.filter((row) => !idSet.has(row.id)));
    setSelectionModel((current) => current.filter((id) => !idSet.has(id)));
  }, [pendingDeleteIds, rows, persistFileSystems]);

  const { open: deleteConfirmOpen, openConfirm: openDeleteConfirm, closeConfirm: closeDeleteConfirm, confirmDelete } =
    useDeleteConfirmation(deleteFileSystems);

  const requestDelete = useCallback(
    (ids) => {
      setPendingDeleteIds(ids);
      openDeleteConfirm();
    },
    [openDeleteConfirm],
  );

  const rowActions = useCallback(
    (row) => [
      {
        items: [
          { label: "Mount", onClick: () => setStatusForIds([row.id], "Mounted") },
          { label: "Unmount", onClick: () => setStatusForIds([row.id], "Unmounted") },
          { label: "Delete", onClick: () => requestDelete([row.id]) },
        ],
      },
    ],
    [setStatusForIds, requestDelete],
  );

  const handleBulkAction = (status) => {
    setActionsAnchor(null);
    if (status === "delete") {
      requestDelete(selectionModel);
      return;
    }
    setStatusForIds(selectionModel, status);
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography fontSize={14} color="text.secondary">
            {selectionModel.length} selected
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            endIcon={<ArrowDropDownIcon />}
            disabled={selectionModel.length === 0}
            aria-haspopup="true"
            aria-expanded={actionsAnchor ? "true" : undefined}
            onClick={(event) => setActionsAnchor(event.currentTarget)}
          >
            Actions
          </Button>
          <Menu
            anchorEl={actionsAnchor}
            open={Boolean(actionsAnchor)}
            onClose={() => setActionsAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => handleBulkAction("Mounted")}>Mount</MenuItem>
            <MenuItem onClick={() => handleBulkAction("Unmounted")}>Unmount</MenuItem>
            <MenuItem onClick={() => handleBulkAction("delete")}>Delete</MenuItem>
          </Menu>
        </Stack>
        <Divider orientation="vertical" flexItem sx={{ my: 0.5, mx: 2 }} />
        <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => setCreating(true)}>
          Create File System
        </Button>
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataTable
          ariaLabel={`File systems for ${server.displayName}`}
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          loading={saving}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={setSelectionModel}
          rowActions={rowActions}
          rowActionsAriaLabel={(row) => `Actions for ${row.name}`}
          slots={{
            noRowsOverlay: () => (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No file system available.
              </Typography>
            ),
          }}
        />
      </Box>

      <CreateFileSystemDialog
        open={creating}
        saving={saving}
        onClose={() => setCreating(false)}
        onSubmit={handleCreate}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title={pendingDeleteIds.length > 1 ? "Delete these file systems?" : "Delete this file system?"}
        description={`This will remove ${pendingDeleteIds.length} selected file system(s). This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}

AcrsFileSystemsTab.propTypes = {
  server: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    fileSystems: PropTypes.array,
  }).isRequired,
};
