import { Stack, Typography } from "@mui/material";
import AgenticGoalCard from "./AgenticGoalCard";
import GlobalGoalSettingsPanel from "./GlobalGoalSettingsPanel";

export default function GoalsAutonomyPanel({
  goals,
  toggleGoalEnabled,
  setGoalField,
  globalSettings,
  setGlobalField,
}) {
  return (
    <Stack direction="row" spacing={3} alignItems="flex-start">
      <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Your Agentic Goals
        </Typography>
        <Stack spacing={2} sx={{ width: "100%" }}>
          {goals.map((goal) => (
            <AgenticGoalCard
              key={goal.id}
              goal={goal}
              globalSettings={globalSettings}
              onToggleEnabled={() => toggleGoalEnabled(goal.id)}
              onFieldChange={(field, value) => setGoalField(goal.id, field, value)}
            />
          ))}
        </Stack>
      </Stack>

      <GlobalGoalSettingsPanel globalSettings={globalSettings} onFieldChange={setGlobalField} />
    </Stack>
  );
}
