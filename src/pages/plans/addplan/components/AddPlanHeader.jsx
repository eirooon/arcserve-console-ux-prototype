import PropTypes from "prop-types";
import { Box, Button, Divider, Typography } from "@mui/material";

/**
 * Title + primary actions bar for the Add Plan page (Figma node 6219:2729),
 * reused as-is for the Modify/View page (see useAddPlanWizard's `isEditing`)
 * — only the title and disabled state differ between the two.
 * Cancel/Next/Save stay visible on every step; only their enabled state
 * changes ("Save" is disabled until the Basic step's required fields are
 * filled, "Next" is disabled once on the last step). "Previous" only
 * appears once there's a prior step to go back to (i.e. not on Basic).
 */
export default function AddPlanHeader({
  isEditing,
  planName,
  onCancel,
  onPrevious,
  onNext,
  onSubmit,
  isFirstStep,
  isLastStep,
  canSubmit,
  saving,
}) {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
        borderBottom: "1px solid rgba(0,0,0,0.12)",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" component="h1">
        {isEditing ? planName || "Modify Protection Plan" : "New Protection Plan"}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {!isFirstStep && (
            <Button variant="outlined" color="secondary" onClick={onPrevious}>
              Previous
            </Button>
          )}
          <Button variant="outlined" color="secondary" onClick={onNext} disabled={isLastStep}>
            Next
          </Button>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
        <Button variant="contained" onClick={onSubmit} disabled={!canSubmit || saving}>
          Save
        </Button>
      </Box>
    </Box>
  );
}

AddPlanHeader.propTypes = {
  isEditing: PropTypes.bool,
  planName: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isFirstStep: PropTypes.bool.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  canSubmit: PropTypes.bool.isRequired,
  saving: PropTypes.bool,
};
