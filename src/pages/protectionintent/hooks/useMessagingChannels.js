import { useCallback, useState } from "react";
import { buildInitialMessagingChannels } from "../messagingChannelsData";
import { ENTRY_POINT, SUBMIT_ACTION, hasChannelConfig } from "../messagingChannelConfig";

// Same reasoning as MIN_CONNECTING_DURATION_MS in
// useNetworkInterfaceActions.js: there's no real connection behind this
// (just local state), but the Connect/Disconnect button's busy state still
// needs to be held long enough to actually be seen.
const MIN_CONNECTING_DURATION_MS = 500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Owns every messaging-channel write, mirroring useNetworkInterfaceActions.js
 * for the ACRS Networks tab: bringing a channel's connection up or down (with
 * a busy indicator), the confirmation that gates every disconnect, and
 * saving a channel's routing config through the Configure dialog — optionally
 * connecting it as part of that save.
 */
export function useMessagingChannels() {
  const [channels, setChannels] = useState(buildInitialMessagingChannels);
  const [busyIds, setBusyIds] = useState(() => new Set());
  const [pendingDisconnect, setPendingDisconnect] = useState(null);
  // { channel, entryPoint } for the Configure dialog, or null while closed.
  const [configuring, setConfiguring] = useState(null);
  const [saving, setSaving] = useState(false);

  const runWithBusyIndicator = useCallback(async (channelId, task) => {
    setBusyIds((current) => new Set(current).add(channelId));
    try {
      await Promise.all([task(), wait(MIN_CONNECTING_DURATION_MS)]);
    } finally {
      setBusyIds((current) => {
        const next = new Set(current);
        next.delete(channelId);
        return next;
      });
    }
  }, []);

  // Connecting a channel supersedes whichever channel (if any) was
  // previously connected, since only one may be active at a time.
  const connect = useCallback(
    (channel) =>
      runWithBusyIndicator(channel.id, async () => {
        setChannels((current) =>
          current.map((entry) => ({ ...entry, connected: entry.id === channel.id })),
        );
      }),
    [runWithBusyIndicator],
  );

  const disconnect = useCallback(
    (channel) =>
      runWithBusyIndicator(channel.id, async () => {
        setChannels((current) =>
          current.map((entry) => (entry.id === channel.id ? { ...entry, connected: false } : entry)),
        );
      }),
    [runWithBusyIndicator],
  );

  const openConfigure = useCallback(
    (channel) => setConfiguring({ channel, entryPoint: ENTRY_POINT.CONFIGURE }),
    [],
  );
  const openConnectConfigure = useCallback(
    (channel) => setConfiguring({ channel, entryPoint: ENTRY_POINT.CONNECT }),
    [],
  );
  const closeConfigure = useCallback(() => setConfiguring(null), []);

  // Connect/Disconnect button. Connecting is immediate when the channel
  // already has a saved routing config; otherwise it hands off to the
  // Configure dialog so the admin picks one and connects as part of saving
  // it. Disconnecting always asks for confirmation first.
  const toggleConnection = useCallback(
    (channel) => {
      if (channel.connected) {
        setPendingDisconnect(channel);
        return undefined;
      }
      if (!hasChannelConfig(channel)) {
        openConnectConfigure(channel);
        return undefined;
      }
      return connect(channel);
    },
    [connect, openConnectConfigure],
  );

  const confirmDisconnect = useCallback(async () => {
    const channel = pendingDisconnect;
    setPendingDisconnect(null);
    if (channel) await disconnect(channel);
  }, [pendingDisconnect, disconnect]);

  const cancelDisconnect = useCallback(() => setPendingDisconnect(null), []);

  // Configure dialog submit. `updatedChannel` carries the edited routing
  // config with the channel's existing `connected` value; `action` says
  // whether to also connect it (which, same as `connect` above, disconnects
  // every other channel).
  const saveConfig = useCallback(
    async (updatedChannel, action) => {
      setSaving(true);
      try {
        if (action === SUBMIT_ACTION.SAVE_AND_CONNECT) {
          await runWithBusyIndicator(updatedChannel.id, async () => {
            setChannels((current) =>
              current.map((entry) =>
                entry.id === updatedChannel.id
                  ? { ...updatedChannel, connected: true }
                  : { ...entry, connected: false },
              ),
            );
          });
        } else {
          setChannels((current) =>
            current.map((entry) => (entry.id === updatedChannel.id ? updatedChannel : entry)),
          );
        }
      } finally {
        setSaving(false);
      }
      setConfiguring(null);
    },
    [runWithBusyIndicator],
  );

  return {
    channels,
    busyIds,
    pendingDisconnect,
    configuring,
    saving,
    openConfigure,
    closeConfigure,
    toggleConnection,
    confirmDisconnect,
    cancelDisconnect,
    saveConfig,
  };
}
