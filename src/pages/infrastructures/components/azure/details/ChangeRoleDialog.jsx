import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Alert, AlertTitle, MenuItem, RadioGroup, Stack, Typography } from "@mui/material";
import FormField from "../../../../../components/FormField";
import PlaceholderSelect from "../../../../../components/PlaceholderSelect";
import { CUSTOM_ROLE_NAME, EXISTING_ROLES, getMissingRoleActions } from "../../../hooks/azure/azureMockData";
import { useAzureSignInGate } from "../../../hooks/azure/useAzureSignInGate";
import { OptionCard } from "../AzureWizardParts";
import ShortActionList from "../ShortActionList";
import { SMALL_SELECT_PROPS } from "../azureStyles";
import AzureSignInGate from "./AzureSignInGate";
import { DetailsDialog, DetailsDialogLayout } from "./DetailsDialog";

const TITLE_ID = "azure-change-role-title";
const ASSIGN_ONLY = ["assignRoles"];
const CREATE_AND_ASSIGN = ["createRoles", "assignRoles"];

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

function ChangeRoleBody({ role, requiredActions, missingActions, scopeText, subscriptionId, busy, onClose, onSave }) {
  const currentExisting = role.isNew ? null : EXISTING_ROLES.find((candidate) => candidate.name === role.name);
  const [mode, setMode] = useState(role.isNew ? "create" : "existing");
  const [roleId, setRoleId] = useState(currentExisting?.id ?? "");
  const selectedRole = EXISTING_ROLES.find((candidate) => candidate.id === roleId) ?? null;

  const missing = useMemo(
    () => (selectedRole ? getMissingRoleActions(selectedRole, requiredActions) : []),
    [selectedRole, requiredActions],
  );

  // Fixing permissions someone removed in Azure: re-applying Arcserve's own
  // custom role is a valid "change" even though the choice is the same.
  const repairing = missingActions.length > 0;
  const unchanged = mode === "create" ? role.isNew : selectedRole?.name === role.name;
  const gate = useAzureSignInGate(mode === "create" ? CREATE_AND_ASSIGN : ASSIGN_ONLY, { subscriptionId });

  const choiceValid = mode === "create" || (selectedRole && missing.length === 0);
  const canSave = (repairing ? mode === "create" || !unchanged : !unchanged) && choiceValid && gate.allAllowed;

  const save = () =>
    onSave(
      mode === "create"
        ? { isNew: true, name: CUSTOM_ROLE_NAME, builtIn: false }
        : { isNew: false, name: selectedRole.name, builtIn: selectedRole.builtIn },
    );

  return (
    <DetailsDialogLayout
      titleId={TITLE_ID}
      title={repairing ? "Fix Permissions" : "Change Role"}
      busy={busy}
      onClose={onClose}
      primaryLabel={repairing && mode === "create" && role.isNew ? "Restore Permissions" : "Assign Role"}
      busyLabel="Updating Azure…"
      canSave={Boolean(canSave)}
      onSave={save}
    >
      <Stack spacing={3}>
        {repairing ? (
          <Alert severity="warning">
            <AlertTitle>
              {role.name} is missing {plural(missingActions.length, "permission")}
            </AlertTitle>
            Someone changed it in Azure. {role.isNew ? "Restore them to Arcserve’s custom role" : "Pick a role that has them"},
            or ask your Azure admin to add them back.
            <ShortActionList
              actions={missingActions}
              dialogTitle={`Missing from ${role.name} (${missingActions.length})`}
              dialogDescription="Permissions someone removed from the role in Azure."
            />
          </Alert>
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Currently <strong>{role.name}</strong> on {scopeText}. The new role replaces it there.
          </Typography>
        )}
        <RadioGroup aria-label="Role" value={mode} onChange={(event) => setMode(event.target.value)} sx={{ gap: 2.5 }}>
          <OptionCard
            value="create"
            selected={mode === "create"}
            onSelect={setMode}
            title={role.isNew ? `${CUSTOM_ROLE_NAME} (Arcserve’s custom role)` : "Create a custom role (Recommended)"}
            description={`Exactly the ${plural(requiredActions.length, "permission")} Arcserve needs. Arcserve keeps it up to date when you change what Azure is used for.`}
          />
          <OptionCard
            value="existing"
            selected={mode === "existing"}
            onSelect={setMode}
            title="Use an existing role"
            description="A role your Azure admin set up. Arcserve checks it has every permission needed."
          >
            <Stack spacing={2} sx={{ pt: 1 }}>
              <FormField label="Existing Role">
                <PlaceholderSelect
                  size="small"
                  fullWidth
                  placeholder="Select role"
                  value={roleId}
                  onChange={(event) => setRoleId(event.target.value)}
                  selectProps={SMALL_SELECT_PROPS}
                >
                  {EXISTING_ROLES.map((candidate) => (
                    <MenuItem key={candidate.id} value={candidate.id}>
                      {candidate.name} {candidate.builtIn ? "(Built-in)" : "(Custom)"}
                    </MenuItem>
                  ))}
                </PlaceholderSelect>
              </FormField>
              {selectedRole && missing.length > 0 && (
                <Alert severity="error" role="alert">
                  <AlertTitle>
                    {selectedRole.name} is missing {plural(missing.length, "required permission")}
                  </AlertTitle>
                  Choose another role, or ask your Azure admin to add these to it:
                  <ShortActionList
                    actions={missing}
                    dialogTitle={`Missing from ${selectedRole.name} (${missing.length})`}
                    dialogDescription={`Permissions Arcserve needs that ${selectedRole.name} doesn’t grant. Copy them to send to your Azure admin.`}
                  />
                </Alert>
              )}
              {selectedRole && missing.length === 0 && selectedRole.actions.includes("*") && (
                <Alert severity="warning">
                  {selectedRole.name} grants far more than Arcserve needs. A custom role with only the required
                  permissions is safer.
                </Alert>
              )}
              {selectedRole && missing.length === 0 && !selectedRole.actions.includes("*") && (
                <Typography role="status" variant="body2" sx={{ color: "success.main" }}>
                  {selectedRole.name} has all {plural(requiredActions.length, "required permission")}.
                </Typography>
              )}
            </Stack>
          </OptionCard>
        </RadioGroup>
        <AzureSignInGate gate={gate} reason="Assigning a role is done in Azure." />
      </Stack>
    </DetailsDialogLayout>
  );
}

ChangeRoleBody.propTypes = {
  role: PropTypes.shape({ name: PropTypes.string.isRequired, isNew: PropTypes.bool }).isRequired,
  requiredActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  missingActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  scopeText: PropTypes.string.isRequired,
  subscriptionId: PropTypes.string,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

/** Permissions → Change / Fix on the account page. */
export default function ChangeRoleDialog({ open, busy, onClose, ...bodyProps }) {
  return (
    <DetailsDialog open={open} titleId={TITLE_ID} busy={busy} onClose={onClose}>
      <ChangeRoleBody busy={busy} onClose={onClose} {...bodyProps} />
    </DetailsDialog>
  );
}

ChangeRoleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
