import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import { useNetworkInterfaceActions } from "../../hooks/useNetworkInterfaceActions";
import { ENTRY_POINT, getDisconnectDescription } from "../../hooks/networkInterfaceConfig";
import NetworkInterfaceCard from "./NetworkInterfaceCard";
import ConfigureNetworkDialog from "./ConfigureNetworkDialog";

export default function AcrsNetworksTab({ server }) {
  const nics = useMemo(() => server.networkInterfaces ?? [], [server.networkInterfaces]);
  // `nic` is a snapshot taken when the modal opens, so the form (and its
  // "did anything change" baseline) stays stable while saving refetches.
  const [configuring, setConfiguring] = useState(null);
  const openConnectConfigure = useCallback(
    (nic) => setConfiguring({ nic, entryPoint: ENTRY_POINT.CONNECT }),
    [],
  );
  const {
    saving,
    busyIds,
    pendingDisconnect,
    toggleConnection,
    confirmDisconnect,
    cancelDisconnect,
    saveConfig,
  } = useNetworkInterfaceActions({
    serverId: server.id,
    nics,
    onConfigureRequired: openConnectConfigure,
  });

  const openConfigure = useCallback(
    (nic) => setConfiguring({ nic, entryPoint: ENTRY_POINT.CONFIGURE }),
    [],
  );
  const closeConfigure = useCallback(() => setConfiguring(null), []);

  const handleSave = useCallback(
    async (updatedNic, action) => {
      await saveConfig(updatedNic, action);
      setConfiguring(null);
    },
    [saveConfig],
  );

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
                connecting={busyIds.has(nic.id)}
                onConfigure={openConfigure}
                onToggleConnection={toggleConnection}
              />
            ))}
          </Stack>
        )}
      </Box>

      <ConfigureNetworkDialog
        nic={configuring?.nic ?? null}
        entryPoint={configuring?.entryPoint ?? ENTRY_POINT.CONFIGURE}
        saving={saving}
        onClose={closeConfigure}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(pendingDisconnect)}
        title={pendingDisconnect ? `Disconnect ${pendingDisconnect.name}?` : "Disconnect interface?"}
        description={getDisconnectDescription(pendingDisconnect)}
        confirmLabel="Disconnect"
        onClose={cancelDisconnect}
        onConfirm={confirmDisconnect}
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
