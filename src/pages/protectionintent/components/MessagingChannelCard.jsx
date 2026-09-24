import { memo } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { MESSAGING_CHANNELS } from "../messagingChannelsData";

/**
 * One channel row, mirroring the ACRS Networks tab's NetworkInterfaceCard
 * (src/pages/infrastructures/components/acrs/NetworkInterfaceCard.jsx):
 * "Configure" and the Connect/Disconnect toggle are independent controls and
 * both are always available — Configure is never hidden or disabled by
 * connection state, so a channel's routing can be staged before it's
 * connected.
 */
function MessagingChannelCard({ channel, connecting, onConfigure, onToggleConnection }) {
  const definition = MESSAGING_CHANNELS.find((entry) => entry.id === channel.id);
  const connectionLabel = channel.connected ? "Disconnect" : "Connect";

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
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
        <Box
          component="img"
          src={definition.icon}
          alt=""
          sx={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }}
        />
        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
          <Typography variant="body1" color="text.primary">
            {definition.name}
          </Typography>
          <Typography
            variant="body2"
            sx={channel.connected ? { color: green[700] } : { color: "text.secondary" }}
          >
            {channel.connected ? "Connected" : "Not connected"}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ flexShrink: 0 }}>
        <Button
          size="small"
          color="secondary"
          aria-label={`Configure ${definition.name}`}
          onClick={() => onConfigure(channel)}
        >
          Configure
        </Button>
        <Button
          size="small"
          variant="outlined"
          color={!connecting && channel.connected ? "error" : "secondary"}
          aria-label={`${connectionLabel} ${definition.name}`}
          loading={connecting}
          loadingIndicator={<CircularProgress color="secondary" size={16} />}
          onClick={() => onToggleConnection(channel)}
        >
          {connectionLabel}
        </Button>
      </Stack>
    </Box>
  );
}

export default memo(MessagingChannelCard);
