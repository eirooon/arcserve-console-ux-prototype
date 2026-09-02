import { MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import { ASSESSMENT_FREQUENCY_OPTIONS, AUTONOMY_LEVEL_OPTIONS } from "../configureGoalsAutonomyData";

function GoalFieldSelect({ label, value, options, isOverride, onChange }) {
  return (
    <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="body2" color="text.primary" sx={{ width: 200 }}>
        {label}
      </Typography>
      <TextField
        select
        size="small"
        fullWidth
        value={value}
        onChange={(event) => onChange(event.target.value)}
        helperText={isOverride ? "Override Global Goal Settings" : "Inherit Global Goal Settings"}
        sx={{
          "& .MuiFormHelperText-root": {
            color: isOverride ? "warning.main" : undefined,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}

export default function AgenticGoalCard({ goal, globalSettings, onToggleEnabled, onFieldChange }) {
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
          isOverride={goal.autonomyLevel !== globalSettings.autonomyLevel}
          onChange={(value) => onFieldChange("autonomyLevel", value)}
        />
        <GoalFieldSelect
          label="Assessment Frequency"
          value={goal.assessmentFrequency}
          options={ASSESSMENT_FREQUENCY_OPTIONS}
          isOverride={goal.assessmentFrequency !== globalSettings.assessmentFrequency}
          onChange={(value) => onFieldChange("assessmentFrequency", value)}
        />
      </Stack>
    </Stack>
  );
}
