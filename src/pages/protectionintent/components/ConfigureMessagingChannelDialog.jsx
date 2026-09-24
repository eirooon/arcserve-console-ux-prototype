import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormField from "../../../components/FormField";
import PlaceholderSelect from "../../../components/PlaceholderSelect";
import { useDirtyState } from "../../../hooks/useDirtyState";
import MessagingPreviewCard from "./MessagingPreviewCard";
import { CHANNEL_NAME_OPTIONS, MESSAGING_CHANNELS, NOTIFICATION_TYPES } from "../messagingChannelsData";
import {
  ENTRY_POINT,
  SUBMIT_ACTION,
  SUBMIT_LABEL,
  hasChannelConfig,
  resolveSubmitAction,
} from "../messagingChannelConfig";

// Holds the form state. Rendered only while a channel is being configured
// (see the `channel &&` guard below), so it mounts fresh — seeded straight
// from that channel's current settings — every time "Configure" (or Connect,
// for an unconfigured channel) is clicked, the same reasoning as
// ConfigureNetworkDialog's inner form body for the ACRS Networks tab.
function ConfigureMessagingChannelForm({ channel, entryPoint, onClose, onSave, saving }) {
  const definition = MESSAGING_CHANNELS.find((entry) => entry.id === channel.id);
  const { dirty, track } = useDirtyState();
  const [channelName, setChannelName] = useState(channel.channelName ?? "");
  const [notifications, setNotifications] = useState(
    Object.fromEntries(NOTIFICATION_TYPES.map(({ key }) => [key, Boolean(channel[key])])),
  );
  const changeChannelName = track(setChannelName);
  const changeNotifications = track(setNotifications);

  const draftChannel = { ...channel, channelName, ...notifications };
  const submitAction = resolveSubmitAction({ entryPoint, connected: Boolean(channel.connected) });
  // Plain "Save" waits for an edit; "Save & Connect" does real work
  // (connecting the channel), so it stays available even before anything
  // changes, but only once a channel to route to has been picked.
  const canSubmit =
    !saving && (dirty || submitAction !== SUBMIT_ACTION.SAVE) && hasChannelConfig(draftChannel);

  const handleSave = () => {
    if (!canSubmit) return;
    onSave(draftChannel, submitAction);
  };

  return (
    <>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2 }}>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Configure {definition.name}
        </Typography>
        <IconButton onClick={onClose} aria-label="Close dialog" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <FormField label="Select Channel">
          <PlaceholderSelect
            placeholder="Select channel"
            size="small"
            fullWidth
            value={channelName}
            onChange={(event) => changeChannelName(event.target.value)}
          >
            {CHANNEL_NAME_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </PlaceholderSelect>
        </FormField>

        <Divider />

        <Stack spacing={2}>
          <Typography variant="subtitle2" fontWeight={600} color="text.primary">
            Route to this channel
          </Typography>
          <Stack spacing={1}>
            {NOTIFICATION_TYPES.map((notification) => (
              <Stack key={notification.key} direction="row" spacing={1} alignItems="center">
                <Switch
                  size="small"
                  checked={notifications[notification.key]}
                  onChange={(event) =>
                    changeNotifications((current) => ({
                      ...current,
                      [notification.key]: event.target.checked,
                    }))
                  }
                  aria-label={`Toggle ${notification.label}`}
                />
                <Typography variant="body2" color="text.primary">
                  {notification.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Typography variant="subtitle2" fontWeight={600} color="text.primary">
            Preview
          </Typography>
          <MessagingPreviewCard />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1 }}>
        <Button variant="outlined" color="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!canSubmit}>
          {SUBMIT_LABEL[submitAction]}
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * "Configure" modal for a messaging channel — the configuration detail that
 * used to sit permanently in a panel to the right of the channel list now
 * only shows once "Configure" (or "Connect", for a channel with nothing
 * configured yet) is clicked, mirroring ConfigureNetworkDialog.jsx for the
 * ACRS Networks tab.
 *
 * The primary button adapts to `entryPoint` (Connect vs Configure) and the
 * channel's `connected` state — see `resolveSubmitAction`. `onSave(updatedChannel,
 * action)` receives the resolved `SUBMIT_ACTION` so the caller knows whether
 * to also connect the channel.
 */
export default function ConfigureMessagingChannelDialog({
  channel,
  entryPoint = ENTRY_POINT.CONFIGURE,
  onClose,
  onSave,
  saving,
}) {
  return (
    <Dialog open={Boolean(channel)} onClose={onClose} maxWidth="sm" fullWidth>
      {channel && (
        <ConfigureMessagingChannelForm
          channel={channel}
          entryPoint={entryPoint}
          onClose={onClose}
          onSave={onSave}
          saving={saving}
        />
      )}
    </Dialog>
  );
}
