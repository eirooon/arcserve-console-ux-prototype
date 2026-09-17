import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Chip, Divider, Typography } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DataTable from "../../../../components/DataTable";
import { useSourceData } from "../../../sources/hooks/useSourceData";
import SelectSourcesDialog from "./SelectSourcesDialog";

const selectSourceRows = (state) => ({ rows: state.rows });

const pickedColumns = [
  { field: "source_name", headerName: "Name", flex: 1.5 },
  {
    field: "source_type",
    headerName: "Type",
    flex: 1,
    valueFormatter: (value) => (value ? value.replace(/_/g, " ") : "-"),
  },
  { field: "os_name", headerName: "OS", flex: 1, valueFormatter: (value) => value || "-" },
];

/**
 * "Sources (Optional)" step content (Figma node 6219:3289): an empty state
 * until at least one source is picked via SelectSourcesDialog, after which
 * the picked sources render in a compact, removable table.
 */
export default function SourcesStep({ selectedSourceIds, onSelectionChange }) {
  const { rows: allSources } = useSourceData(selectSourceRows);
  const apiRef = useGridApiRef();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [removalSelection, setRemovalSelection] = useState([]);

  const pickedRows = useMemo(
    () => allSources.filter((source) => selectedSourceIds.includes(source.id)),
    [allSources, selectedSourceIds],
  );

  const handleRemoveSelected = () => {
    const removedSet = new Set(removalSelection);
    onSelectionChange(selectedSourceIds.filter((id) => !removedSet.has(id)));
    setRemovalSelection([]);
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 3,
          px: 3,
          py: 2,
          borderBottom: "1px solid rgba(0,0,0,0.12)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">Selected:</Typography>
          <Chip label={selectedSourceIds.length} size="small" />
        </Box>
        <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
            disabled={removalSelection.length === 0}
            onClick={handleRemoveSelected}
          >
            Remove
          </Button>
          <Button
            variant="contained"
            endIcon={<ChevronRightRoundedIcon />}
            onClick={() => setPickerOpen(true)}
          >
            Sources
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        {pickedRows.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <InventoryOutlinedIcon sx={{ fontSize: 96, color: "action.disabled" }} />
            <Typography variant="body2" color="text.disabled">
              You have not selected any source(s) so far. Click on Select Source(s) to get started!
            </Typography>
          </Box>
        ) : (
          <DataTable
            ariaLabel="Selected sources"
            columns={pickedColumns}
            rows={pickedRows}
            getRowId={(row) => row.id}
            apiRef={apiRef}
            rowSelectionModel={removalSelection}
            onRowSelectionModelChange={setRemovalSelection}
          />
        )}
      </Box>

      <SelectSourcesDialog
        open={pickerOpen}
        initialSelectedIds={selectedSourceIds}
        onClose={() => setPickerOpen(false)}
        onConfirm={(ids) => {
          onSelectionChange(ids);
          setPickerOpen(false);
        }}
      />
    </Box>
  );
}

SourcesStep.propTypes = {
  selectedSourceIds: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};
