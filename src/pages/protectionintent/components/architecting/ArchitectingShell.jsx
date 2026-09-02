import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";

export default function ArchitectingShell({
  avatarIcon,
  avatarIconColor,
  avatarBgColor,
  heading,
  subheading,
  footerNote,
  children,
}) {
  return (
    <Box
      component="section"
      aria-label={heading}
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        width: "100%",
        p: 3,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2.5 }}>
        <Avatar sx={{ bgcolor: avatarBgColor, color: avatarIconColor }}>{avatarIcon}</Avatar>
        <Stack spacing={0.25}>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {heading}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subheading}
          </Typography>
        </Stack>
      </Stack>

      {children}

      <Divider sx={{ my: 2.5 }} />

      {footerNote}
    </Box>
  );
}
