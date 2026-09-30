import { useMemo } from "react";
import { Stack, Typography } from "@mui/material";
import TonePill from "../../../components/TonePill";
import { ENDPOINTS } from "../../../api/endpoints";
import { CLOUD_SERVICE_OPTIONS, PENDING_ADMIN_STATUS } from "./cloudServices";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";
import { getSiteColumns, siteFields } from "./siteColumns";

export const columns = [
  { field: "name", headerName: "Name", flex: 1.5 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "host", headerName: "Host", flex: 1.5 },
  { field: "status", headerName: "Status", flex: 1 },
  { field: "version", headerName: "Version", flex: 1 },
];

export const fields = [
  { field: "name", label: "Name", type: "text" },
  { field: "type", label: "Type", type: "text" },
  { field: "host", label: "Host", type: "text" },
  { field: "status", label: "Status", type: "text" },
  { field: "version", label: "Version", type: "text" },
];

// "02/01/2026 8:37 PM" — the Last Refresh format used in the Cloud Accounts
// design. Created once at module scope since Intl formatters are costly.
const lastRefreshFormatter = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatLastRefresh(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return lastRefreshFormatter.format(date).replace(",", "");
}

function formatPolicyCount(count) {
  if (count == null) return "-";
  return `${count} ${count === 1 ? "Policy" : "Policies"}`;
}

// Cloud Accounts has its own column set (the Actions column is added by
// DataTable via `rowActions` — see InfrastructuresTable).
export const cloudAccountColumns = [
  { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
  { field: "cloudService", headerName: "Cloud Service", flex: 1, minWidth: 140 },
  {
    field: "lastRefresh",
    headerName: "Last Refresh",
    flex: 1,
    minWidth: 160,
    // Sort on the raw timestamp; only the display is formatted.
    valueFormatter: (value) => formatLastRefresh(value),
    // Setups handed to an Azure admin have never refreshed, so this column
    // shows where they stand instead — visible and actionable (row menu)
    // until finished, rather than disappearing into an email.
    renderCell: ({ row, formattedValue }) =>
      row.status === PENDING_ADMIN_STATUS ? (
        <Stack direction="row" sx={{ alignItems: "center", height: "100%" }}>
          <TonePill tone="warning" label="Pending admin setup" />
        </Stack>
      ) : (
        formattedValue
      ),
  },
  {
    field: "policyCount",
    headerName: "Policy",
    flex: 1,
    minWidth: 150,
    type: "number",
    align: "left",
    headerAlign: "left",
    renderCell: ({ value }) =>
      value == null ? (
        "-"
      ) : (
        <Typography component="span" variant="body2" sx={{ color: "secondary.main" }}>
          {formatPolicyCount(value)}
        </Typography>
      ),
  },
];

export const cloudAccountFields = [
  { field: "name", label: "Name", type: "text" },
  { field: "cloudService", label: "Cloud Service", type: "select", options: CLOUD_SERVICE_OPTIONS },
];

// Clicking a Site Name opens it for editing, same as double-clicking the row.
const siteColumns = getSiteColumns({ onOpenSite: (row) => infrastructureStore.openEdit(row) });

export function getInfrastructureTableConfig(categoryId) {
  if (categoryId === "cloud-accounts") {
    return { columns: cloudAccountColumns, fields: cloudAccountFields };
  }
  if (categoryId === "sites") {
    return { columns: siteColumns, fields: siteFields };
  }
  return { columns, fields };
}

export const infrastructureStore = createResourceStore(ENDPOINTS.INFRASTRUCTURE);

export function useInfrastructureData(selector) {
  return useResourceStore(infrastructureStore, selector);
}

function selectRows(state) {
  return { rows: state.rows };
}

// Sub-nav categories whose badge reflects the live row count instead of the
// static placeholder in subRoutes.js (see createSplitLayout's `useCounts`).
const LIVE_COUNT_CATEGORY_IDS = ["sites", "cloud-accounts"];

export function useInfrastructureCounts() {
  const { rows } = useInfrastructureData(selectRows);
  return useMemo(
    () =>
      Object.fromEntries(
        LIVE_COUNT_CATEGORY_IDS.map((id) => [id, filterInfrastructureByCategory(rows, id).length]),
      ),
    [rows],
  );
}

// Types that make up the "Hypervisors" sub-nav category — every hypervisor
// platform this list supports.
const HYPERVISOR_TYPES = new Set(["vmware_vcenter", "hyper_v", "nutanix_ahv"]);

// Mirrors the left sub-navigation items in subRoutes.js (id -> predicate) so
// selecting "Hypervisors", "Sites", etc. filters the shared Infrastructures
// table down to just that category.
export function filterInfrastructureByCategory(rows, categoryId) {
  switch (categoryId) {
    case "hypervisors":
      return rows.filter((row) => HYPERVISOR_TYPES.has(row.type));
    case "sites":
      return rows.filter((row) => row.type === "site");
    case "storage-arrays":
      return rows.filter((row) => row.type === "storage_array");
    case "proxies":
      return rows.filter((row) => row.type === "backup_proxy");
    case "oracle-hosts":
      return rows.filter((row) => row.type === "oracle_host");
    case "cloud-accounts":
      return rows.filter((row) => row.type === "cloud_account");
    default:
      return rows;
  }
}
