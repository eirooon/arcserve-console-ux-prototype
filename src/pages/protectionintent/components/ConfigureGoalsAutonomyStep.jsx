import { Box, Button, Stack, Typography } from "@mui/material";
import GoalsAutonomyPanel from "./GoalsAutonomyPanel";
import { GOALS_STEP_COPY } from "../configureGoalsAutonomyData";

export default function ConfigureGoalsAutonomyStep({
  onCancel,
  onPrevious,
  onNext,
  nextStepLabel,
  goals,
  toggleGoalEnabled,
  setGoalField,
  globalSettings,
  setGlobalField,
}) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          {GOALS_STEP_COPY.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {GOALS_STEP_COPY.description}
        </Typography>
      </Box>

      <GoalsAutonomyPanel
        goals={goals}
        toggleGoalEnabled={toggleGoalEnabled}
        setGoalField={setGoalField}
        globalSettings={globalSettings}
        setGlobalField={setGlobalField}
      />

      <Stack direction="row" justifyContent="space-between">
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="secondary" onClick={onPrevious}>
            Previous
          </Button>
          <Button variant="contained" onClick={onNext}>
            {nextStepLabel ? `Next: ${nextStepLabel}` : "Next"}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
