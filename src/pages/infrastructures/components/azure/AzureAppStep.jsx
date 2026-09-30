import { forwardRef } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FormField from "../../../../components/FormField";
import PasswordField from "../../../../components/PasswordField";
import PlaceholderSelect from "../../../../components/PlaceholderSelect";
import { EXISTING_APPS, TENANT } from "../../hooks/azure/azureMockData";
import SecretExpiryField from "./SecretExpiryField";
import StepCreationStatus from "./StepCreationStatus";
import { AccessCheck, OptionCard, StepHeading } from "./AzureWizardParts";
import { SMALL_SELECT_PROPS } from "./azureStyles";

function RecoveryActions({ children }) {
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
      {children}
    </Stack>
  );
}

RecoveryActions.propTypes = { children: PropTypes.node.isRequired };

/**
 * App Identity step (engineering feedback #1 and #3): create a new app, or
 * use one an Azure admin already created — then create a client secret for
 * it or enter an existing one to validate. The account's rights (register
 * apps, own the app) aren't pre-checked: a missing one surfaces when this
 * step's button runs, with the way out right there.
 */
const AzureAppStep = forwardRef(function AzureAppStep({ wizard, onStartOver }, headingRef) {
  const { state, derived, actions } = wizard;
  const { app } = state;
  const { results, selectedApp } = derived;
  const email = state.signIn.account?.email ?? "This account";
  const setField = actions.setAppField;

  // Accounts can't be switched mid-wizard; a different account means
  // starting over from Sign In.
  const startOverButton = (
    <Button variant="outlined" color="secondary" size="small" onClick={onStartOver}>
      Start Over
    </Button>
  );
  const locked = derived.locked.app;

  // What a failed Create App / Create Secret offers, by what went wrong.
  const failureReason = derived.stepCreation.failure?.reason;
  let failureContent;
  if (failureReason === "registerApps") {
    failureContent = (
      <Alert severity="error" role="alert">
        <AlertTitle>{email} can’t register apps in Microsoft Entra ID</AlertTitle>
        Use an app your Azure admin already created, or start over and sign in with an account that can register apps.
        <RecoveryActions>
          <Button variant="outlined" color="secondary" size="small" onClick={() => setField("mode", "existing")}>
            Use an Existing App
          </Button>
          {startOverButton}
        </RecoveryActions>
      </Alert>
    );
  } else if (failureReason === "appOwner" && selectedApp) {
    failureContent = (
      <Alert severity="error" role="alert">
        <AlertTitle>Only owners of {selectedApp.name} can create secrets</AlertTitle>
        Enter a client secret your Azure admin gave you, or ask them to add you as an owner.
        <RecoveryActions>
          <Button variant="outlined" color="secondary" size="small" onClick={() => setField("secretMode", "existing")}>
            Enter Existing Secret
          </Button>
        </RecoveryActions>
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <StepHeading
        ref={headingRef}
        title="App Identity"
        subtitle="Arcserve signs in to Azure as this app to back up and restore. Create a new one, or use one your Azure admin already set up."
      />
      <StepCreationStatus creation={derived.stepCreation} failureContent={failureContent} />
      <Box inert={locked} sx={{ opacity: locked ? 0.6 : 1 }}>
        <RadioGroup
          aria-label="App identity"
          value={app.mode}
          onChange={(event) => setField("mode", event.target.value)}
          sx={{ gap: 2.5 }}
        >
          <OptionCard
            value="new"
            selected={app.mode === "new"}
            onSelect={(value) => setField("mode", value)}
            title="Create a new app"
            description="Arcserve registers a new app in Microsoft Entra ID and creates its client secret."
          >
            <Stack spacing={2} sx={{ pt: 1 }}>
              <FormField label="App Registration Name">
                <TextField
                  size="small"
                  fullWidth
                  value={app.newName}
                  onChange={(event) => setField("newName", event.target.value)}
                  error={Boolean(derived.appNameError)}
                  helperText={derived.appNameError ?? "How the app appears in Microsoft Entra ID."}
                />
              </FormField>
              <SecretExpiryField
                value={app.secretExpiryMonths}
                onChange={(value) => setField("secretExpiryMonths", value)}
              />
            </Stack>
          </OptionCard>

          <OptionCard
            value="existing"
            selected={app.mode === "existing"}
            onSelect={(value) => setField("mode", value)}
            title="Use an existing app"
            description="For when your Azure admin registered an app for backups and shared it with you."
          >
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <FormField label="App Registration">
                <PlaceholderSelect
                  size="small"
                  fullWidth
                  placeholder="Select app"
                  value={app.existingAppId}
                  onChange={(event) => setField("existingAppId", event.target.value)}
                  helperText={
                    selectedApp
                      ? `Application (client) ID: ${selectedApp.clientId}`
                      : `App registrations in ${TENANT.name} that you can see.`
                  }
                  selectProps={SMALL_SELECT_PROPS}
                >
                  {EXISTING_APPS.map((candidate) => (
                    <MenuItem key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </MenuItem>
                  ))}
                </PlaceholderSelect>
              </FormField>

              {selectedApp && (
                <Stack spacing={1.5}>
                  <Typography id="azure-secret-label" variant="body2" sx={{ fontWeight: 500 }}>
                    Client Secret
                  </Typography>
                  <RadioGroup
                    aria-labelledby="azure-secret-label"
                    value={app.secretMode}
                    onChange={(event) => setField("secretMode", event.target.value)}
                    sx={{ gap: 2 }}
                  >
                    <OptionCard
                      value="new"
                      selected={app.secretMode === "new"}
                      onSelect={(value) => setField("secretMode", value)}
                      title="Create a new client secret"
                      description={`Arcserve adds a secret to ${selectedApp.name}. Needs you to be one of its owners.`}
                    >
                      <Stack spacing={2} sx={{ pt: 1 }}>
                        <SecretExpiryField
                          value={app.secretExpiryMonths}
                          onChange={(value) => setField("secretExpiryMonths", value)}
                        />
                      </Stack>
                    </OptionCard>
                    <OptionCard
                      value="existing"
                      selected={app.secretMode === "existing"}
                      onSelect={(value) => setField("secretMode", value)}
                      title="Enter an existing client secret"
                      description="Paste the secret’s Value from the app’s Certificates & secrets page. Arcserve validates it with Azure."
                    >
                      <Stack spacing={1.5} sx={{ pt: 1 }}>
                        <Box
                          component="form"
                          noValidate
                          onSubmit={(event) => {
                            event.preventDefault();
                            if (app.secretValue.trim()) actions.validateSecret();
                          }}
                          sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}
                        >
                          <PasswordField
                            label="Client Secret Value"
                            placeholder="Paste secret value"
                            value={app.secretValue}
                            onChange={(value) => setField("secretValue", value)}
                            sx={{ flex: 1 }}
                          />
                          <Button
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            disabled={!app.secretValue.trim() || results.secret === "checking"}
                            startIcon={
                              results.secret === "checking" ? <CircularProgress size={16} color="inherit" /> : undefined
                            }
                            sx={{ flexShrink: 0 }}
                          >
                            Validate
                          </Button>
                        </Box>
                        <AccessCheck
                          result={results.secret}
                          checkingLabel="Validating the secret with Azure…"
                          allowedLabel={`Secret accepted. Arcserve can sign in as ${selectedApp.name}.`}
                          denied={
                            <Alert severity="error" role="alert">
                              Azure didn’t accept this secret. Copy the secret’s Value, not its Secret ID, and check it
                              hasn’t expired.
                            </Alert>
                          }
                        />
                        {results.secret === "idle" && (
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Prototype: any value of 10 or more characters, with no spaces, is accepted.
                          </Typography>
                        )}
                      </Stack>
                    </OptionCard>
                  </RadioGroup>
                </Stack>
              )}
            </Stack>
          </OptionCard>
        </RadioGroup>
      </Box>
    </Stack>
  );
});

AzureAppStep.propTypes = {
  wizard: PropTypes.object.isRequired,
  onStartOver: PropTypes.func.isRequired,
};

export default AzureAppStep;
