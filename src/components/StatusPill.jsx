import { Box, Typography } from "@mui/material";

// Soft (tonal) status pill: a light background with matching dark text,
// used for at-a-glance status indicators (e.g. "Active", "20 waiting").
export default function StatusPill({ label, bgcolor, color, dot = false, fontWeight = 500 }) {
  return (
    <Box
      sx={{
        bgcolor,
        color,
        borderRadius: "999px",
        px: 1.25,
        height: 24,
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        flexShrink: 0,
      }}
    >
      {dot && (
        <Box
          aria-hidden
          sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: color, flexShrink: 0 }}
        />
      )}
      <Typography variant="caption" fontWeight={fontWeight}>
        {label}
      </Typography>
    </Box>
  );
}
