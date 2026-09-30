import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import TonePill from "../../components/TonePill";
import { usePageBreadcrumb } from "../../hooks/usePageBreadcrumb";
import { useAzureAccountDetails } from "./hooks/azure/useAzureAccountDetails";
import { DetailsRow, DetailsSection } from "./components/azure/details/DetailsSection";
import EditGoalsDialog from "./components/azure/details/EditGoalsDialog";
import ChangeStorageDialog from "./components/azure/details/ChangeStorageDialog";
import PermissionsDialog from "./components/azure/details/PermissionsDialog";
import DisconnectDialog from "./components/azure/details/DisconnectDialog";
import ReplaceSecretDialog from "./components/azure/details/ReplaceSecretDialog";
import ChangeRoleDialog from "./components/azure/details/ChangeRoleDialog";
import { describeScopes } from "./hooks/azure/azureMockData";

const LIST_PATH = "/infrastructures/cloud-accounts";
const MINUTE_MS = 60 * 1000;
const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

// Prototype-only: what the next Check Connection / Recheck finds in Azure.
const SIMULATED_ISSUES = [
  { value: "none", label: "Everything is fine" },
  { value: "secretExpired", label: "Client secret expired" },
  { value: "missingPermissions", label: "Permissions removed from the role" },
];

const expiryFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

function formatCheckedAgo(iso, now) {
  const minutes = Math.round((new Date(iso).getTime() - now) / MINUTE_MS);
  if (minutes > -1) return "Checked just now";
  if (minutes > -60) return `Checked ${relativeTime.format(minutes, "minute")}`;
  const hours = Math.round(minutes / 60);
  if (hours > -24) return `Checked ${relativeTime.format(hours, "hour")}`;
  return `Checked ${relativeTime.format(Math.round(hours / 24), "day")}`;
}

// Ticks on its own so only this line re-renders every minute, not the page.
// Keyed by `iso` at the call site, so a new check restarts it at "just now".
function CheckedAgo({ iso }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), MINUTE_MS);
    return () => clearInterval(timer);
  }, []);
  return <span>{formatCheckedAgo(iso, now)}</span>;
}

CheckedAgo.propTypes = { iso: PropTypes.string.isRequired };

function InlineProgress({ label }) {
  return (
    <Stack component="span" direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <CircularProgress size={14} aria-hidden />
      <span>{label}</span>
    </Stack>
  );
}

InlineProgress.propTypes = { label: PropTypes.string.isRequired };

function RowButton({ children, ...props }) {
  return (
    <Button color="secondary" size="small" sx={{ flexShrink: 0 }} {...props}>
      {children}
    </Button>
  );
}

RowButton.propTypes = { children: PropTypes.node.isRequired };

// Masked until "Show" — and masked again whenever the page is left, since
// the toggle is local state that starts hidden on every visit.
function ClientSecretRow({ secret, expired, onCopy, onReplace }) {
  const [visible, setVisible] = useState(false);
  return (
    <DetailsRow
      label="Client Secret"
      action={
        <Stack direction="row" spacing={0.5}>
          <RowButton
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide client secret" : "Show client secret"}
            aria-controls="azure-client-secret"
          >
            {visible ? "Hide" : "Show"}
          </RowButton>
          <RowButton onClick={onCopy} aria-label="Copy client secret">
            Copy
          </RowButton>
          <RowButton onClick={onReplace} aria-label="Replace client secret">
            Replace
          </RowButton>
        </Stack>
      }
    >
      <Box id="azure-client-secret" component="span" sx={{ wordBreak: "break-all" }}>
        {visible ? (
          secret
        ) : (
          <>
            <span aria-hidden>••••••••••••••••</span>
            <Box component="span" sx={visuallyHidden}>
              Hidden
            </Box>
          </>
        )}
      </Box>
      {expired && (
        <Box component="span" sx={{ ml: 1 }}>
          <TonePill tone="error" label="Expired" />
        </Box>
      )}
    </DetailsRow>
  );
}

ClientSecretRow.propTypes = {
  secret: PropTypes.string.isRequired,
  expired: PropTypes.bool.isRequired,
  onCopy: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
};

/**
 * Modify page for a Microsoft Azure cloud account (Figma 10378:18489),
 * reached from the Cloud Accounts row menu's "Modify".
 */
