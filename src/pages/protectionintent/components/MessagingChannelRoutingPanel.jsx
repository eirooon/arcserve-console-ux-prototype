import { MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import FormField from "../../../components/FormField";
import MessagingPreviewCard from "./MessagingPreviewCard";
import { CHANNEL_NAME_OPTIONS, NOTIFICATION_TYPES } from "../messagingChannelsData";

// Always visible regardless of connection state — the select and switches
// below just disable themselves until `channel` is connected.
export default function MessagingChannelRoutingPanel({ channel, onFieldChange }) {
  const disabled = !channel?.connected;

  return (
    <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
      <FormField label="Select Channel">
        <TextField
          select
          size="small"
          fullWidth
          disabled={disabled}
          value={disabled ? "" : (channel.channelName ?? "")}
          onChange={(event) => onFieldChange("channelName", event.target.value)}
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value="" disabled>
            Select channel
          </MenuItem>
          {CHANNEL_NAME_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </FormField>

      <Stack spacing={2}>
        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
          Route to this channel
        </Typography>
        <Stack spacing={1}>
          {NOTIFICATION_TYPES.map((notification) => (
            <Stack key={notification.key} direction="row" spacing={1} alignItems="center">
              <Switch
                size="small"
                checked={!disabled && Boolean(channel[notification.key])}
                disabled={disabled}
                onChange={(event) => onFieldChange(notification.key, event.target.checked)}
                aria-label={`Toggle ${notification.label}`}
              />
              <Typography variant="body2" color="text.primary">
                {notification.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
          Preview
        </Typography>
        <MessagingPreviewCard />
      </Stack>
    </Stack>
  );
}
