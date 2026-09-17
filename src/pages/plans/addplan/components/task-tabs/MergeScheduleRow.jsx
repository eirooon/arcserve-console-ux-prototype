import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ScheduleTimeFields from "./ScheduleTimeFields";

/**
 * One row of the "Merge Schedule" section on the "When to Protect" sub-tab
 * (Figma node 7567:9595): the days it runs, a start time, and a delete
 * action — no Schedule Type / Backup Type, unlike a backup schedule row.
 */
export default function MergeScheduleRow({ row, onChange, onRemove, removable }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, flexWrap: "wrap" }}>
        <ScheduleTimeFields row={row} onChange={onChange} />
      </Box>

      <IconButton
        aria-label="Remove merge schedule"
        onClick={onRemove}
        disabled={!removable}
        sx={{ mb: 0.5 }}
      >
        <DeleteRoundedIcon />
      </IconButton>
    </Box>
  );
}

MergeScheduleRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    days: PropTypes.arrayOf(PropTypes.string).isRequired,
    startHour: PropTypes.string.isRequired,
    startMinute: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  removable: PropTypes.bool.isRequired,
};
