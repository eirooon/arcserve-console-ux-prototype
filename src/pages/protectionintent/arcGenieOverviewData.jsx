import GppGoodRoundedIcon from "@mui/icons-material/GppGoodRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import RemoveModeratorRoundedIcon from "@mui/icons-material/RemoveModeratorRounded";
import { green, blue, red, orange, grey, purple, deepPurple } from "@mui/material/colors";
import { PROTECTION_FITNESS_CHECK_GOAL_ID } from "./configureGoalsAutonomyData";
import { sources } from "../../mocks/data/sources";

export const AUTO_PROTECT_GOAL_ID = "auto-protect";

export const AUTO_PROTECT_STAT_FIELDS = [
  {
    key: "protected",
    label: "Protected",
    icon: GppGoodRoundedIcon,
    color: green[700],
    bgColor: green[50],
  },
  {
    key: "pendingClassification",
    label: "Pending Classification",
    icon: AccessTimeRoundedIcon,
    color: blue[700],
    bgColor: blue[50],
  },
  {
    key: "assignmentFailed",
    label: "Assignment Failed",
    icon: ErrorOutlineRoundedIcon,
    color: red[700],
    bgColor: red[50],
  },
  {
    key: "unprotected",
    label: "Unprotected",
    icon: RemoveModeratorRoundedIcon,
    color: grey[600],
    bgColor: grey[100],
  },
];

// Cycled across sources so the Auto-Protect goal detail table shows a mix
// of plans rather than the same one on every pending/failed row.
const AUTO_PROTECT_PLAN_CYCLE = ["Mission-Critical", "Standard", "Business-Essential"];

// Auto-Protect assignment workflow state, derived by position rather than a
// fixed id lookup so it stays in sync with whatever records happen to be in
// ../../mocks/data/sources.js (a live dev-environment API snapshot that can
// be regenerated with different ids, and isn't necessarily a multiple of
// 10 — see AUTO_PROTECT_STATUS_COUNTS below, which derives every other
// protected/pending/failed/unprotected count from this instead of a second,
// independently-hardcoded split that could drift out of sync with it).
function getAutoProtectWorkflow(index) {
  const plan = AUTO_PROTECT_PLAN_CYCLE[index % AUTO_PROTECT_PLAN_CYCLE.length];

  if (index < 10) {
    return { status: "protected", currentPlan: plan, proposedPlan: "-", actionLabel: "View Plan" };
  }
  if (index < 20) {
    return { status: "pending-classification", currentPlan: "No Plan", proposedPlan: plan, actionLabel: "Apply" };
  }
  if (index < 30) {
    return {
      status: "assignment-failed",
      currentPlan: "No Plan",
      proposedPlan: "No matching rule",
      actionLabel: "Assign",
    };
  }
  return { status: "unprotected", currentPlan: "No Plan", proposedPlan: plan, actionLabel: "Apply" };
}

// Table rows backing the Auto-Protect goal detail page, built from the same
// mock sources shown on the Sources page instead of a separate fake list.
export const AUTO_PROTECT_SOURCES = sources.map((source, index) => ({
  id: source.id,
  sourceName: source.source_name,
  sourceType: source.source_type,
  ...getAutoProtectWorkflow(index),
}));

const STATUS_TO_STAT_KEY = {
  protected: "protected",
  "pending-classification": "pendingClassification",
  "assignment-failed": "assignmentFailed",
  unprotected: "unprotected",
};

// Counted straight from AUTO_PROTECT_SOURCES (rather than a hand-maintained
// split) so the overview stat tiles/status bar always agree with what the
// goal detail table actually shows, however many sources mocks/data/
// sources.js happens to contain.
const AUTO_PROTECT_STATUS_COUNTS = AUTO_PROTECT_SOURCES.reduce(
  (counts, source) => {
    const key = STATUS_TO_STAT_KEY[source.status];
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  },
  { protected: 0, pendingClassification: 0, assignmentFailed: 0, unprotected: 0 },
);

// Per-goal source counts, keyed by AUTO_PROTECT_STAT_FIELDS[].key.
export const GOAL_STATS_BY_ID = {
  [AUTO_PROTECT_GOAL_ID]: AUTO_PROTECT_STATUS_COUNTS,
};

export function getGoalStats(goalId) {
  return (
    GOAL_STATS_BY_ID[goalId] ?? {
      protected: 0,
      pendingClassification: 0,
      assignmentFailed: 0,
      unprotected: 0,
    }
  );
}

// Sources currently in scope of the active goals, for the overview header copy.
export const OVERVIEW_SUMMARY = {
  activeGoalCount: 2,
  totalSources: sources.length,
};

export const ASSESSMENT_TIME_LABEL = "9:00 AM";
export const NEXT_ASSESSMENT_LABEL = "Next assessment tomorrow, 9:00 AM";

// Segment breakdown + color shown on each goal's status bar on the overview page.
export const GOAL_OVERVIEW_SEGMENTS_BY_ID = {
  [AUTO_PROTECT_GOAL_ID]: [
    { key: "protected", label: "protected", value: AUTO_PROTECT_STATUS_COUNTS.protected, color: green[400] },
    {
      key: "pendingClassification",
      label: "pending",
      value: AUTO_PROTECT_STATUS_COUNTS.pendingClassification,
      color: blue[300],
    },
    {
      key: "assignmentFailed",
      label: "failed",
      value: AUTO_PROTECT_STATUS_COUNTS.assignmentFailed,
      color: red[300],
    },
  ],
  [PROTECTION_FITNESS_CHECK_GOAL_ID]: [
    { key: "inWindow", label: "in window", value: 412, color: green[400] },
    { key: "staleRP", label: "stale RP", value: 43, color: orange[300] },
    { key: "tierMismatch", label: "tier mismatch", value: 24, color: grey[400] },
  ],
};

