import { Box, Stack, Typography } from "@mui/material";
import MessagingChannelsPanel from "./components/MessagingChannelsPanel";
import { useMessagingChannels } from "./hooks/useMessagingChannels";
import { MESSAGING_STEP_COPY } from "./messagingChannelsData";

export default function ArcGenieMessagingPage() {
  const messagingChannels = useMessagingChannels();

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "calc(100vh - 64px)", py: 6 }}>
      <Stack spacing={4} sx={{ width: "100%", px: 6 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Messaging Channels
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {MESSAGING_STEP_COPY.description}
          </Typography>
        </Box>

        <MessagingChannelsPanel {...messagingChannels} />
      </Stack>
    </Box>
  );
}
