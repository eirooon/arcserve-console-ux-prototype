import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../../components/DataTable";
import { columns, columnVisibilityModel, useSourceData } from "../../../sources/hooks/useSourceData";

const selectSourceRows = (state) => ({ rows: state.rows, loading: state.loading });

/**
 * "Select Source(s)" picker for the Sources step (Figma node 7745:12415).
 * Reuses the real Sources table's column set (see useSourceData.jsx) so the
 * picker looks and behaves exactly like the main Sources page's grid.
 */
export default function SelectSourcesDialog({ open, initialSelectedIds, onClose, onConfirm }) {
  const { rows, loading } = useSourceData(selectSourceRows);
  const apiRef = useGridApiRef();
  const [pendingSelection, setPendingSelection] = useState(initialSelectedIds);

  useEffect(() => {
    if (open) setPendingSelection(initialSelectedIds);
    // Only reset when the dialog opens, not on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Select Source(s)</DialogTitle>
      <DialogContent sx={{ height: 520, display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <DataTable
            ariaLabel="Select sources"
            columns={columns}
            rows={rows}
            loading={loading}
            apiRef={apiRef}
            getRowId={(row) => row.id}
            rowSelectionModel={pendingSelection}
            onRowSelectionModelChange={setPendingSelection}
            initialState={{ columns: { columnVisibilityModel } }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => onConfirm(pendingSelection)}>
          {`Add ${pendingSelection.length ? pendingSelection.length : ""} Source${pendingSelection.length === 1 ? "" : "s"}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SelectSourcesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  initialSelectedIds: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
