import { useState } from "react";
import PropTypes from "prop-types";
import { Alert, Box, Button, CircularProgress, RadioGroup, Stack, Typography } from "@mui/material";
import PasswordField from "../../../../../components/PasswordField";
import { isAcceptedSecret } from "../../../hooks/azure/useAzureAccountWizard";
import { useAzureSignInGate, useSimulatedCheck } from "../../../hooks/azure/useAzureSignInGate";
import { AccessCheck, OptionCard } from "../AzureWizardParts";
import SecretExpiryField from "../SecretExpiryField";
import AzureSignInGate from "./AzureSignInGate";
import { DetailsDialog, DetailsDialogLayout } from "./DetailsDialog";

const TITLE_ID = "azure-replace-secret-title";
const NO_RIGHTS = [];
const OWNER_RIGHTS = ["appOwner"];

function ReplaceSecretBody({ app, subscriptionId, expired, busy, onClose, onSave }) {
  const [mode, setMode] = useState("new");
  const [expiryMonths, setExpiryMonths] = useState(12);
  const [value, setValue] = useState("");
  const validation = useSimulatedCheck();

  // Arcserve can add secrets to an app it created; for an admin's app, only
  // one of its owners can.
  const gate = useAzureSignInGate(mode === "new" && !app.isNew ? OWNER_RIGHTS : NO_RIGHTS, {
    subscriptionId,
    appName: app.name,
  });

  const canSave = mode === "new" ? gate.allAllowed : validation.status === "allowed";

  return (
    <DetailsDialogLayout
      titleId={TITLE_ID}
      title="Replace Client Secret"
      busy={busy}
      onClose={onClose}
      primaryLabel="Replace Secret"
      busyLabel="Replacing…"
      canSave={canSave}
      onSave={() => onSave({ mode, value, expiryMonths })}
    >
      <Stack spacing={3}>
        {expired ? (
          <Alert severity="error">The current secret has expired, so Arcserve can’t sign in to Azure as {app.name}.</Alert>
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Arcserve switches to the new secret right away. The old one keeps working until it expires or you delete it
            in Azure.
          </Typography>
        )}
        <RadioGroup aria-label="New client secret" value={mode} onChange={(event) => setMode(event.target.value)} sx={{ gap: 2.5 }}>
          <OptionCard
            value="new"
            selected={mode === "new"}
            onSelect={setMode}
            title="Create a new secret"
            description={
              app.isNew
                ? `Arcserve created ${app.name}, so it can add the secret itself.`
                : `Arcserve adds a secret to ${app.name}. Needs an owner of the app to sign in.`
            }
          >
            <Stack spacing={2} sx={{ pt: 1 }}>
              <AzureSignInGate gate={gate} reason={`Only an owner of ${app.name} can add a secret to it.`} />
              <SecretExpiryField value={expiryMonths} onChange={setExpiryMonths} />
            </Stack>
          </OptionCard>
          <OptionCard
            value="existing"
            selected={mode === "existing"}
            onSelect={setMode}
            title="Enter a secret from Azure"
            description="Paste the Value of a secret you or your Azure admin created in the app’s Certificates & secrets page."
          >
            <Stack spacing={1.5} sx={{ pt: 1 }}>
              <Box
                component="form"
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  if (value.trim()) validation.run(() => isAcceptedSecret(value));
                }}
                sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}
              >
                <PasswordField
                  label="Client Secret Value"
                  placeholder="Paste secret value"
                  value={value}
                  onChange={(next) => {
                    setValue(next);
                    validation.reset();
                  }}
                  sx={{ flex: 1 }}
                />
                <Button
                  type="submit"
                  variant="outlined"
                  color="secondary"
                  disabled={!value.trim() || validation.status === "checking"}
                  startIcon={validation.status === "checking" ? <CircularProgress size={16} color="inherit" /> : undefined}
                  sx={{ flexShrink: 0 }}
                >
                  Validate
                </Button>
              </Box>
              <AccessCheck
                result={validation.status}
                checkingLabel="Validating the secret with Azure…"
                allowedLabel={`Secret accepted. Arcserve can sign in as ${app.name}.`}
                denied={
                  <Alert severity="error" role="alert">
                    Azure didn’t accept this secret. Copy the secret’s Value, not its Secret ID, and check it hasn’t
                    expired.
                  </Alert>
                }
              />
            </Stack>
          </OptionCard>
        </RadioGroup>
      </Stack>
    </DetailsDialogLayout>
  );
}

ReplaceSecretBody.propTypes = {
  app: PropTypes.shape({ name: PropTypes.string.isRequired, isNew: PropTypes.bool }).isRequired,
  subscriptionId: PropTypes.string,
  expired: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

/** App Identity → Client Secret → Replace on the account page. */
export default function ReplaceSecretDialog({ open, busy, onClose, ...bodyProps }) {
  return (
    <DetailsDialog open={open} titleId={TITLE_ID} busy={busy} onClose={onClose}>
      <ReplaceSecretBody busy={busy} onClose={onClose} {...bodyProps} />
    </DetailsDialog>
  );
}

ReplaceSecretDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
