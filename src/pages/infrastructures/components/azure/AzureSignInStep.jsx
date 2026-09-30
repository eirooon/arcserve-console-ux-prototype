import { forwardRef } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TonePill from "../../../../components/TonePill";
import { TENANT } from "../../hooks/azure/azureMockData";
import { PENDING_ADMIN_STATUS } from "../../hooks/cloudServices";
import { OptionCard, StepHeading } from "./AzureWizardParts";
import { primaryTint } from "./azureStyles";

// What the rest of the wizard asks for. Choices, not promises: whether an
// app or role gets created depends on what the user picks and can do.
const NEXT_CHOICES = [
  "What to use Azure for: backing up Azure VMs, Virtual Standby, or storage for RPS",
  "An app identity for Arcserve: create a new one, or use one your Azure admin already set up",
  "The role and resources Arcserve needs, only for what you choose",
];

function AccountCard({ account, pill }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: "center", p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}
    >
      <Avatar sx={{ width: 40, height: 40, bgcolor: primaryTint, color: "primary.dark" }}>{account.initials}</Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
          {account.email}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Tenant: {TENANT.name}
        </Typography>
      </Box>
      {pill}
    </Stack>
  );
}

AccountCard.propTypes = {
  account: PropTypes.shape({ email: PropTypes.string, initials: PropTypes.string }).isRequired,
  pill: PropTypes.node,
};

/**
 * Shown after sign-in when this tenant is already in Cloud
 * Accounts (connected, or waiting on an admin) — so finishing the wizard
 * updates that account instead of silently creating a duplicate.
 */
function ExistingTenantChoice({ existingAccount, choice, onChange }) {
  const pending = existingAccount.status === PENDING_ADMIN_STATUS;
  return (
    <Stack spacing={2}>
      <Alert severity="info">
        <AlertTitle>
          {pending
            ? `Setup for ${TENANT.name} is waiting on ${existingAccount.adminEmail ?? "your admin"}`
            : `${TENANT.name} is already connected`}
        </AlertTitle>
        {pending
          ? `“${existingAccount.name}” was sent to an admin to finish. You can finish it yourself now.`
          : `It's in Cloud Accounts as “${existingAccount.name}”.`}
      </Alert>
      <RadioGroup
        aria-label="How to connect this tenant"
        value={choice}
        onChange={(event) => onChange(event.target.value)}
        sx={{ gap: 2 }}
      >
        <OptionCard
          value="update"
          selected={choice === "update"}
          onSelect={onChange}
          title={pending ? "Finish this setup now (Recommended)" : `Update ${existingAccount.name} (Recommended)`}
          description={
            pending
              ? "Completes the pending cloud account and closes the request to your admin."
              : "Adds the workloads you choose to this account. No duplicate account is created."
          }
        />
        <OptionCard
          value="separate"
          selected={choice === "separate"}
          onSelect={onChange}
          title="Add a separate cloud account"
          description="For a different subscription in the same tenant. You'll name it on the Review step."
        />
      </RadioGroup>
    </Stack>
  );
}

ExistingTenantChoice.propTypes = {
  existingAccount: PropTypes.shape({
    name: PropTypes.string.isRequired,
    status: PropTypes.string,
    adminEmail: PropTypes.string,
  }).isRequired,
  choice: PropTypes.oneOf(["update", "separate"]).isRequired,
  onChange: PropTypes.func.isRequired,
};

/**
 * Step 1 — Sign In (Figma 10301:13780). Only signs in: nothing is checked
 * here, because what the account needs depends on later choices — each
 * right is checked on the step that needs it.
 */
const AzureSignInStep = forwardRef(function AzureSignInStep({ wizard }, headingRef) {
  const { state, derived, actions } = wizard;
  const { signIn } = state;

  if (signIn.status === "signingIn") {
    return (
      <Stack spacing={3}>
        <StepHeading ref={headingRef} title="Signing in" />
        <AccountCard account={signIn.account} pill={<CircularProgress size={20} aria-hidden />} />
        <Typography role="status" variant="body2" sx={{ color: "text.secondary" }}>
          Connecting to your Azure tenant. Nothing is created yet.
        </Typography>
      </Stack>
    );
  }

  if (derived.signedIn) {
    return (
      <Stack spacing={3}>
        <AccountCard account={signIn.account} pill={<TonePill tone="success" label="Signed In" />} />
        <StepHeading
          ref={headingRef}
          title="You’re signed in"
          subtitle="Next, choose what to use Azure for. Arcserve checks what this account can do only when a step needs it, and creates things in Azure one step at a time, only when you select that step’s create button."
        />
        {derived.existingTenantAccount && (
          <ExistingTenantChoice
            existingAccount={derived.existingTenantAccount}
            choice={state.connectionChoice}
            onChange={actions.setConnectionChoice}
          />
        )}
        {/* Switching accounts is only possible here, before anything is
            created; later steps offer Start Over instead. */}
        {!derived.locked.signIn && (
          <Button color="secondary" onClick={actions.openSignIn} sx={{ alignSelf: "flex-start" }}>
            Use a different account
          </Button>
        )}
        <FormControlLabel
          sx={{
            alignSelf: "flex-start",
            px: 1.5,
            py: 0.5,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            m: 0,
          }}
          control={
            <Switch
              size="small"
              checked={state.simulateFailure}
              onChange={(event) => actions.setSimulateFailure(event.target.checked)}
            />
          }
          label="Prototype only: fail the first thing Arcserve creates, once"
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <StepHeading
        ref={headingRef}
        title="Sign In to Microsoft Azure"
        subtitle="Arcserve uses your sign-in to set things up in your Azure tenant. You won't need to open the Azure portal."
      />
      <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
          After you sign in, you’ll choose:
        </Typography>
        <Stack component="ul" spacing={0.5} sx={{ listStyleType: "disc", m: 0, pl: 3 }}>
          {NEXT_CHOICES.map((item) => (
            <Typography component="li" variant="body2" key={item} sx={{ display: "list-item" }}>
              {item}
            </Typography>
          ))}
        </Stack>
      </Box>
      <Alert severity="info">
        Any account in your tenant can sign in. If it can’t create apps or roles, you can use ones your Azure admin
        already set up, or send the setup to your admin. To use a different account later, you’ll start over.
      </Alert>
      <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
        <Button variant="contained" onClick={actions.openSignIn}>
          Sign in with Microsoft Azure
        </Button>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <LockOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} aria-hidden />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Opens a secure Microsoft window. Your password is never shared with Arcserve.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
});

AzureSignInStep.propTypes = {
  wizard: PropTypes.object.isRequired,
};

export default AzureSignInStep;
