import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import StatusPill from "./StatusPill";

// Text shades are darker than the Figma swatches (e.g. orange/800 on
// orange/50 is ~2.9:1) so 13px labels meet WCAG AA contrast in light mode.
const TEXT_LIGHT_MODE = {
  success: "#1b5e20",
  warning: "#8a4200",
  info: "#0d47a1",
  error: "#b71c1c",
};

/** A soft (tonal) StatusPill in one of the theme's status colors. */
export default function TonePill({ tone, label }) {
  return (
    <StatusPill
      label={label}
      fontWeight={400}
      bgcolor={(theme) => alpha(theme.palette[tone].main, 0.12)}
      color={(theme) => (theme.palette.mode === "dark" ? theme.palette[tone].light : TEXT_LIGHT_MODE[tone])}
    />
  );
}

TonePill.propTypes = {
  tone: PropTypes.oneOf(Object.keys(TEXT_LIGHT_MODE)).isRequired,
  label: PropTypes.string.isRequired,
};
