import PropTypes from "prop-types";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TonePill from "../../../../components/TonePill";
import { primaryTint } from "./azureStyles";

const TASK_STATUSES = ["pending", "active", "done", "failed"];

function TaskIcon({ status }) {
  if (status === "done") return <CheckCircleIcon sx={{ color: "success.main" }} aria-hidden />;
  if (status === "failed") return <ErrorIcon sx={{ color: "error.main" }} aria-hidden />;
  if (status === "active") return <CircularProgress size={22} thickness={5} aria-hidden sx={{ m: "1px" }} />;
  return <RadioButtonUncheckedIcon sx={{ color: "action.disabled" }} aria-hidden />;
}

TaskIcon.propTypes = { status: PropTypes.oneOf(TASK_STATUSES).isRequired };

/**
 * Ordered list of Azure tasks with their status — used by each wizard step
 * that creates something, and by the final "Connecting" view. An optional
 * `footer` renders as a shaded row inside the same card.
 */
export default function TaskList({ tasks, ariaLabel, footer }) {
  const activeTask = tasks.find((task) => task.status === "active");
  const failedTask = tasks.find((task) => task.status === "failed");
  return (
    <>
      {/* Announces each task as it starts, without re-reading the whole list. */}
      <Box role="status" aria-live="polite" sx={visuallyHidden}>
        {failedTask ? `${failedTask.activeLabel} failed.` : activeTask ? `${activeTask.activeLabel}…` : ""}
      </Box>
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box component="ol" aria-label={ariaLabel} sx={{ listStyle: "none", m: 0, p: 0 }}>
          {tasks.map((task, index) => {
            const active = task.status === "active";
            const failed = task.status === "failed";
            const showDescription = (active || failed) && Boolean(task.description);
            // Single-line rows center the icon and pill on the label; rows with
            // a description keep them aligned to the first line.
            const align = showDescription ? "flex-start" : "center";
            return (
              <Stack
                component="li"
                key={task.id}
                direction="row"
                spacing={3}
                sx={{
                  alignItems: align,
                  justifyContent: "space-between",
                  p: 2,
                  borderTop: index === 0 ? 0 : 1,
                  borderColor: "divider",
                  bgcolor: failed
                    ? (theme) => alpha(theme.palette.error.main, 0.06)
                    : active
                      ? primaryTint
                      : "transparent",
                }}
              >
                <Stack direction="row" spacing={3} sx={{ alignItems: align, minWidth: 0 }}>
                  <TaskIcon status={task.status} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: active || failed ? 500 : 400 }}>
                      {task.status === "done" ? task.doneLabel : task.activeLabel}
                    </Typography>
                    {showDescription && (
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {task.description}
                      </Typography>
                    )}
                  </Box>
                </Stack>
                {task.status === "done" && <TonePill tone="success" label="Done" />}
                {active && <TonePill tone="info" label="In Progress" />}
                {failed && <TonePill tone="error" label="Failed" />}
              </Stack>
            );
          })}
        </Box>
        {footer && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "action.hover",
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      activeLabel: PropTypes.string.isRequired,
      doneLabel: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.oneOf(TASK_STATUSES).isRequired,
    }),
  ).isRequired,
  ariaLabel: PropTypes.string.isRequired,
  footer: PropTypes.node,
};
