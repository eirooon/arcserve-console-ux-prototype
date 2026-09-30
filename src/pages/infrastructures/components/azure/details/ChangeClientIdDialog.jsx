import { useState } from "react";
import PropTypes from "prop-types";
import { Alert, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import FormField from "../../../../../components/FormField";
import PasswordField from "../../../../../components/PasswordField";
import { useDirtyState } from "../../../../../hooks/useDirtyState";
import { isValidClientId } from "../../../hooks/azure/useAzureAccountDetails";
import { useSimulatedCheck } from "../../../hooks/azure/useAzureSignInGate";
import { isAcceptedSecret } from "../../../hooks/azure/useAzureAccountWizard";
import { AccessCheck } from "../AzureWizardParts";
import { DetailsDialog, DetailsDialogLayout } from "./DetailsDialog";

const TITLE_ID = "azure-change-client-id-title";

// Switching to another app registration: a secret belongs to one app, so
// the new Client ID always comes with that app's secret, validated together.
function ChangeClientIdBody({ current, busy, onClose, onSave }) {
  const { dirty, track } = useDirtyState();
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const validation = useSimulatedCheck();

  const idError = clientId.trim() && !isValidClientId(clientId) ? "Use the app’s Application (client) ID, a GUID." : null;
  const sameAsCurrent = clientId.trim().toLowerCase() === current.toLowerCase();
  const canValidate = isValidClientId(clientId) && !sameAsCurrent && clientSecret.trim() !== "";
  const edit = (setter) => (value) => {
    track(setter)(value);
    validation.reset();
  };

  return (
    <DetailsDialogLayout
      titleId={TITLE_ID}
      title="Change Client ID"
      busy={busy}
      onClose={onClose}
      primaryLabel="Save"
      busyLabel="Saving…"
      canSave={dirty && validation.status === "allowed"}
      onSave={() => onSave({ clientId, clientSecret })}
    >
      <Stack spacing={2.5}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Currently <strong>{current}</strong>. Arcserve will sign in to Azure as the app with this Client ID, so it
          needs that app’s client secret too. The app must already have the role Arcserve needs.
        </Typography>
        <FormField label="Application (Client) ID">
          <TextField
            size="small"
            fullWidth
            placeholder="e.g. 7d2f9a41-3c8e-4b6d-a1f0-9e5c2b8d4a73"
            value={clientId}
            onChange={(event) => edit(setClientId)(event.target.value)}
            error={Boolean(idError) || sameAsCurrent}
            helperText={sameAsCurrent ? "This is already the Client ID in use." : idError}
          />
        </FormField>
        <PasswordField
          label="Client Secret Value"
          placeholder="Paste secret value"
          value={clientSecret}
          onChange={edit(setClientSecret)}
        />
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Button
            variant="outlined"
            color="secondary"
            disabled={!canValidate || validation.status === "checking"}
            startIcon={validation.status === "checking" ? <CircularProgress size={16} color="inherit" /> : undefined}
            onClick={() => validation.run(() => isAcceptedSecret(clientSecret))}
          >
            Validate
          </Button>
          <AccessCheck
            result={validation.status}
            checkingLabel="Signing in to Azure with this Client ID and secret…"
            allowedLabel="Accepted. Arcserve can sign in as this app."
            denied={<span />}
          />
        </Stack>
        {validation.status === "denied" && (
          <Alert severity="error" role="alert">
            Azure didn’t accept this Client ID and secret. Check they belong to the same app, and that the secret
            hasn’t expired.
          </Alert>
        )}
      </Stack>
    </DetailsDialogLayout>
  );
}

ChangeClientIdBody.propTypes = {
  current: PropTypes.string.isRequired,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

/** App Identity → Client ID → Change on the account page. */
export default function ChangeClientIdDialog({ open, busy, onClose, ...bodyProps }) {
  return (
    <DetailsDialog open={open} titleId={TITLE_ID} busy={busy} onClose={onClose}>
      <ChangeClientIdBody busy={busy} onClose={onClose} {...bodyProps} />
    </DetailsDialog>
  );
}

ChangeClientIdDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
