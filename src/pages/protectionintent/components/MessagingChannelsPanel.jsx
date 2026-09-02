import { Menu, MenuItem, Stack } from "@mui/material";
import MessagingChannelCard from "./MessagingChannelCard";
import MessagingChannelConfigDialog from "./MessagingChannelConfigDialog";

export default function MessagingChannelsPanel({
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
}) {
  return (
    <>
      <Stack direction="row" spacing={2}>
        {channels.map((channel) => (
          <MessagingChannelCard
            key={channel.id}
            channel={channel}
            onConnect={connectChannel}
            onOpenMenu={openMenu}
          />
        ))}
      </Stack>

      <Menu anchorEl={menuState.anchorEl} open={Boolean(menuState.anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={() => openConfigDialog(menuState.channelId)}>Configure</MenuItem>
        <MenuItem onClick={() => disconnectChannel(menuState.channelId)}>Disconnect</MenuItem>
      </Menu>

      <MessagingChannelConfigDialog
        channelId={configChannel?.id ?? null}
        channels={channels}
        onClose={closeConfigDialog}
        onSave={saveChannelConfig}
      />
    </>
  );
}
