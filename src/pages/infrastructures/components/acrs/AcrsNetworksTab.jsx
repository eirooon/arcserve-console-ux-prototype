import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";
import { apiClient } from "../../../../api/client";
import { ENDPOINTS } from "../../../../api/endpoints";
import { acrsServersStore } from "../../hooks/useAcrsServersData";
import NetworkInterfaceCard from "./NetworkInterfaceCard";
import ConfigureNetworkDialog from "./ConfigureNetworkDialog";

// The mock API resolves a PUT almost instantly, which would make the
// Connect/Disconnect button's loading state flash too briefly to actually
// see. Holding it for at least this long keeps it perceivable without
// meaningfully slowing down the action.
const MIN_CONNECTING_DURATION_MS = 500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AcrsNetworksTab({ server }) {
  const nics = useMemo(() => server.networkInterfaces ?? [], [server.networkInterfaces]);
  const [configuringNic, setConfiguringNic] = useState(null);
  const [saving, setSaving] = useState(false);
  const [connectingIds, setConnectingIds] = useState(() => new Set());

  const persistNics = async (nextNics) => {
    setSaving(true);
    try {
      await apiClient.put(`${ENDPOINTS.ACRS_SERVERS}/${server.id}`, { networkInterfaces: nextNics });
      await acrsServersStore.refetch();
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConfig = async (updatedNic) => {
    const nextNics = nics.map((nic) => (nic.id === updatedNic.id ? updatedNic : nic));
    await persistNics(nextNics);
    setConfiguringNic(null);
  };

  const handleToggleConnection = async (nic) => {
    setConnectingIds((current) => new Set(current).add(nic.id));
    const nextNics = nics.map((candidate) =>
      candidate.id === nic.id ? { ...candidate, connected: !candidate.connected } : candidate,
    );
    try {
      await Promise.all([persistNics(nextNics), wait(MIN_CONNECTING_DURATION_MS)]);
    } finally {
      setConnectingIds((current) => {
        const next = new Set(current);
        next.delete(nic.id);
        return next;
      });
    }
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", p: 3 }}>
        {nics.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No network interfaces available.
          </Typography>
        ) : (
          <Stack spacing={2} sx={{ maxWidth: 600, mx: "auto" }}>
            {nics.map((nic) => (
              <NetworkInterfaceCard
                key={nic.id}
                nic={nic}
                connecting={connectingIds.has(nic.id)}
                onConfigure={setConfiguringNic}
                onToggleConnection={handleToggleConnection}
              />
            ))}
          </Stack>
        )}
      </Box>

      <ConfigureNetworkDialog
        nic={configuringNic}
        saving={saving}
        onClose={() => setConfiguringNic(null)}
        onSave={handleSaveConfig}
      />
    </Box>
  );
}

AcrsNetworksTab.propTypes = {
  server: PropTypes.shape({
    id: PropTypes.string.isRequired,
    networkInterfaces: PropTypes.array,
  }).isRequired,
};
