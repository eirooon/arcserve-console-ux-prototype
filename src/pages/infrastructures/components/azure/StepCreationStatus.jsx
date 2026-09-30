import PropTypes from "prop-types";
import { Alert, Stack } from "@mui/material";
import TaskList from "./TaskList";

/**
 * A step's own "create in Azure" progress: the task list while running and
 * once done, plus what went wrong if it failed. `failureContent` replaces
 * the default "Retry" hint when a step has its own way out (e.g. a missing
 * right that retrying can't fix).
 */
export default function StepCreationStatus({ creation, failureContent }) {
  if (creation.status === "idle") return null;
  return (
    <Stack spacing={1.5}>
      <TaskList tasks={creation.tasks} ariaLabel="Created in Azure" />
      {creation.status === "failed" &&
        (failureContent ?? (
          <Alert severity="error" role="alert">
            Nothing else was changed. Select Retry to pick up where it stopped.
          </Alert>
        ))}
    </Stack>
  );
}

StepCreationStatus.propTypes = {
  creation: PropTypes.shape({
    status: PropTypes.string.isRequired,
    tasks: PropTypes.array.isRequired,
  }).isRequired,
  failureContent: PropTypes.node,
};
