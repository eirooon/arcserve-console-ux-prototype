import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArchitectingShell from "./ArchitectingShell";
import ArchitectingChecklist from "./ArchitectingChecklist";
import { useArchitectingSimulation } from "../../hooks/useArchitectingSimulation";
import { ARCHITECTING_SCENARIOS } from "../../architectingScenarios";
import { PROTECTION_INTENT_OPTIONS } from "../../protectionIntentData";

const BRAND_GRADIENT = "linear-gradient(90deg, #8A2BFF 0%, #00A7E1 100%)";
const ACCENT_COLOR = "#8A2BFF";
const EVIDENCE_ROTATE_MS = 2500;
const OPTION = PROTECTION_INTENT_OPTIONS.find((option) => option.id === "arcgenie-suggest");

export default function ArcGenieSuggestArchitecting() {
  const scenario = ARCHITECTING_SCENARIOS["arcgenie-suggest"];
  const { elapsed, progressRatio, stepStates } = useArchitectingSimulation(scenario);

  const evidenceIndex =
    Math.floor(elapsed / EVIDENCE_ROTATE_MS) % scenario.evidenceTicker.length;

  return (
    <ArchitectingShell
      avatarIcon={OPTION.icon}
      avatarIconColor={OPTION.iconColor}
      avatarBgColor={OPTION.avatarBgColor}
      heading={scenario.heading}
      subheading={scenario.subheading}
      footerNote={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: ACCENT_COLOR,
              flexShrink: 0,
            }}
          />
          <Typography variant="caption" color="text.secondary" noWrap>
            {scenario.evidenceTicker[evidenceIndex]}
          </Typography>
        </Stack>
      }
    >
      <Stack spacing={2.5} sx={{ mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={Math.round(progressRatio * 100)}
          aria-label="Analysis progress"
          sx={{
            height: 6,
            borderRadius: 999,
            bgcolor: alpha(ACCENT_COLOR, 0.12),
            "& .MuiLinearProgress-bar": { background: BRAND_GRADIENT },
          }}
        />
        <ArchitectingChecklist
          steps={stepStates}
          accentColor={ACCENT_COLOR}
          accentBg={alpha(ACCENT_COLOR, 0.08)}
        />
      </Stack>
    </ArchitectingShell>
  );
}
