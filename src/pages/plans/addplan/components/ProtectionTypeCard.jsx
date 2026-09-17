import PropTypes from "prop-types";
import { Box, Tooltip, Typography } from "@mui/material";

/**
 * One selectable card in the Basic step's Protection Type grid (Figma node
 * 6219:2901). Behaves as a radio option — see the `role="radiogroup"`
 * wrapper in BasicStep.jsx — rather than a plain button, since exactly one
 * protection type is chosen for the plan.
 */
export default function ProtectionTypeCard({ label, description, selected, onSelect }) {
  return (
    <Box
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      sx={{
        flex: 1,
        minWidth: 0,
        height: 120,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: selected ? "primary.main" : "rgba(0,0,0,0.12)",
        bgcolor: selected ? "rgba(138,43,255,0.04)" : "background.paper",
        cursor: "pointer",
        outlineOffset: 2,
        "&:hover": { borderColor: "primary.main" },
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 700, color: "#444" }}>
        {label}
      </Typography>
      <Tooltip title={description}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>
      </Tooltip>
    </Box>
  );
}

ProtectionTypeCard.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};
