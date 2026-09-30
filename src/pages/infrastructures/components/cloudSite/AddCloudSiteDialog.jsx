import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toastStore } from "../../../../api/toastStore";
import { useAddCloudSite } from "../../hooks/cloudSite/useAddCloudSite";
import { useFieldRefs } from "../../hooks/cloudSite/useFieldRefs";
import { smallControlsSx } from "../azure/azureStyles";
import SitePropertiesStep from "./SitePropertiesStep";
import CloudSiteSummaryStep from "./CloudSiteSummaryStep";

const TITLE_ID = "add-cloud-site-title";

// No help content exists for this flow yet; say so rather than doing nothing.
const showHelp = () => toastStore.pushToast("Help for adding a cloud site isn't available yet.", "info");

// Completed steps show a green check and label (Figma Summary frame).
const stepperSx = {
  "& .MuiStep-root": { flex: "0 0 auto", px: 0 },
  "& .MuiStepConnector-root": { flex: "0 1 80px", mx: 1, minWidth: 8 },
  "& .MuiStepIcon-root.Mui-completed": { color: "success.main" },
  "& .MuiStepLabel-label.Mui-completed": { color: "success.main" },
};

// Mounted only while the dialog is open, so every open starts from a blank form.
function AddCloudSiteBody({ onClose, busyRef }) {
  const wizard = useAddCloudSite();
  const { register, focus } = useFieldRefs();
  const statusRef = useRef(null);
  const onSummary = wizard.stepIndex === 1;

  // Esc can't abandon a site mid-creation (see AddCloudSiteDialog).
  useEffect(() => {
    busyRef.current = wizard.configuring;
  }, [busyRef, wizard.configuring]);

  // Announce the result by moving focus to the Summary status line.
  useEffect(() => {
    if (onSummary) statusRef.current?.focus();
  }, [onSummary]);

  const handleNext = async () => {
    const invalidField = await wizard.configure();
    if (invalidField) focus(invalidField);
  };

  return (
    <>
      <DialogTitle component="div" sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
        <Typography id={TITLE_ID} component="h2" variant="h6" sx={{ flex: 1 }}>
          Add Cloud Site
        </Typography>
        <IconButton onClick={onClose} aria-label="Close dialog" size="small" disabled={wizard.configuring}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
        <Stepper activeStep={wizard.stepIndex} aria-label="Add cloud site progress" sx={stepperSx}>
          {wizard.steps.map((step, index) => (
            <Step key={step.id} completed={index < wizard.stepIndex}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent dividers sx={{ p: 3, ...smallControlsSx }}>
        {onSummary ? (
          <CloudSiteSummaryStep
            ref={statusRef}
            values={wizard.values}
            estimatedCost={wizard.estimatedCost}
            authCode={wizard.authCode}
          />
        ) : (
          <SitePropertiesStep
            values={wizard.values}
            errors={wizard.errors}
            estimatedCost={wizard.estimatedCost}
            cloudAccountOptions={wizard.cloudAccountOptions}
            onFieldChange={wizard.setField}
            onFieldBlur={wizard.touchField}
            registerField={register}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button variant="outlined" color="secondary" onClick={showHelp}>
          Help
        </Button>
        {onSummary ? (
          <Button variant="contained" onClick={onClose}>
            Finish
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="secondary" onClick={onClose} disabled={wizard.configuring}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={wizard.configuring}
              startIcon={wizard.configuring ? <CircularProgress size={16} color="inherit" aria-hidden /> : undefined}
            >
              {wizard.configuring ? "Configuring…" : "Next"}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </>
  );
}

AddCloudSiteBody.propTypes = {
  onClose: PropTypes.func.isRequired,
  busyRef: PropTypes.shape({ current: PropTypes.bool }).isRequired,
};

/**
 * "Add Cloud Site" wizard: Site Properties (Figma node 7321:8644) → Next
 * configures the site, which appears in the Sites table as "Deploying" →
 * Summary (node 6391:3528) with the gateway authorization code.
 * Clicking the backdrop doesn't close it, so a long form isn't lost to a
 * stray click; Esc, Cancel/Finish and the close button do, except while the
 * site is being configured.
 */
export default function AddCloudSiteDialog({ open, onClose }) {
  const busyRef = useRef(false);

  const handleClose = (_event, reason) => {
    if (reason === "backdropClick" || busyRef.current) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth aria-labelledby={TITLE_ID}>
      {open && <AddCloudSiteBody onClose={onClose} busyRef={busyRef} />}
    </Dialog>
  );
}

AddCloudSiteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
