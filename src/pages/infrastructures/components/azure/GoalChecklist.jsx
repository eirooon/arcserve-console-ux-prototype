import PropTypes from "prop-types";
import { Box, Checkbox, FormControlLabel, FormGroup, FormHelperText, Stack, Typography } from "@mui/material";
import { AZURE_SERVICES, GOAL_OPTIONS } from "../../hooks/azure/azureMockData";

/**
 * "What do you want to use Azure for?" checkboxes — shared by the wizard's
 * Goal step and the account page's "Using Azure for" Edit dialog.
 */
export default function GoalChecklist({ goals, onToggle, ariaLabel }) {
  const noneSelected = !GOAL_OPTIONS.some((goal) => goals[goal.key]);
  return (
    <FormGroup aria-label={ariaLabel} sx={{ gap: 2 }}>
      {GOAL_OPTIONS.map((goal) => (
        <FormControlLabel
          key={goal.key}
          sx={{ alignItems: "flex-start", m: 0, gap: 2 }}
          control={
            <Checkbox size="small" checked={goals[goal.key]} onChange={() => onToggle(goal.key)} sx={{ p: 0, mt: "1px" }} />
          }
          label={
            <Stack spacing={0.5}>
              <Typography variant="body2">{goal.label}</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {goal.description}
              </Typography>
              <Box component="span" sx={{ typography: "body2", color: "text.disabled" }}>
                Uses: {goal.uses.map((service) => AZURE_SERVICES[service]).join(", ")}
              </Box>
            </Stack>
          }
        />
      ))}
      {noneSelected && <FormHelperText error>Select at least one to continue.</FormHelperText>}
    </FormGroup>
  );
}

GoalChecklist.propTypes = {
  goals: PropTypes.objectOf(PropTypes.bool).isRequired,
  onToggle: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};
