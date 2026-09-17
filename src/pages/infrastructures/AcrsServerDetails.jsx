import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import { usePageBreadcrumb } from "../../hooks/usePageBreadcrumb";
import { useAcrsServersData } from "./hooks/useAcrsServersData";
import AcrsFileSystemsTab from "./components/acrs/AcrsFileSystemsTab";
import AcrsNetworksTab from "./components/acrs/AcrsNetworksTab";

const TABS = [
  { id: "file-systems", label: "File Systems" },
  { id: "networks", label: "Networks" },
];

const selectRowsState = (state) => ({ rows: state.rows, loading: state.loading });

/**
 * "ACRS Device Details" (Figma nodes 7283:9445 File Systems tab / 7284:17735
 * Networks tab): reached from the servers list's Display Name link or its
 * row menu's Manage File Systems/Manage Networks items, which pass which
 * tab to open initially via route state.
 */
export default function AcrsServerDetails() {
  const { serverId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rows, loading } = useAcrsServersData(selectRowsState);

  const server = useMemo(() => rows.find((row) => row.id === serverId), [rows, serverId]);

  // Registry-based breadcrumbs only know static routes, so this record's
  // name has to be published as its own trailing crumb (see AppBreadcrumbs)
  // — same mechanism AddPlanPage uses for "Plans > <plan name>".
  usePageBreadcrumb(server?.displayName ?? null);

  const [tabId, setTabId] = useState(location.state?.tab ?? "file-systems");
  const tabIndex = Math.max(
    TABS.findIndex((tab) => tab.id === tabId),
    0,
  );

  if (!server) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="text.secondary">
          {loading ? "Loading…" : "Server not found."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, py: 2 }}
      >
        <Typography variant="h6" color="text.primary">
          {server.displayName}
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/infrastructures/arcserve-cyber-resilient-servers")}
        >
          Close
        </Button>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
        <Tabs value={tabIndex} onChange={(_, index) => setTabId(TABS[index].id)}>
          {TABS.map((tab) => (
            <Tab key={tab.id} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {tabId === "file-systems" && <AcrsFileSystemsTab server={server} />}
      {tabId === "networks" && <AcrsNetworksTab server={server} />}
    </Box>
  );
}
