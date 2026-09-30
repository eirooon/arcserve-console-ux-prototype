import PropTypes from "prop-types";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { visuallyHidden } from "@mui/utils";
import SimulatedMicrosoftSignIn from "../SimulatedMicrosoftSignIn";

/**
 * "Sign in to make this change in Azure" block for Modify page dialogs —
 * the view of useAzureSignInGate. Renders nothing when the change needs no
 * Azure rights.
 */
export default function AzureSignInGate({ gate, reason }) {
  if (!gate.required) return null;
  const { session, results, actions } = gate;
  const denied = session.status === "done" && !gate.allAllowed;

  let body;
  if (session.status === "idle") {
    body = (
      <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {reason} Sign in with an account that can:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.5, typography: "body2" }}>
          {results.map((result) => (
            <li key={result.right}>{result.label}</li>
          ))}
        </Box>
        <Button variant="outlined" color="secondary" size="small" onClick={actions.openSignIn}>
          Sign in with Microsoft Azure
        </Button>
      </Stack>
    );
  } else if (session.status !== "done") {
    body = (
      <Stack role="status" direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <CircularProgress size={16} aria-hidden />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {session.status === "signingIn"
            ? `Signing in as ${session.account.email}…`
            : `Checking what ${session.account.email} can do…`}
        </Typography>
      </Stack>
    );
  } else {
    body = (
      <Stack spacing={1.5}>
        <Typography variant="body2">
          Signed in as <strong>{session.account.email}</strong>
        </Typography>
        <Stack component="ul" role="status" spacing={0.75} sx={{ listStyle: "none", m: 0, p: 0 }}>
          {results.map((result) => (
            <Stack
              component="li"
              key={result.right}
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", color: result.allowed ? "success.main" : "error.main" }}
            >
              {result.allowed ? <CheckIcon fontSize="small" aria-hidden /> : <CloseIcon fontSize="small" aria-hidden />}
              <Typography variant="body2" color="inherit">
                {result.label}
                <Box component="span" sx={visuallyHidden}>
                  {result.allowed ? ": allowed" : ": not allowed"}
                </Box>
              </Typography>
            </Stack>
          ))}
        </Stack>
        {denied && (
          <Typography variant="body2" sx={{ color: "error.main" }}>
            This account can’t make this change. Switch to one that can, or ask your Azure admin.
          </Typography>
        )}
        <Box>
          <Button color="secondary" size="small" onClick={actions.openSignIn}>
            {denied ? "Switch Account" : "Use a different account"}
          </Button>
        </Box>
      </Stack>
    );
  }

  return (
    <Box sx={{ p: 2, border: 1, borderColor: denied ? "error.light" : "divider", borderRadius: 2 }}>
      {body}
      <SimulatedMicrosoftSignIn open={session.pickerOpen} onPick={actions.pickAccount} onClose={actions.closePicker} />
    </Box>
  );
}

AzureSignInGate.propTypes = {
  gate: PropTypes.shape({
    required: PropTypes.bool.isRequired,
    allAllowed: PropTypes.bool.isRequired,
    session: PropTypes.object.isRequired,
    results: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  }).isRequired,
  reason: PropTypes.string.isRequired,
};
