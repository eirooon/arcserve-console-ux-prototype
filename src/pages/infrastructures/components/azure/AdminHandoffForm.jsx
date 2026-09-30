import PropTypes from "prop-types";
import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";

/**
 * Email + "Send Link" for handing Azure setup to an admin. Once sent, it
 * points the user to where the request is tracked (a "Pending admin setup"
 * row in Cloud Accounts) instead of leaving them at a dead end.
 */
export default function AdminHandoffForm({ email, onEmailChange, canSend, sending, sentTo, onSend }) {
  if (sentTo) {
    return (
      <Alert severity="success" role="status">
        Setup link sent to {sentTo}. You can track it in Cloud Accounts, where it shows as “Pending admin setup” —
        you can close this window.
      </Alert>
    );
  }

  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (canSend && !sending) onSend();
      }}
      sx={{ display: "flex", gap: 1 }}
    >
      <TextField
        size="small"
        fullWidth
        type="email"
        placeholder="e.g. admin@mail.com"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        slotProps={{ htmlInput: { "aria-label": "Azure admin email" } }}
        sx={{ bgcolor: "background.paper" }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!canSend || sending}
        startIcon={sending ? <CircularProgress size={16} color="inherit" /> : undefined}
        sx={{ flexShrink: 0 }}
      >
        Send Link
      </Button>
    </Box>
  );
}

AdminHandoffForm.propTypes = {
  email: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  canSend: PropTypes.bool.isRequired,
  sending: PropTypes.bool.isRequired,
  sentTo: PropTypes.string,
  onSend: PropTypes.func.isRequired,
};
