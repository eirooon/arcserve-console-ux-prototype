import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { DEMO_ACCOUNTS } from "../../hooks/azure/azureMockData";
import { primaryTint } from "./azureStyles";

/**
 * Stand-in for the Microsoft identity platform's "Pick an account" popup.
 * In production this is a real OAuth window Arcserve never renders; here it
 * only lets testers choose which account "signs in", and each demo account
 * is labelled with the Step 1 branch it leads to.
 */
export default function SimulatedMicrosoftSignIn({ open, onPick, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="simulated-signin-title">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
          <Stack spacing={0.5}>
            <Chip label="Simulated sign-in" size="small" variant="outlined" sx={{ alignSelf: "flex-start" }} />
            <Typography id="simulated-signin-title" component="h2" variant="body1" sx={{ fontWeight: 700 }}>
              Pick an account
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              to continue to Arcserve
            </Typography>
          </Stack>
          <IconButton onClick={onClose} aria-label="Close sign-in window" size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 1 }}>
        <List aria-label="Accounts">
          {DEMO_ACCOUNTS.map((account) => (
            <ListItemButton key={account.email} onClick={() => onPick(account)} sx={{ borderRadius: 1 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: primaryTint, color: "primary.dark" }}>{account.initials}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={account.email}
                secondary={`${account.name} · Demo: ${account.demoHint}`}
              />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 2, pt: 1 }}>
          <LockOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} aria-hidden />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Your password is entered with Microsoft and never shared with Arcserve.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

SimulatedMicrosoftSignIn.propTypes = {
  open: PropTypes.bool.isRequired,
  onPick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
