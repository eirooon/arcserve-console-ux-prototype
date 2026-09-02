import { Box, Button, Stack, Typography } from "@mui/material";
import MessagingChannelsPanel from "./MessagingChannelsPanel";
import { useMessagingChannels } from "../hooks/useMessagingChannels";
import { MESSAGING_STEP_COPY } from "../messagingChannelsData";

export default function ConfigureMessagingChannelsStep({
  onCancel,
  onPrevious,
  onNext,
  nextStepLabel,
}) {
  const messagingChannels = useMessagingChannels();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          {MESSAGING_STEP_COPY.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {MESSAGING_STEP_COPY.description}
        </Typography>
      </Box>

      <MessagingChannelsPanel {...messagingChannels} />

      <Stack direction="row" justifyContent="space-between">
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="secondary" onClick={onPrevious}>
            Previous
          </Button>
          <Button variant="contained" onClick={onNext}>
            {nextStepLabel ? `Next: ${nextStepLabel}` : "Next"}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