// Status labels that don't reflect a live waiting count (e.g. a goal that
// only ever reports its own health rather than blocking on a decision).
const STATIC_GOAL_STATUS_LABEL_BY_ID = {
  [PROTECTION_FITNESS_CHECK_GOAL_ID]: "Healthy",
};

// Soft (tonal) pill colors for goal status chips, keyed by status tone.
const GOAL_STATUS_CHIP_TONES = {
  waiting: { bgcolor: purple[50], color: purple[600] },
  onTrack: { bgcolor: green[50], color: green[800] },
};

export function getWaitingCount(goalId) {
  const stats = getGoalStats(goalId);
  return (stats.pendingClassification ?? 0) + (stats.assignmentFailed ?? 0);
}

export function getGoalStatusChip(goalId) {
  const staticLabel = STATIC_GOAL_STATUS_LABEL_BY_ID[goalId];
  if (staticLabel) return { label: staticLabel, ...GOAL_STATUS_CHIP_TONES.onTrack };

  const waiting = getWaitingCount(goalId);
  return waiting > 0
    ? { label: `${waiting} waiting`, ...GOAL_STATUS_CHIP_TONES.waiting }
    : { label: "Healthy", ...GOAL_STATUS_CHIP_TONES.onTrack };
}

export const NEEDS_ATTENTION_ITEMS = [
  {
    id: "approval-required-1",
    goalId: AUTO_PROTECT_GOAL_ID,
    category: "Backup Protection",
    title: "New source found",
    timestamp: "Just now",
    description:
      "Mission-Critical is the only plan that fits this node. Approve to assign it, deploy the agent, and start the first backup.",
    source: "sample_machine_01",
    sourceType: "Windows (Agent)",
    currentPlan: "No plan",
    currentDetail: "no recovery points",
    proposedPlan: "Mission-Critical",
    proposedDetail: "hourly · 30d retention",
    proposedColor: deepPurple[600],
    footerNote: "First backup completes in ~40 min",
    primaryActionLabel: "Approve",
    primaryActionKey: "approve",
  },
  {
    id: "assignment-failed-1",
    goalId: AUTO_PROTECT_GOAL_ID,
    category: "Backup Protection",
    title: "No policy matches this source",
    timestamp: "1 hour ago",
    description:
      "No intent rule covers Oracle DB in Dev/Test, so the agent stopped rather than guess. Assign a plan now, or add a rule and it'll retry automatically.",
    source: "sample_machine_02",
    sourceType: "Agentless VM · Oracle DB",
    currentPlan: "No plan",
    currentDetail: "no recovery points",
    proposedPlan: "Waiting on you",
    proposedDetail: "agent cannot resolve this",
    proposedColor: red[500],
    footerNote: "Unprotected for 1h 12m",
    primaryActionLabel: "Assign Manually",
    primaryActionKey: "assign",
    secondaryActionLabel: "Review",
    secondaryActionKey: "review",
  },
];

export const WAITING_ON_YOU_OLDEST_SINCE_LABEL = "1 hour ago";

export const ACTIVITY_LOG_ITEMS = [
  {
    id: "activity-5",
    message: "sample_machine_05 was assigned to the Mission-Critical plan.",
    approvedBy: "Sam",
    date: "Aug-17-2026 03:45 PM",
  },
  {
    id: "activity-4",
    message: "sample_machine_04 was assigned to the Standard plan.",
    approvedBy: "Elena",
    date: "Aug-16-2026 02:00 PM",
  },
  {
    id: "activity-3",
    message: "sample_machine_03 was assigned to the Standard plan.",
    approvedBy: "Priya",
    date: "Aug-15-2026 12:30 PM",
  },
  {
    id: "activity-2",
    message: "sample_machine_02 was assigned to the Standard plan.",
    approvedBy: "Jordan",
    date: "Aug-14-2026 11:00 AM",
  },
  {
    id: "activity-1",
    message: "sample_machine_01 was assigned to the Mission-Critical plan.",
    approvedBy: "Alexey",
    date: "Aug-13-2026 10:00 AM",
  },
];

export const SOURCE_STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "protected", label: "Protected" },
  { value: "pending-classification", label: "Pending Classification" },
  { value: "assignment-failed", label: "Assignment Failed" },
  { value: "unprotected", label: "Unprotected" },
];

// Tonal colors mirror AUTO_PROTECT_STAT_FIELDS above, so the Status column
// reads as the same "avatar" style as the stat tiles.
export const SOURCE_STATUS_META = {
  protected: { label: "Protected", color: green[700], bgColor: green[50] },
  "pending-classification": {
    label: "Pending Classification",
    color: blue[700],
    bgColor: blue[50],
  },
  "assignment-failed": { label: "Assignment Failed", color: red[700], bgColor: red[50] },
  unprotected: { label: "Unprotected", color: grey[600], bgColor: grey[100] },
};
