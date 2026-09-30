import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
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
import { useInfrastructureData } from "../../hooks/useInfrastructureData";
import { PENDING_ADMIN_STATUS } from "../../hooks/cloudServices";
import { useAzureAccountWizard } from "../../hooks/azure/useAzureAccountWizard";
import { azureProvisioningStore, useAzureProvisioning } from "../../hooks/azure/azureProvisioningStore";
import { sendAdminSetupLink } from "../../hooks/azure/azureAdminHandoff";
import AzureSignInStep from "./AzureSignInStep";
import AzureProtectStep from "./AzureProtectStep";
import AzureAppStep from "./AzureAppStep";
import AzurePermissionsStep from "./AzurePermissionsStep";
import AzureStorageStep from "./AzureStorageStep";
import AzureReviewStep from "./AzureReviewStep";
import AzureConnectingView from "./AzureConnectingView";
import AzureConnectedView from "./AzureConnectedView";
import SimulatedMicrosoftSignIn from "./SimulatedMicrosoftSignIn";
import CleanupConfirmDialog from "./CleanupConfirmDialog";
import { toastStore } from "../../../../api/toastStore";
import { smallControlsSx } from "./azureStyles";

const TITLE_ID = "azure-cloud-account-title";
const ADD_PLAN_PATH = "/plans/new";

const selectRows = (state) => ({ rows: state.rows });
// Simulated time for Azure to delete what a cancelled setup created.
const CLEANUP_MS = 1500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const PHASE_BY_STATUS = {
  idle: "wizard",
  running: "connecting",
  failed: "connecting",
  cleaningUp: "connecting",
  done: "connected",
};

