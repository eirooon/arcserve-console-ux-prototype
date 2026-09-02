import { Avatar, ListItemButton, Paper, Stack, Typography } from "@mui/material";

export default function ProtectionIntentOptionCard({
  icon,
  iconColor,
  avatarBgColor,
  title,
  description,
  selected = false,
  onSelect,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        borderRadius: 2,
        borderColor: selected ? "primary.main" : "divider",
        overflow: "hidden",
      }}
    >
      <ListItemButton
        selected={selected}
        onClick={onSelect}
        aria-pressed={selected}
        sx={{
          height: "100%",
          alignItems: "flex-start",
          gap: 2,
          p: 3,
        }}
      >
        <Avatar sx={{ bgcolor: avatarBgColor, color: iconColor }}>{icon}</Avatar>
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </ListItemButton>
    </Paper>
  );
}
