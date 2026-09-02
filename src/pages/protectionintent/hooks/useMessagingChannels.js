import { useCallback, useState } from "react";
import { buildInitialMessagingChannels } from "../messagingChannelsData";

export function useMessagingChannels() {
  const [channels, setChannels] = useState(buildInitialMessagingChannels);
  const [menuState, setMenuState] = useState({ anchorEl: null, channelId: null });
  const [configChannelId, setConfigChannelId] = useState(null);

  const openMenu = useCallback((event, channelId) => {
    setMenuState({ anchorEl: event.currentTarget, channelId });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuState({ anchorEl: null, channelId: null });
  }, []);

  const connectChannel = useCallback((channelId) => {
    setChannels((current) =>
      current.map((channel) =>
        channel.id === channelId ? { ...channel, connected: true } : channel,
      ),
    );
  }, []);

  const disconnectChannel = useCallback(
    (channelId) => {
      setChannels((current) =>
        current.map((channel) =>
          channel.id === channelId ? { ...channel, connected: false } : channel,
        ),
      );
      closeMenu();
    },
    [closeMenu],
  );

  const openConfigDialog = useCallback(
    (channelId) => {
      setConfigChannelId(channelId);
      closeMenu();
    },
    [closeMenu],
  );

  const closeConfigDialog = useCallback(() => {
    setConfigChannelId(null);
  }, []);

  const saveChannelConfig = useCallback((channelId, updates) => {
    setChannels((current) =>
      current.map((channel) =>
        channel.id === channelId ? { ...channel, ...updates } : channel,
      ),
    );
    setConfigChannelId(null);
  }, []);

  const configChannel = channels.find((channel) => channel.id === configChannelId) ?? null;

  return {
    channels,
    menuState,
    openMenu,
    closeMenu,
    connectChannel,
    disconnectChannel,
    openConfigDialog,
    closeConfigDialog,
    saveChannelConfig,
    configChannel,
  };
}
