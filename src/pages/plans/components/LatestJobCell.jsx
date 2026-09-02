import { Link, Stack, Typography } from "@mui/material";
import { formatAbsoluteTimestamp } from "../../../utils/time";

// job_status values mirror the Jobs page (see ../../jobs/hooks/useJobsData.jsx)
// so a plan's latest job reads consistently wherever job status appears.
const JOB_STATUS_DISPLAY = {
  completed: { label: "Finished", preposition: "on" },
  in_progress: { label: "Running", preposition: "since" },
  failed: { label: "Failed", preposition: "on" },
  skipped: { label: "Skipped", preposition: "on" },
};

export default function LatestJobCell({ job }) {
  if (!job) {
    return (
      <Typography variant="body2" color="text.secondary">
        -
      </Typography>
    );
  }

  const { label: statusLabel, preposition } = JOB_STATUS_DISPLAY[job.job_status] ?? {
    label: job.job_status,
    preposition: "on",
  };
  const timestamp = job.job_status === "in_progress" ? job.start_time_ts : job.end_time_ts;

  return (
    <Stack spacing={0} sx={{ minWidth: 0, py: 1 }}>
      <Link href="#" variant="body2" color="secondary" underline="hover">
        {job.job_name}
      </Link>
      <Typography variant="body2" color="text.secondary" noWrap>
        {statusLabel}- {preposition} {formatAbsoluteTimestamp(timestamp)}
      </Typography>
    </Stack>
  );
}
