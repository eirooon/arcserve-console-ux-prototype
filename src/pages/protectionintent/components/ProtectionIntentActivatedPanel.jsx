import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { getAutonomyLevelLabel } from "../configureGoalsAutonomyData";
import { PROTECTION_CATEGORY_COLUMNS } from "../protectionIntentRecommendationData";

const REDUCED_MOTION_QUERY = "@media (prefers-reduced-motion: reduce)";

const CHIP_SX = {
  bgcolor: "action.hover",
  color: "text.secondary",
  fontWeight: 500,
  px: 0.5,
};

const CIRCLE_RADIUS = 40;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const CONFETTI_COLORS = ["#8A2BFF", "#00A7E1", "#22C55E", "#F59E0B", "#EC4899"];

const CONFETTI_PIECES = Array.from({ length: 14 }, (_, index) => {
  const angle = (index / 14) * 360 + (index % 2 === 0 ? 8 : -8);
  const distance = 58 + ((index * 37) % 42);
  const radians = (angle * Math.PI) / 180;
  return {
    dx: Math.round(Math.cos(radians) * distance),
    dy: Math.round(Math.sin(radians) * distance),
    rotate: (index * 53) % 360,
    size: 5 + (index % 3) * 2,
    delay: (index % 5) * 40,
    duration: 900 + (index % 4) * 120,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    round: index % 3 === 0,
  };
});

export default function ProtectionIntentActivatedPanel({ goals, globalSettings, onViewOverview }) {
  const enabledGoalsCount = goals.filter((goal) => goal.enabled).length;

  return (
    <Stack
      spacing={4}
      alignItems="center"
      sx={{
        width: "100%",
        maxWidth: "640px",
        mx: "auto",
        my: "auto",
        textAlign: "center",
      }}
    >
      <Box sx={{ position: "relative", width: 96, height: 96 }}>
        {CONFETTI_PIECES.map((piece, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: piece.size,
              height: piece.size,
              marginTop: `${-piece.size / 2}px`,
              marginLeft: `${-piece.size / 2}px`,
              bgcolor: piece.color,
              borderRadius: piece.round ? "50%" : "2px",
              opacity: 0,
              "--dx": `${piece.dx}px`,
              "--dy": `${piece.dy}px`,
              "--rotate": `${piece.rotate}deg`,
              animation: `protection-intent-confetti ${piece.duration}ms ease-out ${450 + piece.delay}ms both`,
              "@keyframes protection-intent-confetti": {
                "0%": { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
                "70%": { opacity: 1 },
                "100%": {
                  transform: "translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rotate))",
                  opacity: 0,
                },
              },
              [REDUCED_MOTION_QUERY]: { animation: "none", opacity: 0 },
            }}
          />
        ))}

        <Box
          component="svg"
          viewBox="0 0 96 96"
          sx={{ position: "relative", width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="protection-intent-success-gradient" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00A7E1" />
              <stop offset="100%" stopColor="#8A2BFF" />
            </linearGradient>
          </defs>

          <Box
            component="circle"
            cx={48}
            cy={48}
            r={44}
            fill="url(#protection-intent-success-gradient)"
            sx={{
              opacity: 0,
              animation: "protection-intent-fill 0.5s ease-out 0.15s forwards",
              "@keyframes protection-intent-fill": {
                "0%": { opacity: 0 },
                "100%": { opacity: 0.12 },
              },
              [REDUCED_MOTION_QUERY]: { animation: "none", opacity: 0.12 },
            }}
          />

          <Box
            component="circle"
            cx={48}
            cy={48}
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="url(#protection-intent-success-gradient)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            sx={{
              strokeDashoffset: CIRCLE_CIRCUMFERENCE,
              transform: "rotate(-90deg)",
              transformOrigin: "48px 48px",
              animation: "protection-intent-draw-circle 0.7s ease-out 0.1s forwards",
              "@keyframes protection-intent-draw-circle": {
                "0%": { strokeDashoffset: CIRCLE_CIRCUMFERENCE },
                "100%": { strokeDashoffset: 0 },
              },
              [REDUCED_MOTION_QUERY]: { animation: "none", strokeDashoffset: 0 },
            }}
          />

          <Box
            component="path"
            d="M31 49 L43 61 L67 35"
            fill="none"
            stroke="url(#protection-intent-success-gradient)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={48}
            sx={{
              strokeDashoffset: 48,
              animation: "protection-intent-draw-check 0.35s ease-out 0.75s forwards",
              "@keyframes protection-intent-draw-check": {
                "0%": { strokeDashoffset: 48 },
                "100%": { strokeDashoffset: 0 },
              },
              [REDUCED_MOTION_QUERY]: { animation: "none", strokeDashoffset: 0 },
            }}
          />
        </Box>
      </Box>

      <Stack spacing={1.5}>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          You&rsquo;re All Set — ArcGenie Is Now Protecting Your Environment
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your automation guardrails are live. ArcGenie will monitor, protect, and report
          according to the goals you configured — no further action needed.
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1.5} flexWrap="wrap" justifyContent="center" useFlexGap>
        <Chip
          label={`${PROTECTION_CATEGORY_COLUMNS.length} protection categories applied`}
          sx={CHIP_SX}
        />
        <Chip
          label={`${enabledGoalsCount} agentic goal${enabledGoalsCount === 1 ? "" : "s"} enabled`}
          sx={CHIP_SX}
        />
        <Chip
          label={`${getAutonomyLevelLabel(globalSettings.autonomyLevel)} autonomy`}
          sx={CHIP_SX}
        />
      </Stack>

      <Button variant="contained" onClick={onViewOverview}>
        View Overview
      </Button>
    </Stack>
  );
}
