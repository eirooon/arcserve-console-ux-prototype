import { Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import MoreVertOutlined from "@mui/icons-material/MoreVertOutlined";
import { green } from "@mui/material/colors";
import { MESSAGING_CHANNELS } from "../messagingChannelsData";

export default function MessagingChannelCard({ channel, onConnect, onOpenMenu }) {
  const definition = MESSAGING_CHANNELS.find((entry) => entry.id === channel.id);

  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        minWidth: 0,
        borderRadius: 2,
        px: 3,
        py: 2,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          component="img"
          src={definition.icon}
          alt={`${definition.name} logo`}
          sx={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }}
        />
        <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" color="text.primary">
            {definition.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={channel.connected ? { color: green[700] } : undefined}
          >
            {channel.connected ? "Connected" : "Not connected"}
          </Typography>
        </Stack>
        {channel.connected ? (
          <IconButton
            aria-label={`${definition.name} channel actions`}
            onClick={(event) => onOpenMenu(event, channel.id)}
          >
            <MoreVertOutlined />
          </IconButton>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => onConnect(channel.id)}
          >
            Connect
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
