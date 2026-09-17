import { useMemo } from "react";
import { Link } from "@mui/material";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import MonitorRoundedIcon from "@mui/icons-material/MonitorRounded";
import DynamicFeedRoundedIcon from "@mui/icons-material/DynamicFeedRounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import WifiOffRoundedIcon from "@mui/icons-material/WifiOffRounded";
import GppGoodRoundedIcon from "@mui/icons-material/GppGoodRounded";
import RemoveModeratorRoundedIcon from "@mui/icons-material/RemoveModeratorRounded";
import WindowsLogoIcon from "../../../assets/windows-logo.svg?react";
import LinuxLogoIcon from "../../../assets/linux-logo.svg?react";
import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";
import { iconColumn } from "../../../utils/iconColumn";

// Every field returned by GET /sources (flattened in src/mocks/data/sources.js)
// is exposed as a column so no information from the API response is hidden
// from the grid; columnVisibilityModel below just curates which of them are
// visible out of the box; the rest remain reachable via "Edit Columns".
const EMPTY_DISPLAY = "-";

const dateColumn = (field, headerName) => ({
  field,
  headerName,
  flex: 1,
  minWidth: 160,
  type: "dateTime",
  valueGetter: (value) => (value ? new Date(value) : null),
  valueFormatter: (value) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(value),
});

const boolColumn = (field, headerName) => ({
  field,
  headerName,
  width: 130,
  type: "boolean",
});

// Renders "-" for any null/undefined/empty cell instead of leaving it blank.
// Boolean columns are left untouched — their checkbox-icon cells are never
// blank for our data (a column is either true/false or hidden by default),
// so there's no empty state for a dash to replace there.
function withEmptyDash(column) {
  if (column.type === "boolean") return column;
  const formatValue = column.valueFormatter;
  return {
    ...column,
    valueFormatter: (value, row, col, apiRef) => {
      if (value === null || value === undefined || value === "") return EMPTY_DISPLAY;
      return formatValue ? formatValue(value, row, col, apiRef) : value;
    },
  };
}

