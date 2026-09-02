import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMessagingChannelConfigForm } from "../hooks/useMessagingChannelConfigForm";
import { MESSAGE_PREVIEW, NOTIFICATION_TYPES } from "../messagingChannelsData";
import { PROTECTION_INTENT_OPTIONS } from "../protectionIntentData";

const ARCGENIE_OPTION = PROTECTION_INTENT_OPTIONS.find(
  (option) => option.id === "arcgenie-suggest",
);

function MessagePreviewCard() {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: 2.5,
        width: "100%",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar
          variant="rounded"
          sx={{ bgcolor: ARCGENIE_OPTION.avatarBgColor, color: ARCGENIE_OPTION.iconColor, width: 36, height: 36 }}
        >
          {ARCGENIE_OPTION.icon}
        </Avatar>
        <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="body2" fontWeight={900} color="text.primary">
              {MESSAGE_PREVIEW.sender}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {MESSAGE_PREVIEW.timestamp}
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="body2" fontWeight={700} color="text.primary">
              {MESSAGE_PREVIEW.title}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {MESSAGE_PREVIEW.summary}
            </Typography>
            <Stack sx={{ mt: 0.5 }}>
              {MESSAGE_PREVIEW.details.map((detail) => (
                <Typography key={detail.label} variant="body2" color="text.primary">
                  <Typography component="span" variant="body2" color="text.secondary">
                    {detail.label}:{" "}
                  </Typography>
                  {detail.value}
                </Typography>
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ pt: 0.5 }}>
            <Button
              size="small"
              variant="contained"
              disableElevation
              sx={{ bgcolor: "#3f8062", "&:hover": { bgcolor: "#357054" } }}
            >
              Approve
            </Button>
            <Button
              size="small"
              variant="contained"
              disableElevation
              sx={{ bgcolor: "#cd4164", "&:hover": { bgcolor: "#b8395a" } }}
            >
              Reject
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{ color: "text.primary", borderColor: "rgba(0, 0, 0, 0.5)" }}
            >
              Review
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default function MessagingChannelConfigDialog({ channelId, channels, onClose, onSave }) {
  const { definition, formValues, setField } = useMessagingChannelConfigForm(channelId, channels);

  const open = Boolean(channelId) && Boolean(definition) && Boolean(formValues);

  const handleSave = () => {
    onSave(channelId, formValues);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {definition && formValues && (
        <>
          <DialogTitle
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2 }}
          >
            <Typography variant="body1" fontWeight={700} color="text.primary">
              {definition.name} - Configuration
            </Typography>
            <IconButton onClick={onClose} aria-label="Close dialog" size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.primary">
                Channel
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={formValues.channelName}
                onChange={(event) => setField("channelName", event.target.value)}
              />
            </Stack>

            <Divider />

            <Stack spacing={2}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                Route to this channel
              </Typography>
              <Stack>
                {NOTIFICATION_TYPES.map((notification) => (
                  <Stack
                    key={notification.key}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2" color="text.primary">
                      {notification.label}
                    </Typography>
                    <Switch
                      checked={formValues[notification.key]}
                      onChange={(event) => setField(notification.key, event.target.checked)}
                      aria-label={`Toggle ${notification.label}`}
                    />
                  </Stack>
                ))}
              </Stack>
            </Stack>

            <Divider />

            <Stack spacing={2}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                Preview
              </Typography>
              <MessagePreviewCard />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
