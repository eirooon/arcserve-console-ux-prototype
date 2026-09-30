import { useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import { smallControlsSx } from "../azureStyles";

const TITLE_ID = "azure-disconnect-title";

function RemoveOption({ checked, onChange, label, description }) {
  return (
    <FormControlLabel
      sx={{ alignItems: "flex-start", m: 0, gap: 2 }}
      control={<Checkbox size="small" checked={checked} onChange={onChange} sx={{ p: 0, mt: "1px" }} />}
      label={
        <Stack spacing={0.5}>
          <Typography variant="body2">{label}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </Stack>
      }
    />
  );
}

RemoveOption.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

// Mounted only while open, so every Disconnect starts from the safe defaults.
// Arcserve only deletes what it created; an app or role an Azure admin set
// up only loses Arcserve's role assignments.
function describeAppRemoval(app, role) {
  const label = app.isNew
    ? `App registration ${app.name}${role?.isNew ? ` and custom role ${role.name}` : ""}`
    : `Role assignments for ${app.name}${role?.isNew ? ` and custom role ${role.name}` : ""}`;
  const description = app.isNew
    ? "Arcserve can no longer sign in to Azure. Reconnecting later sets these up again."
    : "The app itself stays, because your Azure admin created it. Arcserve can no longer use it.";
  return { label, description };
}

function DisconnectBody({ accountName, app, role, storageAccount, policyCount, busy, onClose, onConfirm }) {
  // Removing the app identity is safe (nothing else uses it); deleting the
  // storage account deletes backups, so it's never on by default.
  const [removeAppIdentity, setRemoveAppIdentity] = useState(Boolean(app));
  const appRemoval = app ? describeAppRemoval(app, role) : null;
  const [removeStorage, setRemoveStorage] = useState(false);

  return (
    <>
      <DialogTitle id={TITLE_ID}>Disconnect {accountName}?</DialogTitle>
      <DialogContent dividers sx={smallControlsSx}>
        <Stack spacing={3}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Arcserve stops all backups for this account.
            {policyCount > 0 &&
              ` ${policyCount} ${policyCount === 1 ? "policy uses" : "policies use"} it and will stop running.`}
          </Typography>
          <Stack spacing={1.5}>
            <Typography id="azure-disconnect-remove" variant="body2" sx={{ fontWeight: 500 }}>
              Also remove from Azure
            </Typography>
            <FormGroup aria-labelledby="azure-disconnect-remove" sx={{ gap: 2 }}>
              {appRemoval && (
                <RemoveOption
                  checked={removeAppIdentity}
                  onChange={(event) => setRemoveAppIdentity(event.target.checked)}
                  label={appRemoval.label}
                  description={appRemoval.description}
                />
              )}
              {storageAccount && (
                <RemoveOption
                  checked={removeStorage}
                  onChange={(event) => setRemoveStorage(event.target.checked)}
                  label={`Storage account ${storageAccount}`}
                  description="Includes every backup stored in it."
                />
              )}
            </FormGroup>
          </Stack>
          {removeStorage && (
            <Alert severity="error" role="alert">
              Backups in {storageAccount} are permanently deleted. You can’t restore from them afterwards.
            </Alert>
          )}
          {!removeAppIdentity && !removeStorage && (
            <Alert severity="info">Nothing is deleted from Azure. You can remove these resources in Azure later.</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button variant="outlined" color="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => onConfirm({ removeAppIdentity, removeStorage })}
          disabled={busy}
        >
          {busy ? "Disconnecting…" : "Disconnect"}
        </Button>
      </DialogActions>
    </>
  );
}

DisconnectBody.propTypes = {
  accountName: PropTypes.string.isRequired,
  app: PropTypes.shape({ name: PropTypes.string.isRequired, isNew: PropTypes.bool }),
  role: PropTypes.shape({ name: PropTypes.string.isRequired, isNew: PropTypes.bool }),
  storageAccount: PropTypes.string,
  policyCount: PropTypes.number,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

/** "Disconnect this account" → Disconnect on the account page. */
export default function DisconnectDialog({ open, busy, onClose, ...bodyProps }) {
  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} maxWidth="sm" fullWidth aria-labelledby={TITLE_ID}>
      {open && <DisconnectBody busy={busy} onClose={onClose} {...bodyProps} />}
    </Dialog>
  );
}

DisconnectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
