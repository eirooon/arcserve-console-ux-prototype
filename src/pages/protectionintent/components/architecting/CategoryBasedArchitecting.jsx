import { Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { amber } from "@mui/material/colors";
import ArchitectingShell from "./ArchitectingShell";
import ArchitectingChecklist from "./ArchitectingChecklist";
import CategoryStatCard from "./CategoryStatCard";
import { useArchitectingSimulation } from "../../hooks/useArchitectingSimulation";
import { ARCHITECTING_SCENARIOS } from "../../architectingScenarios";
import { PROTECTION_INTENT_OPTIONS } from "../../protectionIntentData";

const ACCENT_COLOR = amber[800];
const OPTION = PROTECTION_INTENT_OPTIONS.find((option) => option.id === "category-based");

export default function CategoryBasedArchitecting() {
  const scenario = ARCHITECTING_SCENARIOS["category-based"];
  const { stepStates } = useArchitectingSimulation(scenario);

  const { "mission-critical": missionCritical, "business-essential": businessEssential, standard } =
    scenario.categoryTargets;
  const assigningStep = stepStates.find((step) => step.id === "assigning");
  const assignedCount = assigningStep?.count ?? 0;

  const missionCriticalCount = Math.min(missionCritical.target, assignedCount);
  const businessEssentialCount = Math.min(
    businessEssential.target,
    Math.max(0, assignedCount - missionCritical.target),
  );
  const standardCount = Math.min(
    standard.target,
    Math.max(0, assignedCount - missionCritical.target - businessEssential.target),
  );

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
        <Stack direction="row" spacing={2}>
          <CategoryStatCard
            label={missionCritical.label}
            count={missionCriticalCount}
            target={missionCritical.target}
            done={missionCriticalCount >= missionCritical.target}
            accentColor={ACCENT_COLOR}
          />
          <CategoryStatCard
            label={businessEssential.label}
            count={businessEssentialCount}
            target={businessEssential.target}
            done={businessEssentialCount >= businessEssential.target}
            accentColor={ACCENT_COLOR}
          />
          <CategoryStatCard
            label={standard.label}
            count={standardCount}
            target={standard.target}
            done={standardCount >= standard.target}
            accentColor={ACCENT_COLOR}
          />
        </Stack>
        <ArchitectingChecklist
          steps={stepStates}
          accentColor={ACCENT_COLOR}
          accentBg={alpha(ACCENT_COLOR, 0.1)}
        />
      </Stack>
    </ArchitectingShell>
  );
}
