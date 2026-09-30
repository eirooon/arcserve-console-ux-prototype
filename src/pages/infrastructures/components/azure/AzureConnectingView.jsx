import { forwardRef } from "react";
import PropTypes from "prop-types";
import { LinearProgress, Stack } from "@mui/material";
import TaskList from "./TaskList";
import { StepHeading } from "./AzureWizardParts";

const HEADINGS = {
  running: {
    title: "Connecting to Arcserve",
    subtitle: "Everything is set up in Azure. Arcserve is checking it can reach it. You can keep working; we'll notify you when it's done.",
  },
  failed: {
    title: "Connecting didn’t finish",
    subtitle:
      "Retry picks up where it stopped, or clean up to remove everything Arcserve created in Azure for this setup.",
  },
  cleaningUp: {
    title: "Cleaning up",
    subtitle: "Removing everything Arcserve created in Azure for this setup…",
  },
};

/**
 * "Setting Up Azure" progress (Figma 10305:17329), plus the failed and
 * cleaning-up states the design didn't cover.
 */
const AzureConnectingView = forwardRef(function AzureConnectingView({ tasks, status }, headingRef) {
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const percent = Math.round((doneCount / tasks.length) * 100);
  const heading = HEADINGS[status];

  return (
    <Stack spacing={3}>
      <StepHeading ref={headingRef} title={heading.title} subtitle={heading.subtitle} />
      {status === "cleaningUp" ? (
        <LinearProgress aria-label="Cleaning up" />
      ) : (
        <LinearProgress
          variant="determinate"
          value={percent}
          color={status === "failed" ? "error" : "primary"}
          aria-label="Azure setup progress"
        />
      )}
      <TaskList tasks={tasks} ariaLabel="Connection steps" />
    </Stack>
  );
});

AzureConnectingView.propTypes = {
  tasks: PropTypes.array.isRequired,
  status: PropTypes.oneOf(["running", "failed", "cleaningUp"]).isRequired,
};

export default AzureConnectingView;
