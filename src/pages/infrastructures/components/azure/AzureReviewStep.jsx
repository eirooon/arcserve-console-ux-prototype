import { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import FormField from "../../../../components/FormField";
import PermissionListDialog from "./PermissionListDialog";
import { StepHeading } from "./AzureWizardParts";

function ReviewRow({ label, children, action, isFirst }) {
  return (
    <Stack
      component="li"
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 0.5, sm: 6 }}
      sx={{ alignItems: "flex-start", px: 2, py: 1.5, borderTop: isFirst ? 0 : 1, borderColor: "divider" }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          width: { sm: 120 },
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
      {action}
    </Stack>
  );
}

ReviewRow.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  action: PropTypes.node,
  isFirst: PropTypes.bool,
};

const Strong = ({ children }) => (
  <Box component="strong" sx={{ fontWeight: 600 }}>
    {children}
  </Box>
);

Strong.propTypes = { children: PropTypes.node.isRequired };

/** Review step (Figma 10301:16750). Only lists what the chosen goals need. */
const AzureReviewStep = forwardRef(function AzureReviewStep(
  { summary, displayNameError, updatingExisting, onDisplayNameChange },
  headingRef,
) {
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const { app, role, storage } = summary;

  return (
    <Stack spacing={3}>
      <StepHeading
        ref={headingRef}
        title="Review and Connect"
        subtitle={`Everything below is set up in your Azure tenant, ${summary.tenantName.replace(/\.$/, "")}. Name the account, then select Connect to finish.`}
      />
      <FormField label="Cloud Account Display Name">
        <TextField
          size="small"
          fullWidth
          value={summary.displayName}
          onChange={(event) => onDisplayNameChange(event.target.value)}
          disabled={updatingExisting}
          error={Boolean(displayNameError)}
          helperText={
            displayNameError ??
            (updatingExisting
              ? "You're updating this existing cloud account."
              : "How this account appears in Cloud Accounts. You can change it later.")
          }
        />
      </FormField>
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, border: 1, borderColor: "divider", borderRadius: 2 }}>
        <ReviewRow label="Using Azure for" isFirst>
          {summary.goals.map((item) => (
            <Typography key={item} variant="body2">
              {item}
            </Typography>
          ))}
        </ReviewRow>

        <ReviewRow label="Subscription">
          <Typography variant="body2">{summary.subscriptionName}</Typography>
        </ReviewRow>

        {app && (
          <ReviewRow label="App identity">
            <Typography variant="body2">
              {app.isNew ? "Created app registration " : "Existing app registration "}
              <Strong>{app.name}</Strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {app.secretIsNew
                ? `Created client secret, expires in ${app.secretExpiryMonths} months`
                : "Existing client secret, validated"}
            </Typography>
          </ReviewRow>
        )}

        {role && (
          <ReviewRow
            label="Permissions"
            action={
              <Button color="secondary" size="small" onClick={() => setPermissionsOpen(true)} aria-haspopup="dialog">
                View
              </Button>
            }
          >
            <Typography variant="body2">
              {role.isNew ? "Created custom role " : "Existing role "}
              <Strong>{role.name}</Strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Assigned on {role.scopes.map((scope) => scope.name).join(", ")}
            </Typography>
            {role.grantsStorageAccess && storage && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Read and write access to storage account {storage.account}
              </Typography>
            )}
          </ReviewRow>
        )}

        {storage && (
          <ReviewRow label="Storage">
            <Typography variant="body2">
              {storage.accountIsNew ? "Created storage account " : "Existing storage account "}
              <Strong>{storage.account}</Strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {storage.resourceGroupIsNew ? "Created resource group " : "Resource group "}
              {storage.resourceGroup} in {storage.region}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Access key stored encrypted by Arcserve
            </Typography>
          </ReviewRow>
        )}
      </Box>

      {role && (
        <PermissionListDialog
          open={permissionsOpen}
          title={`${role.name} Permissions (${role.requiredActions.length})`}
          description={`Assigned on ${role.scopes.map((scope) => scope.name).join(", ")}.`}
          actions={role.requiredActions}
          onClose={() => setPermissionsOpen(false)}
        />
      )}
    </Stack>
  );
});

AzureReviewStep.propTypes = {
  summary: PropTypes.object.isRequired,
  displayNameError: PropTypes.string,
  updatingExisting: PropTypes.bool.isRequired,
  onDisplayNameChange: PropTypes.func.isRequired,
};

export default AzureReviewStep;
