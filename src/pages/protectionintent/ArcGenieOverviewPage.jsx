import { useNavigate } from "react-router-dom";
import { green } from "@mui/material/colors";
import { Box, Chip, Stack, Typography } from "@mui/material";
import WaitingOnYouCard from "./components/WaitingOnYouCard";
import GoalStatusCard from "./components/GoalStatusCard";
import ActivityLogList from "./components/ActivityLogList";
import StatusPill from "../../components/StatusPill";
import FilterTabs from "../../components/FilterTabs";
import { useWaitingOnYou } from "./hooks/useWaitingOnYou";
import { useWaitingOnYouFilter } from "./hooks/useWaitingOnYouFilter";
import { useActivityLogRestore } from "./hooks/useActivityLogRestore";
import { useExclusiveDisclosure } from "../../hooks/useExclusiveDisclosure";
import {
  INITIAL_AGENTIC_GOALS,
  getAutonomyLevelLabel,
  getAssessmentFrequencyLabel,
} from "./configureGoalsAutonomyData";
import {
  ASSESSMENT_TIME_LABEL,
  GOAL_OVERVIEW_SEGMENTS_BY_ID,
  OVERVIEW_SUMMARY,
  WAITING_ON_YOU_OLDEST_SINCE_LABEL,
  getGoalStatusChip,
  getSuggestionChip,
  getWaitingCount,
} from "./arcGenieOverviewData";
import { useApiResource } from "../../api/useApiResource";
import { ENDPOINTS } from "../../api/endpoints";

// Only goals with a defined segment breakdown get a status card on the overview.
const TRACKED_GOALS = INITIAL_AGENTIC_GOALS.filter(
  (goal) => GOAL_OVERVIEW_SEGMENTS_BY_ID[goal.id],
);

// The overview's Activity Log is a preview, not the full feed — "View All"
// (ArcGenieActivityLogPage) is where the rest lives.
const ACTIVITY_LOG_PREVIEW_COUNT = 3;

function ViewAllLink({ children, onClick, disabled }) {
  return (
    <Typography
      component="button"
      onClick={onClick}
      disabled={disabled}
      sx={{
        border: 0,
        m: 0,
        p: 0,
        bgcolor: "transparent",
        cursor: disabled ? "default" : "pointer",
        fontFamily: "inherit",
        fontSize: "0.8125rem",
        fontWeight: 500,
        letterSpacing: "0.46px",
        color: disabled ? "text.disabled" : "secondary.main",
        "&:hover": disabled ? undefined : { textDecoration: "underline" },
      }}
    >
      {children}
    </Typography>
  );
}

function SectionHeading({ children, badge, action }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      rowGap={0.5}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          {children}
        </Typography>
        {badge}
      </Stack>
      {action}
    </Stack>
  );
}

export default function ArcGenieOverviewPage() {
  const navigate = useNavigate();
  const { items, handleAction, handleDismiss, dismissSuggestion } = useWaitingOnYou();
  const { activeType, setActiveType, visibleItems, filterOptions } = useWaitingOnYouFilter(items);
  const dismissPanel = useExclusiveDisclosure();
  const { rows: activityLogItems } = useApiResource(
    ENDPOINTS.ARCGENIE_ACTIVITY_LOG,
  );
  const { withOverlay, restoreSuggestion, isRestored } = useActivityLogRestore();

  // Live count, not a static per-goal snapshot, so approving/dismissing/
  // undoing a Waiting on You item updates this line immediately.
  const totalWaiting = items.length;

  const goToGoals = () =>
    navigate("/arcgenie/protection-intent", { state: { initialTab: "goals" } });

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        minHeight: "calc(100vh - 64px)",
        py: { xs: 3, sm: 4, md: 6 },
      }}
    >
      <Stack spacing={3} sx={{ width: "100%", px: { xs: 2, sm: 4, md: 6 } }}>
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" rowGap={1}>
            <Typography variant="h6" color="text.primary">
              Your Protection Overview
            </Typography>
            <StatusPill label="Agent Active" bgcolor={green[50]} color={green[700]} dot fontWeight={700} />
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {`${OVERVIEW_SUMMARY.activeGoalCount} automations running across ${OVERVIEW_SUMMARY.totalSources} sources. `}
            <Typography component="span" variant="body2" fontWeight={500} color="text.primary">
              {`${totalWaiting} decisions are waiting on you`}
            </Typography>
            {` — the oldest since ${WAITING_ON_YOU_OLDEST_SINCE_LABEL}.`}
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems={{ xs: "stretch", md: "flex-start" }}
        >
          <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
            <SectionHeading
              badge={
                items.length > 0 && (
                  <Chip label={items.length} size="small" sx={{ height: 24 }} />
                )
              }
              action={
                <ViewAllLink
                  disabled={items.length === 0}
                  onClick={() => navigate("/arcgenie/overview/waiting-on-you")}
                >
                  View All
                </ViewAllLink>
              }
            >
              Waiting on You
            </SectionHeading>

            {items.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Currently, there are no activities to report. ArcGenie will
                automatically record policy checks and optimizations in this
                section as they happen.
              </Typography>
            ) : (
              <>
                <FilterTabs
                  value={activeType}
                  onChange={setActiveType}
                  options={filterOptions}
                  ariaLabel="Filter Waiting on You by request type"
                />

                {visibleItems.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No items match this filter.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {visibleItems.map((item) => (
                      <WaitingOnYouCard
                        key={item.id}
                        item={item}
                        onAction={handleAction}
                        onDismiss={handleDismiss}
                        isDismissPanelOpen={dismissPanel.isOpen(item.id)}
                        onOpenDismissPanel={() => dismissPanel.open(item.id)}
                        onCloseDismissPanel={dismissPanel.close}
                        onConfirmDismiss={(dismissedItem, { reason, note }) => {
                          dismissPanel.close();
                          dismissSuggestion(dismissedItem, { reason, note });
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </>
            )}
          </Stack>

          <Stack spacing={4} sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={2}>
              <SectionHeading action={<ViewAllLink onClick={goToGoals}>View All</ViewAllLink>}>
                Automated Workflows
              </SectionHeading>

              <Stack spacing={2}>
                {TRACKED_GOALS.map((goal) => (
                  <GoalStatusCard
                    key={goal.id}
                    title={goal.shortTitle}
                    description={goal.shortDescription}
                    statusChip={
                      getWaitingCount(goal.id) > 0
                        ? getGoalStatusChip(goal.id)
                        : getSuggestionChip(items, goal.id)
                    }
                    segments={GOAL_OVERVIEW_SEGMENTS_BY_ID[goal.id]}
                    autonomyLabel={getAutonomyLevelLabel(goal.autonomyLevel)}
                    frequencyLabel={`${getAssessmentFrequencyLabel(goal.assessmentFrequency)} · ${ASSESSMENT_TIME_LABEL}`}
                    onOpen={() => navigate(`/arcgenie/overview/${goal.id}`)}
                  />
                ))}
              </Stack>
            </Stack>

            <Stack spacing={2}>
              <SectionHeading
                action={
                  <ViewAllLink onClick={() => navigate("/arcgenie/activity-log")}>
                    View All
                  </ViewAllLink>
                }
              >
                Activity Log
              </SectionHeading>

              <ActivityLogList
                items={withOverlay(activityLogItems).slice(0, ACTIVITY_LOG_PREVIEW_COUNT)}
                onRestoreSuggestion={restoreSuggestion}
                isRestored={isRestored}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
