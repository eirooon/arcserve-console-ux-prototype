import { Stack, Typography } from "@mui/material";
import AgenticGoalCard from "./AgenticGoalCard";

export default function GoalsAutonomyPanel({ goals, toggleGoalEnabled, setGoalField }) {
  return (
    <Stack spacing={2}>
      <Typography variant="body1" fontWeight={700} color="text.primary">
        Your Agentic Goals
      </Typography>
      <Stack spacing={2}>
        {goals.map((goal) => (
          <AgenticGoalCard
            key={goal.id}
            goal={goal}
            onToggleEnabled={() => toggleGoalEnabled(goal.id)}
            onFieldChange={(field, value) => setGoalField(goal.id, field, value)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
