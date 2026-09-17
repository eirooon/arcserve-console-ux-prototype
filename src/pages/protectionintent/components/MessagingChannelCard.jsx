import { Box, Button, Paper, Radio, Stack, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { MESSAGING_CHANNELS } from "../messagingChannelsData";

export default function MessagingChannelCard({
  channel,
  selected,
  onSelect,
  onConnect,
  onDisconnect,
}) {
  const definition = MESSAGING_CHANNELS.find((entry) => entry.id === channel.id);

  return (
    <Paper
      variant="outlined"
      role="radio"
      aria-checked={selected}
      aria-label={definition.name}
      tabIndex={0}
      onClick={() => onSelect(channel.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(channel.id);
        }
      }}
      sx={{
        borderRadius: 1,
        borderColor: selected ? "primary.main" : "divider",
        px: 3,
        py: 2,
        cursor: "pointer",
        width: "100%",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Radio checked={selected} tabIndex={-1} sx={{ p: 0 }} inputProps={{ "aria-hidden": true }} />
        <Box
          component="img"
          src={definition.icon}
          alt=""
          sx={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }}
        />
        <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
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
        {selected &&
          (channel.connected ? (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onDisconnect(channel.id);
              }}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onConnect(channel.id);
              }}
            >
              Connect
            </Button>
          ))}
      </Stack>
    </Paper>
  );
}
