import { Alert, Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import EnvironmentRadarVisual from "./EnvironmentRadarVisual";
import DiscoveryPhaseRow from "./DiscoveryPhaseRow";
import { useEnvironmentDiscoverySimulation } from "../hooks/useEnvironmentDiscoverySimulation";

const BRAND_GRADIENT = "linear-gradient(90deg, #8A2BFF 0%, #00A7E1 100%)";

export default function EnvironmentDiscoveryStep({ onDiscoveryComplete, onCancel }) {
  const { progress, status, phases } = useEnvironmentDiscoverySimulation();
  const isComplete = status === "complete";
  const percent = Math.round(progress * 100);

  return (
    <Stack spacing={3} alignItems="center">
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 640,
          overflow: "hidden",
          borderRadius: "20px",
          bgcolor: "background.default",
          px: { xs: 3, sm: 7 },
          pt: { xs: 4, sm: 5.5 },
          pb: { xs: 4, sm: 5 },
        }}
      >
        <Stack alignItems="center" spacing={0}>
          <Box sx={{ mb: 3.25 }}>
            <EnvironmentRadarVisual active={!isComplete} />
          </Box>

          <Typography
            variant="h5"
            fontWeight={600}
            color="text.primary"
            sx={{ fontSize: "20px", lineHeight: 1.3, letterSpacing: "-0.005em" }}
          >
            {isComplete ? "Environment scan complete" : "Scanning your environment"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 1.25, lineHeight: 1.55, maxWidth: 400 }}
          >
            {isComplete
              ? "We've finished discovering your infrastructure."
              : "Finding and analyzing your infrastructure. This typically takes 30–60 seconds."}
          </Typography>

          <Box
            role="status"
            aria-live="polite"
            sx={visuallyHidden}
          >
            {isComplete ? "Discovery complete" : ""}
          </Box>

          <Stack direction="row" alignItems="center" spacing={2} sx={{ width: "100%", mt: 3.75 }}>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                "& .MuiLinearProgress-bar": {
                  borderRadius: 2,
                  background: BRAND_GRADIENT,
                },
              }}
            />
            <Typography
              variant="caption"
              fontWeight={500}
              color="text.primary"
              sx={{ width: 42, textAlign: "right", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}
            >
              {percent}%
            </Typography>
          </Stack>

          <Stack
            component="ul"
            sx={{
              width: "100%",
              listStyle: "none",
              m: 0,
              mt: 2.75,
              px: 2,
              py: 0.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "12px",
            }}
          >
            {phases.map((phase, index) => (
              <DiscoveryPhaseRow
                key={phase.id}
                label={phase.label}
                status={phase.status}
                count={phase.count}
                isLast={index === phases.length - 1}
              />
            ))}
          </Stack>

          <Alert severity="info" sx={{ width: "100%", mt: 3.25 }}>
            We&rsquo;re categorizing your infrastructure into protection tiers. You&rsquo;ll
            review these next.
          </Alert>
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
        <Button variant="text" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onDiscoveryComplete} disabled={!isComplete}>
          {isComplete ? "Continue to Define Intent" : "Scanning…"}
        </Button>
      </Stack>
    </Stack>
  );
}
