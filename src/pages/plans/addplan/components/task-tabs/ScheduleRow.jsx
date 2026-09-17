import PropTypes from "prop-types";
import { Box, IconButton, MenuItem, TextField } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import FormField from "../../../../../components/FormField";
import { BACKUP_TYPES, SCHEDULE_TYPES } from "../../data/scheduleOptions";
import ScheduleTimeFields from "./ScheduleTimeFields";

/**
 * One row of the "Backup Schedule" builder on the "When to Protect" sub-tab
 * (Figma node 6480:8342): schedule/backup type, the days it runs, a start
 * time, and a delete action.
 */
export default function ScheduleRow({ row, onChange, onRemove, removable }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, flexWrap: "wrap" }}>
        <FormField label="Schedule Type" sx={{ width: 150 }}>
          <TextField
            select
            fullWidth
            size="small"
            value={row.scheduleType}
            onChange={(event) => onChange({ scheduleType: event.target.value })}
          >
            {SCHEDULE_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </FormField>

        <FormField label="Backup Type" sx={{ width: 150 }}>
          <TextField
            select
            fullWidth
            size="small"
            value={row.backupType}
            onChange={(event) => onChange({ backupType: event.target.value })}
          >
            {BACKUP_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </FormField>

        <ScheduleTimeFields row={row} onChange={onChange} />
      </Box>

      <IconButton
        aria-label="Remove schedule"
        onClick={onRemove}
        disabled={!removable}
        sx={{ mb: 0.5 }}
      >
        <DeleteRoundedIcon />
      </IconButton>
    </Box>
  );
}

ScheduleRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scheduleType: PropTypes.string.isRequired,
    backupType: PropTypes.string.isRequired,
    days: PropTypes.arrayOf(PropTypes.string).isRequired,
    startHour: PropTypes.string.isRequired,
    startMinute: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  removable: PropTypes.bool.isRequired,
};
