import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import GlowingCheckIcon from "../../../components/GlowingCheckIcon";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

const RING_SCALES = [1, 0.72, 0.44];

const RADAR_BLIPS = [
  { top: "30%", left: "22%", size: 9, color: "secondary.main", delay: "0.2s" },
  { top: "22%", left: "70%", size: 9, color: "secondary.main", delay: "0.9s" },
  { top: "58%", left: "78%", size: 9, color: "primary.main", delay: "1.5s" },
  { top: "74%", left: "34%", size: 9, color: "primary.main", delay: "2.2s" },
  { top: "80%", left: "56%", size: 7, color: "secondary.main", delay: "2.9s" },
  { top: "56%", left: "14%", size: 7, color: "primary.main", delay: "3.4s" },
];

export default function EnvironmentRadarVisual({ size = 280, active = true }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animate = active && !prefersReducedMotion;
  const isComplete = !active;

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {RING_SCALES.map((scale, index) => (
        <Box
          key={scale}
          sx={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: (theme) =>
              alpha(theme.palette.primary.main, [0.22, 0.16, 0.12][index]),
          }}
        />
      ))}

      {animate && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.45),
            animation: "environment-radar-pulse 2.8s cubic-bezier(.2,.6,.2,1) infinite",
            "@keyframes environment-radar-pulse": {
              "0%": { transform: "scale(.35)", opacity: 0.55 },
              "70%": { opacity: 0 },
              "100%": { transform: "scale(1.05)", opacity: 0 },
            },
          }}
        />
      )}

      {animate && (
        <Box sx={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: (theme) =>
                `conic-gradient(from 0deg, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.primary.main, 0.05)} 60deg, transparent 120deg)`,
              maskImage: "radial-gradient(circle, transparent 12%, #000 14%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 12%, #000 14%)",
              animation: "environment-radar-sweep 2.6s linear infinite",
              "@keyframes environment-radar-sweep": {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" },
              },
            }}
          />
        </Box>
      )}

      {isComplete ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <GlowingCheckIcon size={40} iconSize={22} />
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: "primary.main",
            transform: "translate(-50%, -50%)",
            boxShadow: (theme) => `0 0 16px ${alpha(theme.palette.primary.main, 0.45)}`,
          }}
        />
      )}

      {animate &&
        RADAR_BLIPS.map((blip, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: blip.top,
              left: blip.left,
              width: blip.size,
              height: blip.size,
              borderRadius: "50%",
              bgcolor: blip.color,
              opacity: 0,
              animation: `environment-radar-blip 7s ease-out infinite`,
              animationDelay: blip.delay,
              "@keyframes environment-radar-blip": {
                "0%, 4%": { transform: "scale(0)", opacity: 0 },
                "10%": { transform: "scale(1.5)", opacity: 1 },
                "16%": { transform: "scale(1)", opacity: 0.95 },
                "88%": { transform: "scale(1)", opacity: 0.95 },
                "100%": { opacity: 0 },
              },
            }}
          />
        ))}

      {isComplete &&
        RADAR_BLIPS.map((blip, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: blip.top,
              left: blip.left,
              width: blip.size,
              height: blip.size,
              borderRadius: "50%",
              bgcolor: blip.color,
              opacity: 0.95,
            }}
          />
        ))}
    </Box>
  );
}
