import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { red, orange, green, grey } from "@mui/material/colors";
import StatusPill from "../../../components/StatusPill";

const RING_SIZE = 88;
const RING_THICKNESS = 8;

function getHealthTone(score) {
  if (score < 50) return { label: "At Risk", bgcolor: red[50], color: red[600] };
  if (score < 80) return { label: "Needs Attention", bgcolor: orange[50], color: orange[800] };
  return { label: "Healthy", bgcolor: green[50], color: green[700] };
}

function getHealthScore(segments) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  if (total === 0) return 0;
  return Math.round((segments[0].value / total) * 100);
}

function HealthRing({ segments }) {
  const score = getHealthScore(segments);
  const tone = getHealthTone(score);
  const scoreAngle = (score / 100) * 360;

  return (
    <Stack spacing={1.5} alignItems="center" sx={{ flexShrink: 0 }}>
      <Box
        sx={{
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: "50%",
          background: `conic-gradient(${tone.color} ${scoreAngle}deg, ${grey[200]} ${scoreAngle}deg)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: RING_SIZE - RING_THICKNESS * 2,
            height: RING_SIZE - RING_THICKNESS * 2,
            borderRadius: "50%",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1.2}>
            {score}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.5625rem", letterSpacing: "1px" }}
          >
            HEALTH
          </Typography>
        </Stack>
      </Box>
      <StatusPill label={tone.label} bgcolor={tone.bgcolor} color={tone.color} />
    </Stack>
  );
}

function SegmentLegendList({ segments }) {
  return (
    <Stack spacing={0.5}>
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
    <ButtonBase
      onClick={onOpen}
      aria-label={`Open ${title} details`}
      focusRipple
      sx={{
        display: "block",
        width: "100%",
        textAlign: "left",
        borderRadius: "12px",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack
        direction="row"
        spacing={3}
        sx={{
          p: 2,
          width: "100%",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: "12px",
        }}
      >
        <HealthRing segments={segments} />

        <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Typography variant="body1" color="secondary.main">
                {title}
              </Typography>
              {statusChip && (
                <StatusPill label={statusChip.label} bgcolor={statusChip.bgcolor} color={statusChip.color} />
              )}
            </Stack>

            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          </Stack>

          <SegmentLegendList segments={segments} />

          <Stack sx={{ pt: 0.5, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="caption" color="text.secondary">
              {autonomyLabel} · {frequencyLabel}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </ButtonBase>
  );
}
