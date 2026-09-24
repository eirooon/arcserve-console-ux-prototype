import { Stack } from "@mui/material";
import ConfirmDialog from "../../../components/ConfirmDialog";
import MessagingChannelCard from "./MessagingChannelCard";
import ConfigureMessagingChannelDialog from "./ConfigureMessagingChannelDialog";
import { MESSAGING_CHANNELS } from "../messagingChannelsData";
import { DISCONNECT_DESCRIPTION } from "../messagingChannelConfig";

export default function MessagingChannelsPanel({
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
}) {
  const pendingName = pendingDisconnect
    ? MESSAGING_CHANNELS.find((entry) => entry.id === pendingDisconnect.id)?.name
    : null;

  return (
    <>
      <Stack spacing={2} sx={{ width: "100%" }}>
        {channels.map((channel) => (
          <MessagingChannelCard
            key={channel.id}
            channel={channel}
            connecting={busyIds.has(channel.id)}
            onConfigure={openConfigure}
            onToggleConnection={toggleConnection}
          />
        ))}
      </Stack>

      <ConfigureMessagingChannelDialog
        channel={configuring?.channel ?? null}
        entryPoint={configuring?.entryPoint}
        saving={saving}
        onClose={closeConfigure}
        onSave={saveConfig}
      />

      <ConfirmDialog
        open={Boolean(pendingDisconnect)}
        title={pendingName ? `Disconnect ${pendingName}?` : "Disconnect channel?"}
        description={DISCONNECT_DESCRIPTION}
        confirmLabel="Disconnect"
        onClose={cancelDisconnect}
        onConfirm={confirmDisconnect}
      />
    </>
  );
}
