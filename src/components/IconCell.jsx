import PropTypes from "prop-types";
import { Box, Tooltip, Typography } from "@mui/material";

const EMPTY_DISPLAY = "-";

// Renders a single meaning-bearing icon in place of a raw enum string (e.g.
// a Type or Status column), with the human-readable label exposed either as
// a tooltip (sighted, hover/focus) plus an aria-label (screen readers) so an
// icon-only cell never loses meaning, or — when `showLabel` is set — as
// visible text next to the icon (e.g. a Status column that wants "icon +
// text", not just an icon). Falls back to a plain dash when no icon/label
// was resolved for the value. Used via the `iconColumn` grid column helper
// (see src/utils/iconColumn.jsx) — first built for the Sources table, now
// shared by any page that wants the same treatment.
export default function IconCell({ icon: Icon, label, color = "action.active", showLabel = false }) {
  if (!Icon || !label) return EMPTY_DISPLAY;

  // MUI icon components (e.g. GppGoodRounded) size themselves via a
  // `fontSize` *prop*. A plain SVG-asset icon component (e.g. imported via
  // vite-plugin-svgr) spreads unknown props straight onto the <svg> —
  // passing `fontSize` there would land as the literal SVG/CSS `font-size`
  // attribute (e.g. "small" ~= 13px) and fight a "1em" sizing convention, so
  // those size instead from the ambient font-size set on the wrapping Box.
  const isMuiIcon = Icon.muiName === "SvgIcon";
  const iconEl = <Icon aria-hidden="true" {...(isMuiIcon ? { fontSize: "small" } : {})} />;

  if (showLabel) {
    // The label is already visible text here, so the icon next to it is
    // purely decorative — it doesn't need its own tooltip/aria-label the
    // way the icon-only cell below does. `color` is scoped to the icon's own
    // box only (not the row container) so it doesn't cascade onto the text —
    // the label stays the normal body text color regardless of status.
    return (
      <Box sx={{ display: "flex", alignItems: "center", height: "100%", gap: 0.75 }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", fontSize: "20px", color }}>
          {iconEl}
        </Box>
        <Typography variant="body2" color="text.primary" noWrap>
          {label}
        </Typography>
      </Box>
    );
  }

  return (
    // This outer box fills the full cell height so the icon stays vertically
    // centered in the row (matching every other cell). It's deliberately
    // NOT what Tooltip anchors to — anchoring here would size the tooltip's
    // reference rect to the whole cell and place it over empty space instead
    // of the icon. The inner box below, sized to just the icon, is the
    // actual Tooltip child.
    <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
      <Tooltip title={label} placement="right">
        <Box
          role="img"
          aria-label={label}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "1.25rem",
            color,
          }}
        >
          {iconEl}
        </Box>
      </Tooltip>
    </Box>
  );
}

IconCell.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string,
  color: PropTypes.string,
  showLabel: PropTypes.bool,
};
