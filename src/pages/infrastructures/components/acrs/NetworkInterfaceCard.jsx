import { memo } from "react";
import PropTypes from "prop-types";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";

/**
 * One interface row. "Configure" and the Connect/Disconnect toggle are
 * independent controls and both are always available: Configure is never
 * hidden or disabled by connection state, so an admin can pre-stage settings
 * (e.g. an IP) on an interface that isn't connected yet.
 */
function NetworkInterfaceCard({ nic, connecting, onConfigure, onToggleConnection }) {
  const connectionLabel = nic.connected ? "Disconnect" : "Connect";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        p: 2,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            role="img"
            aria-label={nic.connected ? "Connected" : "Disconnected"}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              flexShrink: 0,
              bgcolor: nic.connected ? "success.main" : "error.main",
            }}
          />
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {nic.name}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ pl: "16px" }}>
          {nic.description}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ flexShrink: 0 }}>
        <Button
          size="small"
          color="secondary"
          aria-label={`Configure ${nic.name}`}
          onClick={() => onConfigure(nic)}
        >
          Configure
        </Button>
        <Button
          size="small"
          variant="outlined"
          color={!connecting && nic.connected ? "error" : "secondary"}
          aria-label={`${connectionLabel} ${nic.name}`}
          loading={connecting}
          loadingIndicator={<CircularProgress color="secondary" size={16} />}
          onClick={() => onToggleConnection(nic)}
        >
          {connectionLabel}
        </Button>
      </Stack>
    </Box>
  );
}

NetworkInterfaceCard.propTypes = {
  nic: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    connected: PropTypes.bool,
    managementSession: PropTypes.bool,
  }).isRequired,
  connecting: PropTypes.bool,
  onConfigure: PropTypes.func.isRequired,
  onToggleConnection: PropTypes.func.isRequired,
};

export default memo(NetworkInterfaceCard);
