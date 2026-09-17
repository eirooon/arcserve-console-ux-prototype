import { Stack } from "@mui/material";
import MessagingChannelCard from "./MessagingChannelCard";
import MessagingChannelRoutingPanel from "./MessagingChannelRoutingPanel";

export default function MessagingChannelsPanel({
  channels,
  selectedChannelId,
  selectChannel,
  selectedChannel,
  connectChannel,
  disconnectChannel,
  setChannelField,
}) {
  return (
    <Stack direction="row" spacing={4} alignItems="flex-start">
      <Stack
        spacing={2}
        role="radiogroup"
        aria-label="Messaging channel"
        sx={{ flex: 1, minWidth: 0 }}
      >
        {channels.map((channel) => (
          <MessagingChannelCard
            key={channel.id}
            channel={channel}
            selected={channel.id === selectedChannelId}
            onSelect={selectChannel}
            onConnect={connectChannel}
            onDisconnect={disconnectChannel}
          />
        ))}
      </Stack>

      <MessagingChannelRoutingPanel
        channel={selectedChannel}
        onFieldChange={(field, value) => setChannelField(selectedChannelId, field, value)}
      />
    </Stack>
  );
}
