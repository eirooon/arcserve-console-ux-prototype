import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * A filled green circle with a checkmark and a subtle pulsing glow, used to
 * mark a process as successfully complete (environment discovery, protection
 * intent activation, etc.). Purely presentational — callers control
 * placement/positioning around it.
 */
export default function GlowingCheckIcon({ size = 40, iconSize = 22 }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        bgcolor: "success.main",
        boxShadow: (theme) =>
          `0 0 0 6px ${alpha(theme.palette.success.main, 0.14)}, 0 0 18px ${alpha(theme.palette.success.main, 0.55)}`,
        animation: prefersReducedMotion
          ? "none"
          : "glowing-check-pulse 2.4s ease-in-out infinite",
        "@keyframes glowing-check-pulse": {
          "0%, 100%": {
            boxShadow: (theme) =>
              `0 0 0 6px ${alpha(theme.palette.success.main, 0.14)}, 0 0 14px ${alpha(theme.palette.success.main, 0.4)}`,
          },
          "50%": {
            boxShadow: (theme) =>
              `0 0 0 10px ${alpha(theme.palette.success.main, 0.2)}, 0 0 28px ${alpha(theme.palette.success.main, 0.75)}`,
          },
        },
      }}
    >
      <CheckRoundedIcon sx={{ color: "common.white", fontSize: iconSize }} />
    </Box>
  );
}

GlowingCheckIcon.propTypes = {
  size: PropTypes.number,
  iconSize: PropTypes.number,
};
