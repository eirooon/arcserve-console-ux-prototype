import { Stack, Typography } from "@mui/material";
import {
  getGoalAutonomyInheritanceLabel,
  getGoalFrequencyInheritanceLabel,
} from "../configureGoalsAutonomyData";

export default function ReviewGoalSummaryCard({ goal, globalSettings }) {
  return (
    <Stack
      spacing={1.5}
      sx={{ p: "20px", border: 1, borderColor: "divider", borderRadius: "8px" }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>
        {goal.category}
      </Typography>
      <Stack spacing={0.5}>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          {goal.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {goal.description}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.primary">
        {getGoalAutonomyInheritanceLabel(goal, globalSettings)} &bull;{" "}
        {getGoalFrequencyInheritanceLabel(goal, globalSettings)}
      </Typography>
    </Stack>
  );
}
