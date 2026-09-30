import { Card, Typography, Avatar, Box, Stack } from "@mui/material";

export default function CardItemButton({ icon, label, description }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        transition: "0.2s",
        "&:hover": {
          borderColor: "rgba(0, 0, 0, 0.10)",
          bgcolor: "#f0f2f5",
          boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.10)",
          cursor: "pointer",
        },
      }}
    >
      <Stack direction="row" spacing={3} sx={{ alignItems: "center", p: 1, width: "100%" }}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: "#f0f2f5",
            width: 40,
            height: 40,
            borderRadius: 2,
            flex: "0 0 auto",
          }}
        >
          <Box sx={{ color: "#546e7a", display: "flex" }}>{icon}</Box>
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            noWrap
            sx={{ fontWeight: 600 }}
            title={label}
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            noWrap
            title={description}
            sx={{ color: "text.secondary" }}
          >
            {description}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
