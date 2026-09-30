import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useDirtyState } from "../../../../../hooks/useDirtyState";
import {
  APP_REGISTRATION_NAME,
  AZURE_SERVICES,
  CUSTOM_ROLE_NAME,
  GOAL_OPTIONS,
  LOCATION_DEFAULTS,
} from "../../../hooks/azure/azureMockData";
import { describeGoalChange } from "../../../hooks/azure/useAzureAccountDetails";
import { useAzureSignInGate } from "../../../hooks/azure/useAzureSignInGate";
import AzureSignInGate from "./AzureSignInGate";
import ShortActionList from "../ShortActionList";
import GoalChecklist from "../GoalChecklist";
import { smallControlsSx } from "../azureStyles";

const TITLE_ID = "azure-edit-goals-title";

const listServices = (services) => services.map((service) => AZURE_SERVICES[service]).join(" and ");
const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

// Plain-language preview of what saving does in Azure.
function ChangePreview({ change, appName, storageAccount, role }) {
  // Arcserve edits only its own custom role; an admin's role must already have them.
  const ownRole = !role || role.isNew;
  const lines = [];
  if (change.createsApp) {
    lines.push(`Creates app registration ${APP_REGISTRATION_NAME} and custom role ${CUSTOM_ROLE_NAME}.`);
  }
  if (change.stopsUsingApp && appName) {
    lines.push(`Arcserve stops using app registration ${appName}. It stays in Azure.`);
  }
  if (change.addedServices.length) {
    lines.push(
      ownRole
        ? `Adds ${plural(change.addedActionCount, "permission")} for ${listServices(change.addedServices)} to ${role?.name ?? CUSTOM_ROLE_NAME}.`
        : `Uses ${plural(change.addedActionCount, "more permission")} for ${listServices(change.addedServices)} from ${role.name}.`,
    );
  }
  if (change.removedServices.length) {
    lines.push(
      ownRole
        ? `Removes ${plural(change.removedActionCount, "permission")} for ${listServices(change.removedServices)} from ${role?.name ?? CUSTOM_ROLE_NAME}.`
        : `Stops using ${plural(change.removedActionCount, "permission")} for ${listServices(change.removedServices)}. ${role.name} itself isn’t changed.`,
    );
  }
  if (change.createsStorage) {
    lines.push(
      `Creates storage account ${LOCATION_DEFAULTS.storageAccountName} in resource group ${LOCATION_DEFAULTS.resourceGroupName} for backup data.`,
    );
  }
  if (change.stopsUsingStorage && storageAccount) {
    lines.push(`Storage account ${storageAccount} and the backups in it stay in Azure.`);
  }
  if (lines.length === 0) {
    return <Alert severity="info">No permission changes are needed in Azure.</Alert>;
  }
  return (
    <Alert severity="info" role="status">
      <Stack spacing={0.5}>
        {lines.map((line) => (
          <Typography key={line} variant="body2" color="inherit">
            {line}
          </Typography>
        ))}
      </Stack>
    </Alert>
  );
}

ChangePreview.propTypes = {
  change: PropTypes.object.isRequired,
  appName: PropTypes.string,
  storageAccount: PropTypes.string,
  role: PropTypes.shape({ name: PropTypes.string, isNew: PropTypes.bool }),
};

// Mounted only while open, so every Edit starts from the saved goals.
function EditGoalsBody({ goals: savedGoals, appName, storageAccount, role, subscriptionId, busy, onClose, onSave }) {
  const { dirty, track } = useDirtyState();
  const [goals, setGoals] = useState(savedGoals);
  const toggle = track((key) => setGoals((current) => ({ ...current, [key]: !current[key] })));

  const change = useMemo(
    () =>
      describeGoalChange(savedGoals, goals, { hasApp: Boolean(appName), hasStorage: Boolean(storageAccount), role }),
    [savedGoals, goals, appName, storageAccount, role],
  );
  // Only changes to apps, roles or role assignments need someone to sign in.
  const gate = useAzureSignInGate(change.requiredRights, { subscriptionId });
  const roleGap = change.missingRoleActions;
  const anySelected = GOAL_OPTIONS.some((goal) => goals[goal.key]);
  const changed = GOAL_OPTIONS.some((goal) => Boolean(goals[goal.key]) !== Boolean(savedGoals[goal.key]));

  return (
    <>
      <DialogTitle id={TITLE_ID}>Using Azure for</DialogTitle>
      <DialogContent dividers sx={smallControlsSx}>
        <Stack spacing={3}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Select all that apply. Arcserve updates its permissions in Azure to match.
          </Typography>
          <GoalChecklist goals={goals} onToggle={toggle} ariaLabel="What do you want to use Azure for?" />
          {anySelected && (
            <ChangePreview change={change} appName={appName} storageAccount={storageAccount} role={role} />
          )}
          {roleGap.length > 0 && (
            <Alert severity="error" role="alert">
              <AlertTitle>{role.name} doesn’t have the permissions this needs</AlertTitle>
              Your Azure admin manages this role, so Arcserve can’t add to it. Change the role in Permissions first, or
              ask your admin to add:
              <ShortActionList
                actions={roleGap}
                dialogTitle={`Missing from ${role.name} (${roleGap.length})`}
                dialogDescription="Permissions the new goals need that this role doesn’t grant."
              />
            </Alert>
          )}
          {anySelected && changed && roleGap.length === 0 && (
            <AzureSignInGate gate={gate} reason="This change updates apps or roles in Azure." />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button variant="outlined" color="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => onSave(goals)} disabled={!dirty || !changed || !anySelected || roleGap.length > 0 || !gate.allAllowed || busy}>
          {busy ? "Updating Azure…" : "Save"}
        </Button>
      </DialogActions>
    </>
  );
}

EditGoalsBody.propTypes = {
  goals: PropTypes.objectOf(PropTypes.bool).isRequired,
  appName: PropTypes.string,
  storageAccount: PropTypes.string,
  role: PropTypes.shape({ name: PropTypes.string, isNew: PropTypes.bool }),
  subscriptionId: PropTypes.string,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

/** "Using Azure for" → Edit on the account page. */
export default function EditGoalsDialog({ open, busy, onClose, ...bodyProps }) {
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      maxWidth={false}
      fullWidth
      slotProps={{ paper: { sx: { maxWidth: 720 } } }}
      aria-labelledby={TITLE_ID}
    >
      {open && <EditGoalsBody busy={busy} onClose={onClose} {...bodyProps} />}
    </Dialog>
  );
}

EditGoalsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
