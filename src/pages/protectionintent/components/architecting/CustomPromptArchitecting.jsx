import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArchitectingShell from "./ArchitectingShell";
import ArchitectingChecklist from "./ArchitectingChecklist";
import { useArchitectingSimulation } from "../../hooks/useArchitectingSimulation";
import { ARCHITECTING_SCENARIOS } from "../../architectingScenarios";
import { CUSTOM_PROMPT_COPY, PROTECTION_INTENT_OPTIONS } from "../../protectionIntentData";

const PROGRESS_COLOR = "#8A2BFF";
const PROGRESS_GRADIENT = "linear-gradient(90deg, #8A2BFF 0%, #00A7E1 100%)";
const OPTION = PROTECTION_INTENT_OPTIONS.find((option) => option.id === "custom-prompt");

export default function CustomPromptArchitecting({ promptText }) {
  const scenario = ARCHITECTING_SCENARIOS["custom-prompt"];
  const { progressRatio, stepStates } = useArchitectingSimulation(scenario);

  return (
    <ArchitectingShell
      avatarIcon={OPTION.icon}
      avatarIconColor={OPTION.iconColor}
      avatarBgColor={OPTION.avatarBgColor}
      heading={scenario.heading}
      subheading={scenario.subheading}
      footerNote={
        <Typography variant="caption" color="text.secondary">
          {scenario.footerNote}
        </Typography>
      }
    >
      <Stack spacing={2.5} sx={{ mb: 1 }}>
        <Box
          sx={{
            borderLeft: "3px solid",
            borderColor: alpha(PROGRESS_COLOR, 0.4),
            pl: 2,
            py: 0.5,
          }}
        >
          <Typography variant="overline" color="text.secondary">
            Your Prompt
          </Typography>
          <Typography variant="body2" fontStyle="italic" color="text.primary">
            “{promptText || CUSTOM_PROMPT_COPY.placeholder}”
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.round(progressRatio * 100)}
          aria-label="Interpretation progress"
          sx={{
            height: 6,
            borderRadius: 999,
            bgcolor: alpha(PROGRESS_COLOR, 0.12),
            "& .MuiLinearProgress-bar": { background: PROGRESS_GRADIENT },
          }}
        />

        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            Understood As
          </Typography>
          <ArchitectingChecklist
            steps={stepStates}
            accentColor={PROGRESS_COLOR}
            accentBg={alpha(PROGRESS_COLOR, 0.08)}
          />
        </Stack>
      </Stack>
    </ArchitectingShell>
  );
}
