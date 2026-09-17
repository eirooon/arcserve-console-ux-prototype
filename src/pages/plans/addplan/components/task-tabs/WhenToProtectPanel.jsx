import PropTypes from "prop-types";
import { Box } from "@mui/material";
import ScheduleAccordion from "./ScheduleAccordion";
import ScheduleRow from "./ScheduleRow";
import MergeScheduleRow from "./MergeScheduleRow";

/**
 * "3. When to Protect" sub-tab (Figma nodes 6478:6498, 7567:9589): a
 * "Backup Schedule" accordion and a "Merge Schedule" accordion, each
 * listing one or more recurring schedule rows with Add/Remove.
 */
export default function WhenToProtectPanel({
  scheduleRows,
  onAddScheduleRow,
  onUpdateScheduleRow,
  onRemoveScheduleRow,
  backupScheduleExpanded,
  onToggleBackupScheduleExpanded,
  mergeScheduleRows,
  onAddMergeScheduleRow,
  onUpdateMergeScheduleRow,
  onRemoveMergeScheduleRow,
  mergeScheduleExpanded,
  onToggleMergeScheduleExpanded,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
      <ScheduleAccordion
        title="Backup Schedule"
        expanded={backupScheduleExpanded}
        onToggleExpand={onToggleBackupScheduleExpanded}
        onAdd={onAddScheduleRow}
      >
        {scheduleRows.map((row) => (
          <ScheduleRow
            key={row.id}
            row={row}
            onChange={(patch) => onUpdateScheduleRow(row.id, patch)}
            onRemove={() => onRemoveScheduleRow(row.id)}
            removable={scheduleRows.length > 1}
          />
        ))}
      </ScheduleAccordion>

      <ScheduleAccordion
        title="Merge Schedule"
        expanded={mergeScheduleExpanded}
        onToggleExpand={onToggleMergeScheduleExpanded}
        onAdd={onAddMergeScheduleRow}
      >
        {mergeScheduleRows.map((row) => (
          <MergeScheduleRow
            key={row.id}
            row={row}
            onChange={(patch) => onUpdateMergeScheduleRow(row.id, patch)}
            onRemove={() => onRemoveMergeScheduleRow(row.id)}
            removable={mergeScheduleRows.length > 1}
          />
        ))}
      </ScheduleAccordion>
    </Box>
  );
}

WhenToProtectPanel.propTypes = {
  scheduleRows: PropTypes.array.isRequired,
  onAddScheduleRow: PropTypes.func.isRequired,
  onUpdateScheduleRow: PropTypes.func.isRequired,
  onRemoveScheduleRow: PropTypes.func.isRequired,
  backupScheduleExpanded: PropTypes.bool.isRequired,
  onToggleBackupScheduleExpanded: PropTypes.func.isRequired,
  mergeScheduleRows: PropTypes.array.isRequired,
  onAddMergeScheduleRow: PropTypes.func.isRequired,
  onUpdateMergeScheduleRow: PropTypes.func.isRequired,
  onRemoveMergeScheduleRow: PropTypes.func.isRequired,
  mergeScheduleExpanded: PropTypes.bool.isRequired,
  onToggleMergeScheduleExpanded: PropTypes.func.isRequired,
};
