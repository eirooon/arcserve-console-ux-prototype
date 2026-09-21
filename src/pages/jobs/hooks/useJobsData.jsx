import { Link } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";
import { iconColumn } from "../../../utils/iconColumn";
import { humanize } from "../../../utils/text";
import { formatDuration } from "../../../utils/time";

const EMPTY_DISPLAY = "-";

// job_status values mirror LatestJobCell's JOB_STATUS_DISPLAY (see
// ../../plans/components/LatestJobCell.jsx) so a job's status reads
// consistently wherever it appears in the app.
const JOB_STATUS_ICON_META = {
  completed: { icon: CheckCircleRoundedIcon, label: "Completed", color: "success.main" },
  in_progress: { icon: SyncRoundedIcon, label: "In Progress", color: "info.main" },
  failed: { icon: CancelRoundedIcon, label: "Failed", color: "error.main" },
  skipped: { icon: RemoveCircleRoundedIcon, label: "Skipped", color: "text.disabled" },
};

// Unix-seconds timestamp columns (the Jobs API returns start/end times as
// seconds, unlike the ISO-string timestamps used elsewhere in the app).
function timestampColumn(field, headerName) {
  return {
    field,
    headerName,
    flex: 1,
    minWidth: 170,
    type: "dateTime",
    valueGetter: (value) => (value ? new Date(value * 1000) : null),
    valueFormatter: (value) =>
      value
        ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(value)
        : EMPTY_DISPLAY,
  };
}

// Maps a job's `available_actions` (from the API) to the row-actions menu
// items shown under the "Job" section — see getJobRowActionGroups below.
const AVAILABLE_ACTION_LABELS = {
  viewlogs: "View Logs",
  rerun: "Rerun",
  cancel: "Cancel",
};

export function getColumns() {
  return [
    { field: "source_name", headerName: "Source", flex: 1, minWidth: 160 },
    {
      field: "job_name",
      headerName: "Job Name",
      flex: 1.5,
      minWidth: 240,
      renderCell: ({ value }) => {
        if (!value) return EMPTY_DISPLAY;
        return (
          <Link
            component="button"
            type="button"
            variant="body2"
            color="secondary"
            underline="hover"
            onClick={() => jobsStore.showSnackbar(`View details for "${value}"`)}
          >
            {value}
          </Link>
        );
      },
    },
    iconColumn("job_status", "Status", (row) => JOB_STATUS_ICON_META[row.job_status] ?? null, {
      width: 150,
      showLabel: true,
    }),
    {
      field: "job_type",
      headerName: "Job Type",
      flex: 1,
      minWidth: 160,
      valueGetter: (value) => humanize(value) ?? EMPTY_DISPLAY,
    },
    {
      field: "policy_name",
      headerName: "Plan",
      flex: 1,
      minWidth: 160,
      valueGetter: (value) => value || EMPTY_DISPLAY,
    },
    {
      field: "recovery_point_location",
      headerName: "Recovery Point Location",
      flex: 1,
      minWidth: 180,
      valueGetter: (value) => value || EMPTY_DISPLAY,
    },
    timestampColumn("start_time_ts", "Start Time"),
    timestampColumn("end_time_ts", "End Time"),
    {
      field: "site_name",
      headerName: "Site Name",
      flex: 1,
      minWidth: 140,
      valueGetter: (value, row) => row.site?.site_name || EMPTY_DISPLAY,
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 110,
      valueFormatter: (value) => formatDuration(value) ?? EMPTY_DISPLAY,
    },
  ];
}

// Per-row "Action" menu for the Jobs table (see DataTable's `rowActions`
// prop). The "Job" section is driven by each row's `available_actions` (as
// returned by the API) instead of a fixed list, since not every job type
// supports the same actions.
export function getJobRowActionGroups() {
  return (row) => {
    const jobItems = (row.available_actions ?? []).map((action) => ({
      label: AVAILABLE_ACTION_LABELS[action] ?? humanize(action),
    }));
    return [
      ...(jobItems.length > 0 ? [{ section: "Job", items: jobItems }] : []),
      { section: "Manage", items: [{ label: "Delete" }] },
    ];
  };
}

export const jobsStore = createResourceStore(ENDPOINTS.JOBS);

export function useJobsData(selector) {
  return useResourceStore(jobsStore, selector);
}
