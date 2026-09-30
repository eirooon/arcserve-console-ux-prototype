import { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { Alert, AlertTitle, Box, Button, Divider, MenuItem, RadioGroup, Stack, Typography } from "@mui/material";
import FormField from "../../../../components/FormField";
import PlaceholderSelect from "../../../../components/PlaceholderSelect";
import { CUSTOM_ROLE_NAME, EXISTING_ROLES } from "../../hooks/azure/azureMockData";
import AdminHandoffForm from "./AdminHandoffForm";
import PermissionListDialog from "./PermissionListDialog";
import ShortActionList from "./ShortActionList";
import StepCreationStatus from "./StepCreationStatus";
import SubscriptionField from "./SubscriptionField";
import { AccessCheck, OptionCard, StepHeading } from "./AzureWizardParts";
import { SMALL_SELECT_PROPS } from "./azureStyles";

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

/**
 * Permissions step: the subscription the app's role is assigned on, and a
 * custom role or an existing one — validated against the permissions the
 * chosen goals need. Assigning a role is checked here, where it's needed,
 * and created from this step's own button.
 */
const AzurePermissionsStep = forwardRef(function AzurePermissionsStep(
  { wizard, adminHandoff, onStartOver },
  headingRef,
) {
  const { state, derived, actions } = wizard;
  const { role } = state;
  const { results, selectedRole, missingRoleActions, requiredActions, subscriptionName, locked } = derived;
  const email = state.signIn.account?.email ?? "This account";
  const [requiredOpen, setRequiredOpen] = useState(false);
  const setRoleField = actions.setRoleField;

  const startOverButton = (
    <Button variant="outlined" color="secondary" size="small" onClick={onStartOver}>
      Start Over
    </Button>
  );

  return (
    <Stack spacing={3}>
      <StepHeading
        ref={headingRef}
        title="Permissions"
        subtitle="The app gets a role with only the permissions your goals need, assigned on the subscription you choose."
      />
      <StepCreationStatus
        creation={derived.stepCreation}
        doneMessage={`${role.mode === "create" ? CUSTOM_ROLE_NAME : (selectedRole?.name ?? "The role")} is assigned on ${subscriptionName}.`}
        onStartOver={onStartOver}
      />

      <Box inert={locked.permissions} sx={{ opacity: locked.permissions ? 0.6 : 1 }}>
        <Stack spacing={3}>
          <SubscriptionField
            value={state.subscriptionId}
            onChange={actions.setSubscription}
            disabled={locked.subscription}
            helperText="Arcserve assigns the app’s role on this subscription"
          />

          <AccessCheck
            result={results.assignRoles}
            checkingLabel={`Checking that ${email} can assign roles in ${subscriptionName}…`}
            allowedLabel={`${email} can assign roles in ${subscriptionName}.`}
            denied={
              <Alert severity="error" role="alert">
                <AlertTitle>
                  {email} can’t assign roles in {subscriptionName}
                </AlertTitle>
                <Stack spacing={1.5}>
                  <Typography variant="body2">
                    Assigning a role needs Owner or User Access Administrator. Choose another subscription, send the
                    setup to your Azure admin, or start over with an account that has it.
                  </Typography>
                  <AdminHandoffForm {...adminHandoff} />
                  <Box>{startOverButton}</Box>
                </Stack>
              </Alert>
            }
          />

          <Divider />

          <Stack spacing={1.5}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
              <Typography id="azure-role-label" variant="body2" sx={{ fontWeight: 500 }}>
                Role
              </Typography>
              <Button color="secondary" size="small" onClick={() => setRequiredOpen(true)} aria-haspopup="dialog">
                View Required Permissions ({requiredActions.length})
              </Button>
            </Stack>
            <RadioGroup
              aria-labelledby="azure-role-label"
              value={role.mode}
              onChange={(event) => setRoleField("mode", event.target.value)}
              sx={{ gap: 2.5, pt: 1 }}
            >
              <OptionCard
                value="create"
                selected={role.mode === "create"}
                onSelect={(value) => setRoleField("mode", value)}
                title="Create a custom role"
                description={`Arcserve creates “${CUSTOM_ROLE_NAME}” with exactly the ${plural(requiredActions.length, "permission")} needed.`}
              >
                <Box sx={{ pt: 1 }}>
                  <AccessCheck
                    result={results.createRoles}
                    checkingLabel={`Checking that ${email} can create roles in ${subscriptionName}…`}
                    allowedLabel={`${email} can create custom roles in ${subscriptionName}.`}
                    denied={
                      <Alert severity="error" role="alert">
                        <AlertTitle>
                          {email} can’t create custom roles in {subscriptionName}
                        </AlertTitle>
                        Use a role your Azure admin created for backups, or start over with an account that can create
                        roles.
                        <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => setRoleField("mode", "existing")}
                          >
                            Use an Existing Role
                          </Button>
                          {startOverButton}
                        </Stack>
                      </Alert>
                    }
                  />
                </Box>
              </OptionCard>

              <OptionCard
                value="existing"
                selected={role.mode === "existing"}
                onSelect={(value) => setRoleField("mode", value)}
                title="Use an existing role"
                description="Pick a role your Azure admin set up. Arcserve checks it has every permission needed."
              >
                <Stack spacing={2} sx={{ pt: 1 }}>
                  <FormField label="Existing Role">
                    <PlaceholderSelect
                      size="small"
                      fullWidth
                      placeholder="Select role"
                      value={role.existingRoleId}
                      onChange={(event) => setRoleField("existingRoleId", event.target.value)}
                      helperText={`Roles defined in ${subscriptionName}.`}
                      selectProps={SMALL_SELECT_PROPS}
                    >
                      {EXISTING_ROLES.map((candidate) => (
                        <MenuItem key={candidate.id} value={candidate.id}>
                          {candidate.name} {candidate.builtIn ? "(Built-in)" : "(Custom)"}
                        </MenuItem>
                      ))}
                    </PlaceholderSelect>
                  </FormField>
                  {selectedRole && (
                    <AccessCheck
                      result={results.roleFit}
                      checkingLabel={`Checking the permissions in ${selectedRole.name}…`}
                      allowedLabel={`${selectedRole.name} has all ${plural(requiredActions.length, "required permission")}.`}
                      denied={
                        <Alert severity="error" role="alert">
                          <AlertTitle>
                            {selectedRole.name} is missing {plural(missingRoleActions.length, "required permission")}
                          </AlertTitle>
                          Choose another role, or ask your Azure admin to add them:
                          <ShortActionList
                            actions={missingRoleActions}
                            dialogTitle={`Missing from ${selectedRole.name} (${missingRoleActions.length})`}
                            dialogDescription={`Permissions Arcserve needs that ${selectedRole.name} doesn’t grant. Copy them to send to your Azure admin.`}
                          />
                        </Alert>
                      }
                    />
                  )}
                  {results.roleFit === "allowed" && selectedRole?.actions.includes("*") && (
                    <Alert severity="warning">
                      {selectedRole.name} grants far more than Arcserve needs. A custom role with only the required
                      permissions is safer.
                    </Alert>
                  )}
                </Stack>
              </OptionCard>
            </RadioGroup>
          </Stack>
        </Stack>
      </Box>

      <PermissionListDialog
        open={requiredOpen}
        title={`Required Permissions (${requiredActions.length})`}
        description="What the app’s role must allow for the goals you chose. Copy them to share with your Azure admin."
        actions={requiredActions}
        onClose={() => setRequiredOpen(false)}
      />
    </Stack>
  );
});

AzurePermissionsStep.propTypes = {
  wizard: PropTypes.object.isRequired,
  adminHandoff: PropTypes.object.isRequired,
  onStartOver: PropTypes.func.isRequired,
};

export default AzurePermissionsStep;
