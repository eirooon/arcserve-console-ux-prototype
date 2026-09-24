import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Chip, Link, Stack, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { blueGrey, deepPurple, red } from "@mui/material/colors";

const DEFAULT_EMPTY_MESSAGE =
  "No recent activities. ArcGenie will log automated policy checks and optimizations here as they occur.";

function ActivityAvatar({ isAgent, initials }) {
  return (
    <Box
      aria-hidden="true"
      sx={{
        flexShrink: 0,
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: isAgent ? deepPurple[50] : "action.selected",
        color: isAgent ? deepPurple[700] : "text.secondary",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      {isAgent ? <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} /> : initials}
    </Box>
  );
}

/**
 * The activity feed, shared by the ArcGenie Overview page's preview and the
 * standalone Activity Log page (ArcGenieActivityLogPage) reached from its
 * "View All" link — same reasoning as WaitingOnYouCard being shared between
 * the Overview page's "Waiting on You" section and ArcGenieWaitingOnYouPage.
 *
 * Each item is either agent-authored (`actor: "agent"`, attributed to
 * ArcGenie) or person-authored (default, attributed via `approvedBy`).
 * `onRestoreSuggestion`/`isRestored` are only relevant to dismissal entries
 * (ones with a `restorePayload`) — see useActivityLogRestore.
 */
export default function ActivityLogList({
  items,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  onRestoreSuggestion,
  isRestored,
}) {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <Stack>
      {items.map((activity) => {
        const isAgent = activity.actor === "agent";
        const hasInset = Boolean(activity.reasonLabel || activity.note);
        const alreadyRestored = isRestored?.(activity.id) ?? false;

        return (
          <Stack
            key={activity.id}
            direction="row"
            spacing={2}
            sx={{ py: 2, borderBottom: 1, borderColor: "divider" }}
          >
            <ActivityAvatar isAgent={isAgent} initials={activity.initials ?? activity.approvedBy?.[0]} />

            <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
                <Typography variant="body2" color="text.primary">
                  {activity.message}
                </Typography>
                {activity.flagged && (
                  <Chip
                    label={activity.flagLabel}
                    size="small"
                    sx={{ flexShrink: 0, bgcolor: red[50], color: red[700], fontWeight: 600 }}
                  />
                )}
              </Stack>

              {hasInset && (
                <Stack spacing={0.5} sx={{ bgcolor: "action.hover", borderRadius: "8px", px: 2, py: 1.25 }}>
                  {activity.reasonLabel && (
                    <Typography variant="body2" color="text.primary">
                      Reason: {activity.reasonLabel}
                    </Typography>
                  )}
                  {activity.note && (
                    <Typography variant="body2" color="text.secondary">
                      Note: {activity.note}
                    </Typography>
                  )}
                </Stack>
              )}

              <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" rowGap={0.5}>
                <Typography variant="caption" sx={{ color: blueGrey[500] }}>
                  {activity.attributionText ??
                    (isAgent ? (
                      <>
                        <Typography component="span" variant="caption" sx={{ color: deepPurple[700], fontWeight: 600 }}>
                          Done by ArcGenie
                        </Typography>
                        {activity.workflowLabel ? ` · ${activity.workflowLabel}` : ""} · {activity.date}
                      </>
                    ) : (
                      `${activity.attributionVerb ?? "Approved"} by ${activity.approvedBy} on ${activity.date}`
                    ))}
                </Typography>

                <Stack direction="row" spacing={2}>
                  {activity.resolveHref && (
                    <Link component={RouterLink} to={activity.resolveHref} variant="caption" fontWeight={500} underline="hover">
                      Resolve
                    </Link>
                  )}
                  {activity.restorePayload && (
                    <Button
                      variant="text"
                      color="secondary"
                      size="small"
                      disabled={alreadyRestored}
                      onClick={() => onRestoreSuggestion?.(activity)}
                      sx={{ minHeight: 44, typography: "caption", fontWeight: 500 }}
                    >
                      {alreadyRestored ? "Restored" : "Restore suggestion"}
                    </Button>
                  )}
                  {activity.viewSourceHref && (
                    <Link component={RouterLink} to={activity.viewSourceHref} variant="caption" fontWeight={500} underline="hover">
                      View source
                    </Link>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}
