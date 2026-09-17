export const AUTONOMY_LEVEL_OPTIONS = [
  {
    value: "suggest-only",
    label: "Suggest only",
    description:
      "ArcGenie recommends actions but takes no action automatically.",
  },
  {
    value: "act-after-approval",
    label: "Act after approval",
    description:
      "ArcGenie stages the action and waits for your approval before applying it.",
  },
  {
    value: "act-and-report",
    label: "Act and report",
    description:
      "ArcGenie applies the action automatically and reports what it did.",
  },
];

export const ASSESSMENT_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export const GOALS_STEP_COPY = {
  title: "How would you like to configure your goals and autonomy?",
  description: "Turn on and tailor each goal's autonomy level and assessment frequency.",
};

export const PROTECTION_FITNESS_CHECK_GOAL_ID = "protection-fitness-check";

export const INITIAL_AGENTIC_GOALS = [
  {
    id: "auto-protect",
    category: "Backup Protection",
    shortTitle: "Auto-Protect",
    shortDescription:
      "Finds unprotected sources and assigns the right backup policy.",
    title:
      "Auto-Protect: Continuously discover new sources and auto-assign to appropriate protection categories based on type and business impact. Sources not fitting any category are flagged for review.",
    description:
      "Unprotected sources — including newly discovered hypervisor VMs and agent-based/UNC sources — are found, precisely classified into the correct policy type, assigned, deployed, and given an initial backup trigger; sources move from Unprotected to Protected/Online.",
    enabled: true,
    autonomyLevel: "act-after-approval",
    assessmentFrequency: "daily",
  },
  {
    id: PROTECTION_FITNESS_CHECK_GOAL_ID,
    category: "Backup Protection",
    shortTitle: "Protection Health Check",
    shortDescription:
      "Re-checks protected sources against their tier and recovery-point window.",
    title:
      "Protection Health Check: Verify all sources have an appropriate backup policy and have an RP appropriate to protection intent",
    description:
      "Every previously-protected source is periodically re-evaluated against its current protection-intent tier. The system confirms the assigned policy still matches that tier and that the most recent recovery point falls inside the tier's RPO window. Sources with a mismatched policy, a stale recovery point, or no qualifying recovery point at all are flagged for correction.",
    enabled: true,
    autonomyLevel: "act-and-report",
    assessmentFrequency: "daily",
  },
];

export function getAutonomyLevelLabel(value) {
  return (
    AUTONOMY_LEVEL_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}

export function getAssessmentFrequencyLabel(value) {
  return (
    ASSESSMENT_FREQUENCY_OPTIONS.find((option) => option.value === value)
      ?.label ?? value
  );
}
