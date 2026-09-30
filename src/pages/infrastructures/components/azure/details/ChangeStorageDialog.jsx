import { useState } from "react";
import PropTypes from "prop-types";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useDirtyState } from "../../../../../hooks/useDirtyState";
import { EXISTING_STORAGE_ACCOUNTS } from "../../../hooks/azure/azureMockData";
import { STORAGE_NAME_RULE, isValidStorageAccountName } from "../../../hooks/azure/useAzureAccountWizard";
import NewOrExistingField from "../NewOrExistingField";
import { smallControlsSx } from "../azureStyles";

const TITLE_ID = "azure-change-storage-title";

// Mounted only while open, so every Change starts clean.
function ChangeStorageBody({ current, resourceGroup, busy, onClose, onSave }) {
  const { dirty, track } = useDirtyState();
  const [mode, setMode] = useState("new");
  const [newName, setNewName] = useState("");
  const [existing, setExisting] = useState("");

  // Every existing account except the one already in use.
  const existingOptions = EXISTING_STORAGE_ACCOUNTS.filter((name) => name !== current);
  const target = mode === "new" ? newName.trim() : existing;
  const newNameError =
    mode === "new" && newName !== "" && !isValidStorageAccountName(newName.trim()) ? STORAGE_NAME_RULE : undefined;
  const sameAsCurrent = target === current;
  const valid = mode === "new" ? isValidStorageAccountName(target) : Boolean(existing);

  return (
    <>
      <DialogTitle id={TITLE_ID}>Change Storage Account</DialogTitle>
      <DialogContent dividers sx={smallControlsSx}>
        <Stack spacing={3}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Currently <strong>{current}</strong>. New backups go to the storage account you choose. Existing backups stay
            where they are.
          </Typography>
          <NewOrExistingField
            label="Storage Account for Backup Data"
            existingLabel="Existing Storage Account"
            existingPlaceholder="Select storage account"
            mode={mode}
            onModeChange={track(setMode)}
            newLabel="New Storage Account Name"
            newPlaceholder="Enter storage account name"
            newValue={newName}
            onNewChange={track(setNewName)}
            newError={sameAsCurrent ? "This is already the storage account in use." : newNameError}
            existingOptions={existingOptions}
            existingValue={existing}
            onExistingChange={track(setExisting)}
          />
          {mode === "new" && (
            <Alert severity="info">Arcserve creates this storage account in {resourceGroup} when you save.</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button variant="outlined" color="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => onSave(target)} disabled={!dirty || !valid || sameAsCurrent || busy}>
          {busy ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </>
  );
}

ChangeStorageBody.propTypes = {
  current: PropTypes.string.isRequired,
  resourceGroup: PropTypes.string.isRequired,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

/** Location → Storage Account → Change on the account page. */
export default function ChangeStorageDialog({ open, busy, onClose, ...bodyProps }) {
  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} maxWidth="sm" fullWidth aria-labelledby={TITLE_ID}>
      {open && <ChangeStorageBody busy={busy} onClose={onClose} {...bodyProps} />}
    </Dialog>
  );
}

ChangeStorageDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
