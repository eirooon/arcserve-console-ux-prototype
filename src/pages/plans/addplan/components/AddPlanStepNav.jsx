import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

/**
 * Left sub-navigation for the Add Plan wizard (Figma node 6219:2743): one
 * entry per step, showing the active step highlighted, earlier (already
 * visited) steps checked off, and later steps disabled until reached.
 */
export default function AddPlanStepNav({ steps, stepId, stepIndex, onSelect }) {
  return (
    <Box
      component="nav"
      aria-label="Add Plan steps"
      sx={{
        width: 200,
        flexShrink: 0,
        bgcolor: "grey.50",
        borderRight: "1px solid rgba(0,0,0,0.12)",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {steps.map((step, index) => {
        const isActive = step.id === stepId;
        const isVisited = index < stepIndex;
        const isReachable = index <= stepIndex;

        return (
          <Box
            key={step.id}
            role="button"
            tabIndex={isReachable ? 0 : -1}
            aria-disabled={!isReachable}
            aria-current={isActive ? "step" : undefined}
            onClick={() => isReachable && onSelect(step.id)}
            onKeyDown={(event) => {
              if (!isReachable) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(step.id);
              }
            }}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              px: 2,
              py: 3,
              borderBottom: "1px solid rgba(0,0,0,0.12)",
              cursor: isReachable ? "pointer" : "default",
              ...(isActive && {
                bgcolor: "rgba(138,43,255,0.08)",
                borderTop: "1px solid rgba(138,43,255,0.5)",
                borderBottom: "1px solid rgba(138,43,255,0.5)",
                borderRight: "1px solid rgba(138,43,255,0.5)",
              }),
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: isActive
                    ? "primary.main"
                    : isReachable
                      ? "text.primary"
                      : "text.disabled",
                }}
              >
                {step.label}
              </Typography>
              {isActive && (
                <ChevronRightRoundedIcon fontSize="small" sx={{ color: "primary.main" }} />
              )}
              {!isActive && isVisited && (
                <CheckRoundedIcon fontSize="small" sx={{ color: "success.main" }} />
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{ color: isActive ? "primary.main" : "text.disabled" }}
            >
              {step.description}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

AddPlanStepNav.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  stepId: PropTypes.string.isRequired,
  stepIndex: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};
