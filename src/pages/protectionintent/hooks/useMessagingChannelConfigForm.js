import { useCallback, useState } from "react";
import { MESSAGING_CHANNELS } from "../messagingChannelsData";

export function useMessagingChannelConfigForm(channelId, channels) {
  const definition = MESSAGING_CHANNELS.find((entry) => entry.id === channelId) ?? null;
  const channel = channels.find((entry) => entry.id === channelId) ?? null;

  const [formValues, setFormValues] = useState(channel);
  const [loadedChannelId, setLoadedChannelId] = useState(channelId);

  if (channelId !== loadedChannelId) {
    setLoadedChannelId(channelId);
    setFormValues(channel);
  }

  const setField = useCallback((field, value) => {
    setFormValues((current) => (current ? { ...current, [field]: value } : current));
  }, []);

  return { definition, formValues, setField };
}
