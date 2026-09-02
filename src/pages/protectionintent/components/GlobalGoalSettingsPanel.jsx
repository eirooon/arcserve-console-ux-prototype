import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  ASSESSMENT_FREQUENCY_OPTIONS,
  AUTONOMY_LEVEL_OPTIONS,
} from "../configureGoalsAutonomyData";

function GlobalFieldRadioGroup({ label, value, options, onChange }) {
  return (
    <FormControl component="fieldset">
      <FormLabel
        component="legend"
        sx={{ typography: "body2", color: "text.primary", "&.Mui-focused": { color: "text.primary" } }}
      >
        {label}
      </FormLabel>
      <RadioGroup value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio size="small" />}
            label={
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" color="text.primary">
                  {option.label}
                </Typography>
                {option.description && (
                  <Tooltip title={option.description} arrow>
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  </Tooltip>
                )}
              </Stack>
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default function GlobalGoalSettingsPanel({ globalSettings, onFieldChange }) {
  return (
    <Stack spacing={2} sx={{ width: 240, flexShrink: 0 }}>
      <Typography variant="body1" fontWeight={700} color="text.primary">
        Global Goal Settings
      </Typography>

      <GlobalFieldRadioGroup
        label="Autonomy Level"
        value={globalSettings.autonomyLevel}
        options={AUTONOMY_LEVEL_OPTIONS}
        onChange={(value) => onFieldChange("autonomyLevel", value)}
      />

      <GlobalFieldRadioGroup
        label="Assessment Frequency"
        value={globalSettings.assessmentFrequency}
        options={ASSESSMENT_FREQUENCY_OPTIONS}
        onChange={(value) => onFieldChange("assessmentFrequency", value)}
      />
    </Stack>
  );
}
