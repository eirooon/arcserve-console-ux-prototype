import PropTypes from "prop-types";
import { Box, MenuItem, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import FormField from "../../../../../components/FormField";
import { START_HOURS, START_MINUTES, WEEK_DAYS } from "../../data/scheduleOptions";

/**
 * "Run Schedule Days" + "Start Time" fields shared by a backup schedule row
 * (ScheduleRow) and a merge schedule row (MergeScheduleRow) — the only
 * difference between the two is whether Schedule Type / Backup Type selects
 * are shown alongside this.
 */
export default function ScheduleTimeFields({ row, onChange }) {
  return (
    <>
      <FormField label="Run Schedule Days">
        <ToggleButtonGroup
          value={row.days}
          onChange={(_, days) => onChange({ days })}
          aria-label="Run schedule days"
          size="small"
          color="primary"
          sx={{
            "& .MuiToggleButton-root.Mui-selected": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.dark" },
            },
          }}
        >
          {WEEK_DAYS.map((day) => (
            <ToggleButton key={day} value={day} aria-label={day}>
              {day}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormField>

      <FormField label="Start Time">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            select
            size="small"
            sx={{ width: 90 }}
            value={row.startHour}
            onChange={(event) => onChange({ startHour: event.target.value })}
          >
            {START_HOURS.map((hour) => (
              <MenuItem key={hour} value={hour}>
                {hour}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2">:</Typography>
          <TextField
            select
            size="small"
            sx={{ width: 90 }}
            value={row.startMinute}
            onChange={(event) => onChange({ startMinute: event.target.value })}
          >
            {START_MINUTES.map((minute) => (
              <MenuItem key={minute} value={minute}>
                {minute}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </FormField>
    </>
  );
}

ScheduleTimeFields.propTypes = {
  row: PropTypes.shape({
    days: PropTypes.arrayOf(PropTypes.string).isRequired,
    startHour: PropTypes.string.isRequired,
    startMinute: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
