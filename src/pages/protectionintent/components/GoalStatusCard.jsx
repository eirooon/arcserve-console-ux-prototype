import { Box, Stack, Typography } from "@mui/material";
import StatusPill from "./StatusPill";

function SegmentBar({ segments }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <Stack direction="row" sx={{ height: 5, borderRadius: "999px", overflow: "hidden" }}>
      {segments.map((segment) => (
        <Box
          key={segment.key}
          sx={{ flex: total > 0 ? segment.value : 1, bgcolor: segment.color }}
        />
      ))}
    </Stack>
  );
}

function SegmentLegend({ segments }) {
  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
      {segments.map((segment) => (
        <Stack key={segment.key} direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: segment.color, flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary">
            {segment.value.toLocaleString()} {segment.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default function GoalStatusCard({
  title,
  description,
  statusChip,
  segments,
  autonomyLabel,
  frequencyLabel,
  onOpen,
}) {
  return (
    <Stack
      spacing={2}
      sx={{
        p: 2,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: "12px",
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Typography
            component="button"
            onClick={onOpen}
            sx={{
              border: 0,
              m: 0,
              p: 0,
              bgcolor: "transparent",
              textAlign: "left",
              cursor: "pointer",
              color: "secondary.main",
              fontWeight: 600,
              fontSize: "0.875rem",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {title}
          </Typography>
          <StatusPill label={statusChip.label} bgcolor={statusChip.bgcolor} color={statusChip.color} />
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Stack>

      <SegmentBar segments={segments} />
      <SegmentLegend segments={segments} />

      <Stack sx={{ pt: 0.5, borderTop: 1, borderColor: "divider" }}>
        <Typography variant="caption" color="text.secondary">
          {autonomyLabel} · {frequencyLabel}
        </Typography>
      </Stack>
    </Stack>
  );
}
