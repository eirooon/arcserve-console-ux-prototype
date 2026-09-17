import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { blue } from "@mui/material/colors";
import { MESSAGE_PREVIEW } from "../messagingChannelsData";

export default function MessagingPreviewCard() {
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
          sx={{ bgcolor: blue[50], color: blue[600], width: 36, height: 36 }}
        >
          <AutoAwesomeIcon fontSize="small" />
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
