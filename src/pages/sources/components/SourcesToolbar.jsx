import { useOutletContext } from "react-router-dom";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import ListToolbar from "../../../components/ListToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { getContextLabel } from "../../../routes/subRoutes";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { sourceStore, useSourceData } from "../hooks/useSourceData";

const selectSelectionState = (state) => ({
  selectionModel: state.selectionModel,
  saving: state.saving,
  apiRef: state.apiRef,
});

// The "Add Source(s)" split-button menu. `sourceType`, where present, is
// prefilled into the generic add form's Type field (see `fields` in
// useSourceData.jsx) so picking e.g. "Add Windows Source" doesn't leave the
// user to type "udp_windows" themselves. The hypervisor/AD entries open the
// same form blank — this prototype has no bulk-discovery flow behind them.
const ADD_SOURCE_MENU_ITEMS = [
  { label: "Add Source(s) from Hypervisor" },
  { label: "Add Windows Source", sourceType: "udp_windows" },
  { label: "Add Linux Source", sourceType: "udp_linux" },
  { label: "Add Linux Backup Server", sourceType: "udp_linux_backup_server" },
  { label: "Add a UNC or NFS Path", sourceType: "unc_nfs_path" },
  { label: "Discover Source(s) from Active Directory" },
];

// Hoisted to module scope (rather than rebuilt on every render) so their
// object/array identity stays stable — ListToolbar's alignment-check effect
// depends on `extraAction`, and a fresh reference on every render would
// tear down and recreate its ResizeObserver for no reason.
const ADD_MENU_ITEMS = ADD_SOURCE_MENU_ITEMS.map(({ label, sourceType }) => ({
  label,
  onClick: () => sourceStore.openAdd(sourceType ? { source_type: sourceType } : undefined),
}));

const DOWNLOAD_AGENT_ACTION = {
  label: "Download Agent",
  icon: <FileDownloadOutlined />,
  onClick: () => sourceStore.showSnackbar("Downloading agent installer..."),
};

export default function SourcesToolbar() {
  const { selectedId } = useOutletContext();
  const { selectionModel, saving, apiRef } = useSourceData(selectSelectionState);
  const { open: confirmDeleteOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteConfirmation(sourceStore.deleteSelected);

  const context = getContextLabel(selectedId);

  return (
    <>
      <ListToolbar
        addLabel="Add Source(s)"
        addMenuItems={ADD_MENU_ITEMS}
        extraAction={DOWNLOAD_AGENT_ACTION}
        showSearch
        searchPlaceholder={`Search ${context?.toLowerCase()}`}
        showFilters
        selectedCount={selectionModel.length}
        actionItems={[{ label: "Delete", onClick: openConfirm }]}
        apiRef={apiRef}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete selected sources?"
        description={`This will remove ${selectionModel.length} selected source(s). This cannot be undone.`}
        confirmLabel="Delete"
        confirming={saving}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
