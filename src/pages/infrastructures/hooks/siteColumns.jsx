import { Box, Link } from "@mui/material";
import SiteStatusCell from "../components/SiteStatusCell";
import { SITE_TYPE_OPTIONS } from "./siteStatus";

const SITE_TYPE_LABELS = Object.fromEntries(SITE_TYPE_OPTIONS.map(({ value, label }) => [value, label]));

// "03/23/2026 10:02:37 PM" — the Last Contact format used in the Sites
// design. Created once at module scope since Intl formatters are costly.
const lastContactFormatter = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
});

function formatLastContact(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return lastContactFormatter.format(date).replace(",", "");
}

// Sites column set (the Actions column is added by DataTable via
// `rowActions` — see InfrastructuresTable). `onOpenSite` is what the Site
// Name link does, so the column config stays free of page wiring.
export function getSiteColumns({ onOpenSite }) {
  return [
    {
      field: "name",
      headerName: "Site Name",
      flex: 1,
      minWidth: 140,
      renderCell: ({ row, value }) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Link
          component="button"
          type="button"
          variant="body2"
          color="secondary"
          underline="hover"
          onClick={() => onOpenSite(row)}
          title={value}
          sx={{
            display: "block",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "left",
          }}
        >
          {value}
          </Link>
        </Box>
      ),
    },
    {
      field: "siteType",
      headerName: "Type",
      flex: 1,
      minWidth: 100,
      valueFormatter: (value) => SITE_TYPE_LABELS[value] ?? "-",
    },
    {
      field: "cloudAccount",
      headerName: "Cloud Account",
      flex: 1,
      minWidth: 130,
      valueFormatter: (value) => value || "N/A",
    },
    { field: "registeredEmail", headerName: "Registered Email Address", flex: 1.5, minWidth: 200 },
    { field: "host", headerName: "Host Name", flex: 1, minWidth: 120 },
    { field: "version", headerName: "Version", flex: 0.5, minWidth: 80 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      // Sort on the raw status; only the display changes.
      renderCell: ({ row }) => <SiteStatusCell status={row.status} deployProgress={row.deployProgress} />,
    },
    {
      field: "lastContact",
      headerName: "Last Contact",
      flex: 1,
      minWidth: 180,
      // Sort on the raw timestamp; only the display is formatted.
      valueFormatter: (value) => formatLastContact(value),
    },
  ];
}

export const siteFields = [
  { field: "name", label: "Site Name", type: "text" },
  { field: "siteType", label: "Type", type: "select", options: SITE_TYPE_OPTIONS },
  { field: "cloudAccount", label: "Cloud Account", type: "text" },
  { field: "registeredEmail", label: "Registered Email Address", type: "text" },
  { field: "host", label: "Host Name", type: "text" },
];
