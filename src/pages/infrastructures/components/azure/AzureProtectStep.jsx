import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Alert, Box, Stack } from "@mui/material";
import GoalChecklist from "./GoalChecklist";
import { StepHeading } from "./AzureWizardParts";

const TITLE = "What do you want to use Azure for?";

/** Step 2 — Goal (Figma 10296:10088). */
const AzureProtectStep = forwardRef(function AzureProtectStep({ goals, onToggle, locked }, headingRef) {
  return (
    <Stack spacing={3}>
      <StepHeading ref={headingRef} title={TITLE} subtitle="Select all that apply." />
      {/* What's already created in Azure was made for these goals. */}
      <Box inert={locked} sx={{ opacity: locked ? 0.6 : 1 }}>
        <GoalChecklist goals={goals} onToggle={onToggle} ariaLabel={TITLE} />
      </Box>
      <Alert severity="info">
        {locked
          ? "Arcserve already created things in Azure for these goals. To change them, start over."
          : "Each next step creates what it needs in Azure only when you select its create button."}
      </Alert>
    </Stack>
  );
});

AzureProtectStep.propTypes = {
  goals: PropTypes.objectOf(PropTypes.bool).isRequired,
  onToggle: PropTypes.func.isRequired,
  locked: PropTypes.bool.isRequired,
};

export default AzureProtectStep;