export default function AzureCloudAccountDetails() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { account, loading, derived, checking, busy, simulatedIssue, actions } = useAzureAccountDetails(accountId);
  // "goals" | "secret" | "role" | "storage" | "permissions" | "disconnect" | null
  const [dialog, setDialog] = useState(null);
  const closeDialog = () => setDialog(null);

  usePageBreadcrumb(account?.name ?? null);

  if (!account) {
    return (
      <Stack spacing={2} sx={{ alignItems: "flex-start", p: 4 }}>
        <Typography sx={{ color: "text.secondary" }}>{loading ? "Loading…" : "This cloud account doesn’t exist anymore."}</Typography>
        {!loading && (
          <Button variant="outlined" color="secondary" onClick={() => navigate(LIST_PATH)}>
            Back to Cloud Accounts
          </Button>
        )}
      </Stack>
    );
  }

  const { azure } = account;
  const { health } = derived;
  const needsAttention = health.secretExpired || health.missingActions.length > 0;
  const saveAndClose = (save) => async (value) => {
    if (await save(value)) closeDialog();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={1} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography component="h1" variant="body1" noWrap sx={{ fontWeight: 500 }}>
              {account.name}
            </Typography>
            {checking === "connection" ? (
              <TonePill tone="info" label="Checking" />
            ) : needsAttention ? (
              <TonePill tone="warning" label="Needs Attention" />
            ) : (
              <TonePill tone="success" label="Connected" />
            )}
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            role="status"
            sx={{ typography: "body2", color: "text.secondary", flexWrap: "wrap" }}
          >
            {checking === "connection" ? (
              <InlineProgress label="Checking connection…" />
            ) : (
              <CheckedAgo key={azure.lastCheckedAt} iso={azure.lastCheckedAt} />
            )}
            {azure.setupBy && <span>Setup by {azure.setupBy}</span>}
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Button variant="outlined" color="secondary" onClick={() => navigate(LIST_PATH)}>
            Close
          </Button>
          <Button variant="outlined" color="secondary" onClick={actions.checkConnection} disabled={Boolean(checking)}>
            Check Connection
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", bgcolor: "background.default", p: 3 }}>
        <Stack spacing={3} sx={{ maxWidth: 900, mx: "auto" }}>
          {needsAttention && (
            <Alert severity="warning">
              <AlertTitle>Backups for this account will fail until this is fixed</AlertTitle>
              <Stack spacing={1.5}>
                {health.secretExpired && (
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="inherit">
                      The client secret for {azure.app.name} has expired.
                    </Typography>
                    <Button variant="outlined" color="secondary" size="small" onClick={() => setDialog("secret")}>
                      Replace Secret
                    </Button>
                  </Stack>
                )}
                {health.missingActions.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="inherit">
                      {azure.role.name} is missing {plural(health.missingActions.length, "permission")} Arcserve needs.
                    </Typography>
                    <Button variant="outlined" color="secondary" size="small" onClick={() => setDialog("role")}>
                      Fix Permissions
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Alert>
          )}
          <DetailsSection
            title="Using Azure for"
            subtitle="Changing this can add or remove Azure permissions."
            action={
              <Button variant="outlined" color="secondary" onClick={() => setDialog("goals")} aria-label="Edit what Azure is used for">
                Edit
              </Button>
            }
          >
            {derived.goalRows.map((goal) => (
              <DetailsRow key={goal.key} label={goal.label} muted={!goal.active}>
                {goal.active ? "Active" : "Not set up"}
              </DetailsRow>
            ))}
          </DetailsSection>

          {derived.showApp && (
            <DetailsSection title="App Identity" subtitle="How Arcserve signs in to Azure to run your backups.">
              <DetailsRow label="App registration">
                {azure.app.name}
                {!azure.app.isNew && (
                  <Typography component="span" variant="body2" sx={{ color: "text.secondary" }}>
                    {" "}
                    (set up by your Azure admin)
                  </Typography>
                )}
              </DetailsRow>
              <DetailsRow
                label="Client ID"
                action={
                  <RowButton onClick={actions.copyClientId} aria-label="Copy Client ID">
                    Copy
                  </RowButton>
                }
              >
                <Box component="span" sx={{ wordBreak: "break-all" }}>
                  {azure.app.clientId}
                </Box>
              </DetailsRow>
              <ClientSecretRow
                secret={azure.app.clientSecret}
                expired={health.secretExpired}
                onCopy={actions.copyClientSecret}
                onReplace={() => setDialog("secret")}
              />
              {azure.app.secretExpiresAt && (
                <DetailsRow label="Secret expires">{expiryFormatter.format(new Date(azure.app.secretExpiresAt))}</DetailsRow>
              )}
            </DetailsSection>
          )}

          {derived.showApp && azure.role && (
            <DetailsSection
              title="Permissions"
              subtitle="Arcserve checks these every day and alerts you if something changes in Azure."
            >
              <DetailsRow
                label={azure.role.isNew ? "Custom role" : "Role"}
                action={
                  <Stack direction="row" spacing={0.5}>
                    <RowButton onClick={() => setDialog("permissions")}>View Permissions</RowButton>
                    <RowButton onClick={() => setDialog("role")} aria-label="Change role">
                      Change
                    </RowButton>
                  </Stack>
                }
              >
                {azure.role.name}
              </DetailsRow>
              <DetailsRow label="Assigned on">
                {azure.role.scopes.map((scope) => (
                  <div key={scope.name}>
                    {scope.name}
                    <Typography component="span" variant="body2" sx={{ color: "text.secondary" }}>
                      {scope.type === "subscription" ? " (subscription)" : " (resource group)"}
                    </Typography>
                  </div>
                ))}
              </DetailsRow>
              <DetailsRow
                label="Status"
                action={
                  <RowButton onClick={actions.recheckPermissions} disabled={Boolean(checking)} aria-label="Recheck permissions">
                    Recheck
                  </RowButton>
                }
              >
                <Box role="status">
                  {checking ? (
                    <InlineProgress label="Checking permissions…" />
                  ) : health.missingActions.length > 0 ? (
                    <Box component="span" sx={{ color: "error.main" }}>
                      Missing {plural(health.missingActions.length, "required permission")}
                    </Box>
                  ) : (
                    "All required permissions verified"
                  )}
                </Box>
              </DetailsRow>
            </DetailsSection>
          )}

          <DetailsSection
            title="Location"
            subtitle="Subscription and storage resource group are fixed after setup because your existing backups depend on them."
          >
            <DetailsRow label="Subscription">{azure.subscriptionName}</DetailsRow>
            {derived.showStorage && (
              <DetailsRow label="Storage resource group">
                {azure.storage.resourceGroup} · {azure.storage.region}
              </DetailsRow>
            )}
            {derived.showStorage && (
              <DetailsRow
                label="Storage Account"
                action={
                  <RowButton onClick={() => setDialog("storage")} aria-label="Change storage account">
                    Change
                  </RowButton>
                }
              >
                <div>{azure.storage.account}</div>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                  New backups go to the storage account you choose. Existing backups stay where they are.
                </Typography>
              </DetailsRow>
            )}
          </DetailsSection>

          <DetailsSection
            title="Disconnect this account"
            subtitle="Stops backups for this account. You’ll choose what to remove from Azure before anything is deleted."
            action={
              <Button variant="outlined" color="error" onClick={() => setDialog("disconnect")}>
                Disconnect
              </Button>
            }
          />

          {/* Prototype-only control for reviewing the "needs attention" designs. */}
          <Box sx={{ p: 2, border: "1px dashed", borderColor: "divider", borderRadius: 2 }}>
            <Typography
              id="azure-simulated-issue"
              variant="caption"
              component="p"
              sx={{ color: "text.secondary", mb: 0.5 }}
            >
              Prototype only: what the next Check Connection or Recheck finds in Azure
            </Typography>
            <RadioGroup
              row
              aria-labelledby="azure-simulated-issue"
              value={simulatedIssue}
              onChange={(event) => actions.setSimulatedIssue(event.target.value)}
            >
              {SIMULATED_ISSUES.map((issue) => (
                <FormControlLabel
                  key={issue.value}
                  value={issue.value}
                  control={<Radio size="small" />}
                  label={issue.label}
                  slotProps={{ typography: { variant: "body2" } }}
                />
              ))}
            </RadioGroup>
          </Box>
        </Stack>
      </Box>

      <EditGoalsDialog
        open={dialog === "goals"}
        busy={busy}
        goals={azure.goals}
        appName={azure.app?.name}
        storageAccount={azure.storage?.account}
        role={azure.role}
        subscriptionId={azure.subscriptionId}
        onClose={closeDialog}
        onSave={saveAndClose(actions.saveGoals)}
      />
      {derived.showStorage && (
        <ChangeStorageDialog
          open={dialog === "storage"}
          busy={busy}
          current={azure.storage.account}
          resourceGroup={azure.storage.resourceGroup}
          onClose={closeDialog}
          onSave={saveAndClose(actions.changeStorageAccount)}
        />
      )}
      {derived.showApp && azure.role && (
        <PermissionsDialog
          open={dialog === "permissions"}
          roleName={azure.role.name}
          services={derived.appServices}
          scopes={azure.role.scopes}
          onClose={closeDialog}
        />
      )}
      {derived.showApp && (
        <ReplaceSecretDialog
          open={dialog === "secret"}
          busy={busy}
          app={azure.app}
          subscriptionId={azure.subscriptionId}
          expired={health.secretExpired}
          onClose={closeDialog}
          onSave={saveAndClose(actions.replaceSecret)}
        />
      )}
      {derived.showApp && azure.role && (
        <ChangeRoleDialog
          open={dialog === "role"}
          busy={busy}
          role={azure.role}
          requiredActions={derived.roleActions}
          missingActions={health.missingActions}
          scopeText={describeScopes(azure.role.scopes)}
          subscriptionId={azure.subscriptionId}
          onClose={closeDialog}
          onSave={saveAndClose(actions.changeRole)}
        />
      )}
      <DisconnectDialog
        open={dialog === "disconnect"}
        busy={busy}
        accountName={account.name}
        app={derived.showApp ? azure.app : null}
        role={derived.showApp ? azure.role : null}
        storageAccount={derived.showStorage ? azure.storage.account : null}
        policyCount={account.policyCount}
        onClose={closeDialog}
        onConfirm={(options) => actions.disconnect(options, () => navigate(LIST_PATH))}
      />
    </Box>
  );
}
