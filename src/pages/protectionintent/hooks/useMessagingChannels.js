import { useCallback, useState } from "react";
import { buildInitialMessagingChannels } from "../messagingChannelsData";

export function useMessagingChannels() {
  const [channels, setChannels] = useState(buildInitialMessagingChannels);
  // Only one messaging channel can be connected at a time — this tracks
  // which row is focused in the list, independent of connection state.
  const [selectedChannelId, setSelectedChannelId] = useState(
    () => buildInitialMessagingChannels()[0]?.id ?? null,
  );

  const selectChannel = useCallback((channelId) => {
    setSelectedChannelId(channelId);
  }, []);

  // Connecting a channel supersedes whichever channel (if any) was
  // previously connected, since only one may be active at a time.
  const connectChannel = useCallback((channelId) => {
    setChannels((current) =>
      current.map((channel) => ({ ...channel, connected: channel.id === channelId })),
    );
  }, []);

  const disconnectChannel = useCallback((channelId) => {
    setChannels((current) =>
      current.map((channel) =>
        channel.id === channelId ? { ...channel, connected: false } : channel,
      ),
    );
  }, []);

  const setChannelField = useCallback((channelId, field, value) => {
    setChannels((current) =>
      current.map((channel) =>
        channel.id === channelId ? { ...channel, [field]: value } : channel,
      ),
    );
  }, []);

  const selectedChannel = channels.find((channel) => channel.id === selectedChannelId) ?? null;

  return {
    channels,
    selectedChannelId,
    selectChannel,
    selectedChannel,
    connectChannel,
    disconnectChannel,
    setChannelField,
  };
}
