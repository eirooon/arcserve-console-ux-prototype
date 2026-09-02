import { useNavigate } from "react-router-dom";
import { green, blueGrey } from "@mui/material/colors";
import { Alert, Box, Chip, Snackbar, Stack, Typography } from "@mui/material";
import NeedsAttentionCard from "./components/NeedsAttentionCard";
import GoalStatusCard from "./components/GoalStatusCard";
import StatusPill from "./components/StatusPill";
import { useNeedsAttention } from "./hooks/useNeedsAttention";
import {
  INITIAL_AGENTIC_GOALS,
  getAutonomyLevelLabel,
  getAssessmentFrequencyLabel,
} from "./configureGoalsAutonomyData";
import {
  AUTO_PROTECT_GOAL_ID,
  ASSESSMENT_TIME_LABEL,
  GOAL_OVERVIEW_SEGMENTS_BY_ID,
  OVERVIEW_SUMMARY,
  WAITING_ON_YOU_OLDEST_SINCE_LABEL,
  getGoalStatusChip,
  getWaitingCount,
} from "./arcGenieOverviewData";
import { useApiResource } from "../../api/useApiResource";
import { ENDPOINTS } from "../../api/endpoints";

// Only goals with a defined segment breakdown get a status card on the overview.
const TRACKED_GOALS = INITIAL_AGENTIC_GOALS.filter(
  (goal) => GOAL_OVERVIEW_SEGMENTS_BY_ID[goal.id],
);

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
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6" color="text.primary">
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
  const { items, handleAction, handleDismiss, snackbarMessage, closeSnackbar } =
    useNeedsAttention();
  const { rows: activityLogItems } = useApiResource(
    ENDPOINTS.ARCGENIE_ACTIVITY_LOG,
  );

  const totalWaiting = getWaitingCount(AUTO_PROTECT_GOAL_ID);

  const goToGoals = () =>
    navigate("/arcgenie/protection-intent", { state: { initialTab: "goals" } });

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        minHeight: "calc(100vh - 64px)",
        py: 3,
      }}
    >
      <Stack
        direction="row"
        spacing={4}
        alignItems="flex-start"
        sx={{ width: "100%", px: 4 }}
      >
        <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
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

          <Stack spacing={2}>
            <SectionHeading
              badge={
                items.length > 0 && (
                  <Chip label={items.length} size="small" sx={{ height: 24 }} />
                )
              }
              action={
                <ViewAllLink
                  disabled={items.length === 0}
                  onClick={() => navigate("/arcgenie/overview/needs-attention")}
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
              <Stack spacing={2}>
                {items.map((item) => (
                  <NeedsAttentionCard
                    key={item.id}
                    item={item}
                    onAction={handleAction}
                    onDismiss={handleDismiss}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>

        <Stack spacing={4} sx={{ width: 400, flexShrink: 0 }}>
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
                  statusChip={getGoalStatusChip(goal.id)}
                  segments={GOAL_OVERVIEW_SEGMENTS_BY_ID[goal.id]}
                  autonomyLabel={getAutonomyLevelLabel(goal.autonomyLevel)}
                  frequencyLabel={`${getAssessmentFrequencyLabel(goal.assessmentFrequency)} · ${ASSESSMENT_TIME_LABEL}`}
                  onOpen={() => navigate(`/arcgenie/overview/${goal.id}`)}
                />
              ))}
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h6" color="text.primary">
              Activity Log
            </Typography>

            {activityLogItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No recent activities. ArcGenie will log automated policy
                checks and optimizations here as they occur.
              </Typography>
            ) : (
              <Stack>
                {activityLogItems.map((activity) => (
                  <Stack
                    key={activity.id}
                    spacing={0.5}
                    sx={{
                      py: 2,
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2" color="text.primary">
                      {activity.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: blueGrey[500] }}>
                      Approved by {activity.approvedBy} on {activity.date}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={closeSnackbar}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
