import PropTypes from "prop-types";
import { Alert, Button, Stack, Typography } from "@mui/material";
import TaskList from "./TaskList";

/**
 * A step's own "create in Azure" progress: the task list while running, a
 * confirmation once done (with Start Over, the only way to change what was
 * created), or the error to retry from the footer.
 */
export default function StepCreationStatus({ creation, doneMessage, onStartOver }) {
  if (creation.status === "idle") return null;
  return (
    <Stack spacing={1.5}>
      <TaskList
        tasks={creation.tasks}
        ariaLabel="Created in Azure"
        footer={
          creation.status === "done" && (
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
              <Typography role="status" variant="body2" sx={{ color: "text.secondary" }}>
                {doneMessage} To change it, start over.
              </Typography>
              <Button color="secondary" size="small" onClick={onStartOver} sx={{ flexShrink: 0 }}>
                Start Over
              </Button>
            </Stack>
          )
        }
      />
      {creation.status === "failed" && (
        <Alert severity="error" role="alert">
          Nothing else was changed. Select Retry to pick up where it stopped.
        </Alert>
      )}
    </Stack>
  );
}

StepCreationStatus.propTypes = {
  creation: PropTypes.shape({
    status: PropTypes.string.isRequired,
    tasks: PropTypes.array.isRequired,
  }).isRequired,
  doneMessage: PropTypes.string.isRequired,
  onStartOver: PropTypes.func.isRequired,
};
