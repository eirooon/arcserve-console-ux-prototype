import { Link } from "@mui/material";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import BackupRoundedIcon from "@mui/icons-material/BackupRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import { ENDPOINTS } from "../../../api/endpoints";
import {
  createResourceStore,
  useResourceStore,
} from "../../../api/createResourceStore";
import { iconColumn } from "../../../utils/iconColumn";
import LatestJobCell from "../components/LatestJobCell";

// Icon + label for the Type column, keyed by plan_type (see
// src/mocks/data/plans.js). Mirrors the Sources table's Type/Status icon
// treatment (see useSourceData.jsx) via the shared `iconColumn` helper.
const PLAN_TYPE_ICON_META = {
  backup_recovery: { icon: BackupRoundedIcon, label: "Backup & Recovery" },
  archive: { icon: ArchiveRoundedIcon, label: "Archive" },
  replication: { icon: SyncRoundedIcon, label: "Replication" },
};

const PLAN_STATUS_ICON_META = {
  active: {
    icon: PlayCircleRoundedIcon,
    label: "Active",
    color: "success.main",
  },
  paused: {
    icon: PauseCircleRoundedIcon,
    label: "Paused",
    color: "text.disabled",
  },
};

// Takes `navigate` (from useNavigate, called by PlansTable) so the Plan Name
// link can route to the same Add Plan wizard page used to create it, in
// view/edit mode — see getPlanRowActionGroups' "Modify" item below and
// AddPlanPage's planId handling.
export function getColumns(navigate) {
  return [
    {
      field: "plan_name",
      headerName: "Plan Name",
      flex: 1.5,
      renderCell: (params) => {
        if (!params.value) return "-";
        return (
          <Link
            component="button"
            type="button"
            variant="body2"
            color="secondary"
            underline="hover"
            onClick={() => navigate(`/plans/${params.row.id}`)}
          >
            {params.value}
          </Link>
        );
      },
    },
    iconColumn(
      "plan_type",
      "Type",
      (row) => PLAN_TYPE_ICON_META[row.plan_type] ?? null,
    ),
    iconColumn(
      "plan_status",
      "Status",
      (row) => PLAN_STATUS_ICON_META[row.plan_status] ?? null,
    ),
    {
      field: "protected_sources",
      headerName: "Protected Sources",
      type: "number",
      flex: 1,
    },
    {
      field: "unprotected_sources",
      headerName: "Unprotected Sources",
      type: "number",
      flex: 1,
    },
    {
      field: "source_group",
      headerName: "Source Group",
      flex: 1,
      valueGetter: (value) => value || "-",
    },
    {
      field: "latest_job",
      headerName: "Latest Job",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => <LatestJobCell job={params.value} />,
    },
    { field: "policy_type", headerName: "Protection Type", flex: 1.2 },
  ];
}

// Per-row "Action" menu for the Plans table (see DataTable's `rowActions`
// prop), grouped by context to match the Sources table's Job/Manage/Action
// menu (see getSourceRowActionGroups in useSourceData.jsx — same section
// labels and RowActionsMenu styling). Takes `navigate` so "Modify" can route
// to the same Add Plan wizard page used to create the plan, in view/edit
// mode; the rest are presentational only, like the rest of this page's
// not-yet-wired actions, so their onClick is intentionally omitted.
export function getPlanRowActionGroups(navigate) {
  return (row) => [
    {
      section: "Job",
      items: [{ label: "Start Backup " }],
    },
    {
      section: "Manage",
      items: [
        { label: "Modify", onClick: () => navigate(`/plans/${row.id}`) },
        { label: "Deploy" },
        { label: "Disable" },
        { label: "Delete" },
      ],
    },
    {
      section: "Action",
      items: [{ label: "Copy Recovery Points" }, { label: "Refresh" }],
    },
  ];
}

export const plansStore = createResourceStore(ENDPOINTS.PLANS);

export function usePlansData(selector) {
  return useResourceStore(plansStore, selector);
}