// Title-cases a snake_case API enum value for display, e.g.
// "backup_incremental" -> "Backup Incremental".
function humanize(value) {
  if (!value) return null;
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const OS_ICON_META_BY_MAJOR = {
  windows: { icon: WindowsLogoIcon, label: "Windows" },
  linux: { icon: LinuxLogoIcon, label: "Linux" },
};

const CONNECTION_ICON_META_BY_STATUS = {
  online: { icon: WifiRoundedIcon, label: "Online", color: "success.main" },
  offline: { icon: WifiOffRoundedIcon, label: "Offline", color: "text.disabled" },
};

const PROTECTION_ICON_META_BY_STATUS = {
  protect: { icon: GppGoodRoundedIcon, label: "Protected", color: "success.main" },
  unprotect: { icon: RemoveModeratorRoundedIcon, label: "Unprotected", color: "error.main" },
};

// Icon + label for the Type column, keyed by source_type. A type not listed
// here still gets an icon (see getSourceTypeIconMeta) — the generic Monitor
// icon with a title-cased fallback label instead of a curated one.
const SOURCE_TYPE_ICON_META = {
  udp_windows: { icon: MonitorRoundedIcon, label: "Windows Agent" },
  udp_linux: { icon: MonitorRoundedIcon, label: "Linux Agent" },
  udp_linux_backup_server: { icon: MonitorRoundedIcon, label: "Linux Backup Server" },
  agentless_vm: { icon: DynamicFeedRoundedIcon, label: "Agentless VM" },
};

// isUncNfsSource is declared further below (function declarations hoist),
// shared here so the folder icon choice matches the same predicate the left
// sub-nav uses to categorize UNC/NFS sources.
function getSourceTypeIconMeta(sourceType) {
  if (!sourceType) return null;
  if (isUncNfsSource({ source_type: sourceType })) {
    return { icon: FolderRoundedIcon, label: "Network Share", color: "action.active" };
  }
  const meta = SOURCE_TYPE_ICON_META[sourceType] ?? {
    icon: MonitorRoundedIcon,
    label: humanize(sourceType),
  };
  return { ...meta, color: "action.active" };
}

const rawColumns = [
  iconColumn("source_type", "Type", (row) => getSourceTypeIconMeta(row.source_type)),
  {
    field: "source_name",
    headerName: "Name",
    flex: 1,
    minWidth: 160,
    renderCell: ({ value }) => {
      if (!value) return EMPTY_DISPLAY;
      return (
        <Link
          component="button"
          type="button"
          variant="body2"
          color="secondary"
          underline="hover"
          onClick={() => sourceStore.showSnackbar(`View details for "${value}"`)}
        >
          {value}
        </Link>
      );
    },
  },
  iconColumn("os_name", "OS", (row) => OS_ICON_META_BY_MAJOR[row.os_major] ?? null),
  iconColumn(
    "protection_status",
    "Status",
    (row) => PROTECTION_ICON_META_BY_STATUS[row.protection_status] ?? null,
  ),
  iconColumn(
    "connection_status",
    "Connection",
    (row) => CONNECTION_ICON_META_BY_STATUS[row.connection_status] ?? null,
  ),
  {
    field: "latest_job",
    headerName: "Latest Job",
    flex: 1,
    minWidth: 220,
    valueGetter: (value, row) => {
      const status = humanize(row.last_job_status);
      if (!status) return null;
      const type = humanize(row.last_job_type);
      return type ? `${type} — ${status}` : status;
    },
  },
  { field: "policy_names", headerName: "Policy", flex: 1, minWidth: 160 },
  {
    field: "agent_summary",
    headerName: "Agent",
    flex: 1,
    minWidth: 200,
    valueGetter: (value, row) =>
      row.agent_name
        ? row.agent_current_version
          ? `${row.agent_name} ${row.agent_current_version}`
          : row.agent_name
        : null,
  },
  {
    field: "hypervisor_or_cloud_account",
    headerName: "Hypervisor/Cloud Account",
    flex: 1,
    minWidth: 200,
    valueGetter: (value, row) => row.hypervisor_name || row.cloud_account || null,
  },
  { field: "vm_name", headerName: "VM Name", flex: 1, minWidth: 160 },
  { field: "source_product", headerName: "Source Product", flex: 1, minWidth: 140 },
  { field: "site_name", headerName: "Site", flex: 1, minWidth: 160 },
  { field: "site_id", headerName: "Site ID", flex: 1, minWidth: 220 },
  { field: "organization_name", headerName: "Organization", flex: 1, minWidth: 200 },
  { field: "organization_type", headerName: "Organization Type", flex: 1, minWidth: 150 },
  { field: "organization_id", headerName: "Organization ID", flex: 1, minWidth: 220 },
  { field: "policy_types", headerName: "Policy Type", flex: 1, minWidth: 160 },
  boolColumn("multiple_policy_support", "Multiple Policy Support"),
  dateColumn("last_recovery_point_ts", "Last Recovery Point"),
  { field: "last_job_type", headerName: "Last Job Type", flex: 1, minWidth: 160 },
  { field: "last_job_status", headerName: "Last Job Status", flex: 1, minWidth: 130 },
  { field: "last_job_severity", headerName: "Last Job Severity", flex: 1, minWidth: 140 },
  { field: "last_job_id", headerName: "Last Job ID", flex: 1, minWidth: 220 },
  dateColumn("last_job_start_ts", "Last Job Start"),
  dateColumn("last_job_end_ts", "Last Job End"),
  {
    field: "last_job_percent_complete",
    headerName: "Last Job % Complete",
    type: "number",
    width: 150,
  },
  { field: "available_actions", headerName: "Available Actions", flex: 1.5, minWidth: 220 },
  { field: "source_group", headerName: "Source Group", flex: 1, minWidth: 140 },
  { field: "assured_recovery_job", headerName: "Assured Recovery Job", flex: 1, minWidth: 160 },
  { field: "agent_name", headerName: "Agent Name", flex: 1, minWidth: 140 },
  { field: "agent_current_version", headerName: "Agent Current Version", flex: 1, minWidth: 160 },
  { field: "agent_upgrade_version", headerName: "Agent Upgrade Version", flex: 1, minWidth: 160 },
  { field: "agent_upgrade_link", headerName: "Agent Upgrade Link", flex: 1, minWidth: 160 },
  { field: "agent_display_version", headerName: "Agent Display Version", flex: 1, minWidth: 160 },
  { field: "hypervisor_name", headerName: "Hypervisor", flex: 1, minWidth: 160 },
  { field: "hypervisor_type", headerName: "Hypervisor Type", flex: 1, minWidth: 140 },
  { field: "hypervisor_id", headerName: "Hypervisor ID", flex: 1, minWidth: 220 },
  { field: "cloud_account", headerName: "Cloud Account", flex: 1, minWidth: 140 },
  { field: "pfc_status", headerName: "PFC Status", flex: 1, minWidth: 120 },
  { field: "os_major", headerName: "OS Major", flex: 1, minWidth: 110 },
  { field: "os_architecture", headerName: "OS Architecture", flex: 1, minWidth: 130 },
  dateColumn("create_ts", "Created"),
  dateColumn("modify_ts", "Modified"),
  boolColumn("is_deleted", "Deleted"),
  boolColumn("is_hidden", "Hidden"),
  { field: "applications", headerName: "Applications", flex: 1, minWidth: 140 },
  { field: "create_user_id", headerName: "Created By", flex: 1, minWidth: 220 },
  boolColumn("enable_draas", "DRaaS Enabled"),
  { field: "hyperv_capable", headerName: "Hyper-V Capable", flex: 1, minWidth: 140 },
  { field: "product_type", headerName: "Product Type", flex: 1, minWidth: 120 },
  boolColumn("udp_sql_server_installed", "SQL Server Installed"),
  boolColumn("udp_exchange_installed", "Exchange Installed"),
  boolColumn("udp_d2d_installed", "D2D Installed"),
  boolColumn("udp_arcserve_back_installed", "Arcserve Backup Installed"),
  boolColumn("udp_d2dod_installed", "D2D on Demand Installed"),
  { field: "udp_username", headerName: "UDP Username", flex: 1, minWidth: 140 },
  { field: "udp_d2d_major_version", headerName: "D2D Major Version", flex: 1, minWidth: 140 },
  { field: "udp_d2d_minor_version", headerName: "D2D Minor Version", flex: 1, minWidth: 140 },
  { field: "udp_update_version_number", headerName: "Update Version Number", flex: 1, minWidth: 160 },
  { field: "udp_d2d_build_number", headerName: "D2D Build Number", flex: 1, minWidth: 140 },
  { field: "udp_d2d_protocol", headerName: "D2D Protocol", flex: 1, minWidth: 120 },
  { field: "udp_d2d_port_number", headerName: "D2D Port", type: "number", width: 110 },
  { field: "udp_d2d_uuid", headerName: "D2D UUID", flex: 1, minWidth: 220 },
  { field: "udp_arcserve_version", headerName: "Arcserve Version", flex: 1, minWidth: 140 },
  { field: "udp_arcserve_port_number", headerName: "Arcserve Port", type: "number", width: 120 },
  { field: "udp_arcserve_protocol", headerName: "Arcserve Protocol", flex: 1, minWidth: 140 },
  { field: "udp_arcserve_type", headerName: "Arcserve Type", flex: 1, minWidth: 130 },
  { field: "udp_gdb_server_type", headerName: "GDB Server Type", flex: 1, minWidth: 140 },
  boolColumn("udp_rps_installed", "RPS Installed"),
  { field: "udp_cloud_type", headerName: "Cloud Type", type: "number", width: 110 },
  { field: "udp_private_ip_address", headerName: "Private IP Address", flex: 1, minWidth: 150 },
  { field: "udp_cloud_region", headerName: "Cloud Region", flex: 1, minWidth: 130 },
  { field: "udp_cloud_network", headerName: "Cloud Network", flex: 1, minWidth: 140 },
  { field: "udp_os_version", headerName: "UDP OS Version", flex: 1, minWidth: 140 },
  { field: "udp_os_description", headerName: "UDP OS Description", flex: 1, minWidth: 200 },
  { field: "udp_os_type", headerName: "UDP OS Type", flex: 1, minWidth: 130 },
  boolColumn("udp_ssh_key_auth", "SSH Key Auth"),
  { field: "udp_agent_host_link", headerName: "Agent Host Link", flex: 1, minWidth: 160 },
  { field: "udp_cloud_proxy", headerName: "Cloud Proxy", flex: 1, minWidth: 130 },
  boolColumn("vm_is_running", "VM Running"),
  boolColumn("vm_windows_os", "Windows OS"),
  { field: "vm_esx_host", headerName: "ESX Host", flex: 1, minWidth: 160 },
  { field: "vm_esx_socket_count", headerName: "ESX Socket Count", type: "number", width: 150 },
  { field: "vm_guest_os", headerName: "Guest OS", flex: 1, minWidth: 200 },
  { field: "vm_hostname", headerName: "VM Hostname", flex: 1, minWidth: 150 },
  { field: "vm_ip", headerName: "VM IP", flex: 1, minWidth: 130 },
  { field: "vm_id", headerName: "VM ID", flex: 1, minWidth: 100 },
  { field: "vm_uuid", headerName: "VM UUID", flex: 1, minWidth: 220 },
  { field: "vm_instance_uuid", headerName: "VM Instance UUID", flex: 1, minWidth: 220 },
  { field: "vm_xpath", headerName: "VM XPath", flex: 1, minWidth: 200 },
  { field: "nfs_username", headerName: "NFS Username", flex: 1, minWidth: 130 },
  { field: "windows_oracle_host", headerName: "Windows Oracle Host", flex: 1, minWidth: 160 },
  { field: "linux_oracle_host", headerName: "Linux Oracle Host", flex: 1, minWidth: 160 },
  { field: "udp_oracle", headerName: "UDP Oracle", flex: 1, minWidth: 140 },
  { field: "proxy", headerName: "Proxy", flex: 1, minWidth: 130 },
  boolColumn("is_remote", "Remote"),
  dateColumn("last_agent_sync_ts", "Last Agent Sync"),
  { field: "deployment", headerName: "Deployment", flex: 1, minWidth: 140 },
];

export const columns = rawColumns.map(withEmptyDash);

// Per-row "Action" menu groups for the Sources table (see DataTable's
// `rowActions` prop). Presentational only, like this page's "Filters" button
// and its own "Add Source(s)" discovery items — none of these are wired to a
// real backend flow yet, so onClick is intentionally omitted.
export function getSourceRowActionGroups() {
  return [
    {
      section: "Job",
      items: [{ label: "Start Backup" }, { label: "Start Recovery" }],
    },
    {
      section: "Manage",
      items: [
        { label: "Assign Policy" },
        { label: "Remove Policy" },
        { label: "Deploy Policy" },
        { label: "Delete" },
        { label: "Update" },
      ],
    },
    {
      section: "Action",
      items: [
        { label: "Copy Recovery Points" },
        { label: "Run Assured Recovery Test Now" },
        { label: "Run Assured Security - Malware Scan" },
        { label: "View Assured Security - Malware Scan Results" },
        { label: "View Assured Security - AI Anomaly Detection Results" },
      ],
    },
  ];
}

// The default column set for the grid — every other field from GET /sources
// (flattened in src/mocks/data/sources.js) is still a real, sortable/
// filterable column, just collapsed until toggled on from "Edit Columns".
const visibleByDefault = [
  "source_type",
  "source_name",
  "os_name",
  "protection_status",
  "connection_status",
  "latest_job",
  "policy_names",
  "agent_summary",
  "hypervisor_or_cloud_account",
];

export const columnVisibilityModel = Object.fromEntries(
  columns
    .filter((column) => !visibleByDefault.includes(column.field))
    .map((column) => [column.field, false]),
);

export const fields = [
  { field: "source_name", label: "Name", type: "text" },
  { field: "source_type", label: "Type", type: "text" },
  { field: "protection_status", label: "Protection", type: "text" },
  { field: "connection_status", label: "Connection", type: "text" },
  { field: "site_name", label: "Site", type: "text" },
  { field: "organization_name", label: "Organization", type: "text" },
  { field: "last_recovery_point_ts", label: "Last Recovery Point", type: "datetime" },
];

// Source types backed by an installed agent (as opposed to an agentless VM
// snapshot or a UNC/NFS share) — used to distinguish "Machines" from the
// other left-nav categories on the Sources page.
const AGENT_MACHINE_TYPES = new Set(["udp_linux", "udp_linux_backup_server", "udp_windows"]);

function isMachineSource(row) {
  return AGENT_MACHINE_TYPES.has(row.source_type);
}

function isUncNfsSource(row) {
  return /unc|nfs/i.test(row.source_type ?? "");
}

// Mirrors the left sub-navigation items in subRoutes.js (id -> predicate)
// so selecting "Machines", "Agentless VMs", etc. filters the shared Sources
// table down to just that category.
export function filterSourcesByCategory(rows, categoryId) {
  switch (categoryId) {
    case "machines":
      return rows.filter(isMachineSource);
    case "no-plan":
      return rows.filter((row) => isMachineSource(row) && !row.policy_names);
    case "agentless":
      return rows.filter((row) => row.source_type === "agentless_vm");
    case "unc":
      return rows.filter(isUncNfsSource);
    case "all":
    default:
      return rows;
  }
}

export const sourceStore = createResourceStore(ENDPOINTS.SOURCES);

export function useSourceData(selector) {
  return useResourceStore(sourceStore, selector);
}

const SOURCE_CATEGORY_IDS = ["all", "machines", "no-plan", "agentless", "unc"];

// Live per-category row counts for the Sources left sub-nav badges, kept in
// sync with the same rows and predicates the table itself filters by (see
// filterSourcesByCategory) instead of the static placeholders in
// subRoutes.js.
export function useSourceCounts() {
  const { rows } = useSourceData(selectRows);
  return useMemo(
    () =>
      Object.fromEntries(
        SOURCE_CATEGORY_IDS.map((id) => [id, filterSourcesByCategory(rows, id).length]),
      ),
    [rows],
  );
}

function selectRows(state) {
  return { rows: state.rows };
}
