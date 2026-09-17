import { MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import FormField from "../../../components/FormField";
import { ASSESSMENT_FREQUENCY_OPTIONS, AUTONOMY_LEVEL_OPTIONS } from "../configureGoalsAutonomyData";

function GoalFieldSelect({ label, value, options, disabled, onChange }) {
  return (
    <FormField label={label} sx={{ flex: 1, minWidth: 0 }}>
      <TextField
        select
        size="small"
        fullWidth
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </FormField>
  );
}

export default function AgenticGoalCard({ goal, onToggleEnabled, onFieldChange }) {
  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        p: "20px",
        border: 1,
        borderColor: "divider",
        borderRadius: "8px",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: "uppercase" }}
      >
        {goal.category}
      </Typography>

      <Stack direction="row" spacing={3} alignItems="flex-start">
        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" fontWeight={700} color="text.primary">
            {goal.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {goal.description}
          </Typography>
        </Stack>
        <Switch
          checked={goal.enabled}
          onChange={onToggleEnabled}
          aria-label={`Toggle ${goal.title}`}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <GoalFieldSelect
          label="Autonomy Level"
          value={goal.autonomyLevel}
          options={AUTONOMY_LEVEL_OPTIONS}
          disabled={!goal.enabled}
          onChange={(value) => onFieldChange("autonomyLevel", value)}
        />
        <GoalFieldSelect
          label="Assessment Frequency"
          value={goal.assessmentFrequency}
          options={ASSESSMENT_FREQUENCY_OPTIONS}
          disabled={!goal.enabled}
          onChange={(value) => onFieldChange("assessmentFrequency", value)}
        />
      </Stack>
    </Stack>
  );
}