// Mounted only while the dialog is open, so every "Add Cloud Account →
// Microsoft Azure" starts from a clean wizard (same reasoning as
// AcrsServerFormDialog). A provisioning run already in progress is global
// (azureProvisioningStore) and is picked back up instead.
function AzureWizardBody({ onClose, closeGuardRef }) {
  const navigate = useNavigate();
  const { rows } = useInfrastructureData(selectRows);
  const cloudAccounts = useMemo(() => rows.filter((row) => row.type === "cloud_account"), [rows]);

  const wizard = useAzureAccountWizard(cloudAccounts);
  const { state, derived, actions } = wizard;
  const provisioning = useAzureProvisioning();
  const phase = PHASE_BY_STATUS[provisioning.status];
  const headingRef = useRef(null);

  // Reopened on a run that was sent to the background: report it here again.
  useEffect(() => azureProvisioningStore.moveToForeground(), []);

  // Move focus to the new heading whenever the visible screen changes, so
  // keyboard and screen reader users land at the top of the new content.
  useEffect(() => {
    headingRef.current?.focus();
  }, [state.stepId, phase, provisioning.status, state.signIn.status]);

  const [sendingAdminLink, setSendingAdminLink] = useState(false);
  const handleSendAdminLink = useCallback(async () => {
    setSendingAdminLink(true);
    const pendingRow =
      derived.existingTenantAccount?.status === PENDING_ADMIN_STATUS ? derived.existingTenantAccount : null;
    await sendAdminSetupLink({ email: state.adminEmail, displayName: derived.displayName, existingPendingRow: pendingRow });
    setSendingAdminLink(false);
    actions.markAdminLinkSent(state.adminEmail.trim());
  }, [actions, derived.displayName, derived.existingTenantAccount, state.adminEmail]);

  const adminHandoff = {
    email: state.adminEmail,
    onEmailChange: actions.setAdminEmail,
    canSend: derived.canSendAdminLink,
    sending: sendingAdminLink,
    sentTo: state.adminLinkSentTo,
    onSend: handleSendAdminLink,
  };

  const [cleaningUp, setCleaningUp] = useState(false);
  const handleCleanUp = async () => {
    setCleaningUp(true);
    await azureProvisioningStore.cleanUp();
    onClose();
  };

  const { steps, stepIndex, primary } = derived;
  const stepId = steps[stepIndex].id;
  const handleNext = () => {
    if (primary.kind === "connect") azureProvisioningStore.start(derived.summary);
    else if (primary.kind === "create") actions.createForStep(stepId, derived.summary);
    else actions.goToStep(steps[stepIndex + 1].id);
  };

  // Cancel and Start Over ask what to do with anything steps already created
  // in Azure, instead of leaving it behind silently.
  const [cleanupIntent, setCleanupIntent] = useState(null); // "cancel" | "startOver" | null
  const [removing, setRemoving] = useState(false);
  const hasCreated = derived.createdItems.length > 0;
  const finishCleanupIntent = (intent) => {
    setCleanupIntent(null);
    if (intent === "cancel") onClose({ force: true });
    else actions.restart();
  };
  const handleRemoveCreated = async () => {
    const intent = cleanupIntent;
    setRemoving(true);
    await wait(CLEANUP_MS);
    setRemoving(false);
    toastStore.pushToast("Removed everything Arcserve created in Azure for this setup.", "info");
    finishCleanupIntent(intent);
  };
  const handleKeepCreated = () => {
    toastStore.pushToast("Kept what Arcserve created in Azure. You can remove it in the Azure portal.", "info");
    finishCleanupIntent(cleanupIntent);
  };
  const requestStartOver = () => (hasCreated ? setCleanupIntent("startOver") : actions.restart());

  // Lets the dialog's Escape / close button reach the same prompt.
  useEffect(() => {
    closeGuardRef.current = () => {
      if (phase !== "wizard" || !hasCreated) return false;
      setCleanupIntent("cancel");
      return true;
    };
  });

  const handleSetUpProtection = () => {
    onClose();
    navigate(ADD_PLAN_PATH);
  };

  let content;
  if (phase === "connecting") {
    content = <AzureConnectingView ref={headingRef} tasks={provisioning.tasks} status={provisioning.status} />;
  } else if (phase === "connected") {
    content = <AzureConnectedView ref={headingRef} summary={provisioning.summary} />;
  } else if (stepId === "signIn") {
    content = <AzureSignInStep ref={headingRef} wizard={wizard} />;
  } else if (stepId === "goal") {
    content = (
      <AzureProtectStep ref={headingRef} goals={state.goals} onToggle={actions.toggleGoal} locked={derived.locked.goal} />
    );
  } else if (stepId === "app") {
    content = <AzureAppStep ref={headingRef} wizard={wizard} onStartOver={requestStartOver} />;
  } else if (stepId === "permissions") {
    content = (
      <AzurePermissionsStep ref={headingRef} wizard={wizard} adminHandoff={adminHandoff} onStartOver={requestStartOver} />
    );
  } else if (stepId === "storage") {
    content = (
      <AzureStorageStep
        ref={headingRef}
        location={state.location}
        errors={derived.locationErrors}
        appWritesToStorage={derived.needs.protectsVms}
        onFieldChange={actions.setLocationField}
        showSubscription={!derived.needs.needsApp}
        subscriptionId={state.subscriptionId}
        onSubscriptionChange={actions.setSubscription}
        creation={state.creation.storage}
        locked={derived.locked.storage}
      />
    );
  } else {
    content = (
      <AzureReviewStep
        ref={headingRef}
        summary={derived.summary}
        displayNameError={derived.displayNameError}
        updatingExisting={derived.updatingExisting}
        onDisplayNameChange={actions.setDisplayName}
      />
    );
  }

  const inBackgroundablePhase = provisioning.status === "running";

  return (
    <>
      <DialogTitle id={TITLE_ID} component="div" sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
        <Typography component="h2" variant="body1" sx={{ fontWeight: 700, flex: 1 }}>
          Add Cloud Account - Microsoft Azure
        </Typography>
        <IconButton
          onClick={() => onClose()}
          aria-label={inBackgroundablePhase ? "Close and continue in background" : "Close dialog"}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {phase === "wizard" && (
        <Box sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
          <Stepper
            activeStep={stepIndex}
            aria-label="Setup progress"
            sx={{
              "& .MuiStep-root": { flex: "0 0 auto", px: 0 },
              // Up to six steps fit the 720px dialog: connectors shrink first.
              "& .MuiStepConnector-root": { flex: "0 1 24px", mx: 1, minWidth: 8 },
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.id} completed={index < stepIndex}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      <DialogContent dividers sx={{ p: 3, ...smallControlsSx }}>
        {content}
      </DialogContent>

      <DialogActions
        sx={{ px: 3, py: 2, justifyContent: provisioning.status === "running" || phase === "connected" ? "flex-end" : "space-between" }}
      >
        {phase === "wizard" && (
          <>
            <Button variant="outlined" color="secondary" onClick={() => onClose()} disabled={derived.busyCreating}>
              {state.adminLinkSentTo ? "Close" : "Cancel"}
            </Button>
            <Stack direction="row" spacing={1}>
              {stepIndex > 0 && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => actions.goToStep(steps[stepIndex - 1].id)}
                  disabled={derived.busyCreating}
                >
                  Previous
                </Button>
              )}
              <Button variant="contained" onClick={handleNext} disabled={!primary.enabled}>
                {primary.label}
              </Button>
            </Stack>
          </>
        )}
        {provisioning.status === "running" && (
          <Button variant="outlined" color="secondary" onClick={() => onClose()}>
            Continue in Background
          </Button>
        )}
        {(provisioning.status === "failed" || provisioning.status === "cleaningUp") && (
          <>
            <Button variant="outlined" color="secondary" onClick={handleCleanUp} disabled={cleaningUp}>
              Clean Up and Cancel
            </Button>
            <Button variant="contained" onClick={azureProvisioningStore.retry} disabled={cleaningUp}>
              Retry
            </Button>
          </>
        )}
        {phase === "connected" && (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="secondary" onClick={() => onClose()}>
              Done
            </Button>
            <Button variant="contained" onClick={handleSetUpProtection}>
              {provisioning.summary.backsUpVms ? "Protect VMs Now" : "Set Up Protection"}
            </Button>
          </Stack>
        )}
      </DialogActions>

      <SimulatedMicrosoftSignIn open={state.pickerOpen} onPick={actions.pickAccount} onClose={actions.closePicker} />
      <CleanupConfirmDialog
        intent={cleanupIntent}
        items={derived.createdItems}
        removing={removing}
        onRemove={handleRemoveCreated}
        onKeep={handleKeepCreated}
        onBack={() => setCleanupIntent(null)}
      />
    </>
  );
}

AzureWizardBody.propTypes = {
  onClose: PropTypes.func.isRequired,
  closeGuardRef: PropTypes.shape({ current: PropTypes.func }).isRequired,
};

/**
 * "Add Cloud Account - Microsoft Azure" wizard (Figma "UXD-17 Skyline").
 * Sign In → Goal → [App → Permissions] → [Storage] → Review → Connecting →
 * Connected; the bracketed steps only appear when a chosen goal needs them,
 * and each creates its part in Azure from its own button.
 */
export default function AzureCloudAccountWizard({ open, onClose }) {
  // Set by the body: returns true when it handled the close itself (asking
  // what to do with things already created in Azure).
  const closeGuardRef = useRef(null);

  // Every way out goes through here: closing mid-setup keeps the run going
  // in the background, closing after it finished clears it so the next
  // wizard starts fresh. A failed run is kept, so reopening shows Retry.
  const requestClose = ({ force = false } = {}) => {
    if (!force && closeGuardRef.current?.()) return;
    const { status } = azureProvisioningStore.getSnapshot();
    if (status === "running" || status === "failed") azureProvisioningStore.moveToBackground();
    if (status === "done") azureProvisioningStore.reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      // A backdrop click shouldn't throw away a half-finished setup; Escape
      // and the close button still work.
      onClose={(_event, reason) => {
        if (reason !== "backdropClick") requestClose();
      }}
      maxWidth={false}
      fullWidth
      slotProps={{ paper: { sx: { maxWidth: 720 } } }}
      aria-labelledby={TITLE_ID}
    >
      {open && <AzureWizardBody onClose={requestClose} closeGuardRef={closeGuardRef} />}
    </Dialog>
  );
}

AzureCloudAccountWizard.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
