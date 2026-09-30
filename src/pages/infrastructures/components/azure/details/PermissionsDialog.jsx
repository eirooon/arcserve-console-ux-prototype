import PropTypes from "prop-types";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { AZURE_SERVICES, ROLE_ACTIONS_BY_SERVICE, describeScopes } from "../../../hooks/azure/azureMockData";

const TITLE_ID = "azure-permissions-title";

/** Permissions → View Permissions: what the role must grant, by service. */
export default function PermissionsDialog({ open, roleName, services, scopes, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby={TITLE_ID}>
      <DialogTitle id={TITLE_ID}>{roleName} Permissions</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Assigned on {describeScopes(scopes)}. These are the permissions Arcserve needs for what this account is used
            for.
          </Typography>
          {services.map((service) => (
            <Box key={service}>
              <Typography component="h3" variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                {AZURE_SERVICES[service]}
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, fontFamily: "monospace", fontSize: 13, color: "text.secondary" }}>
                {ROLE_ACTIONS_BY_SERVICE[service].map((roleAction) => (
                  <li key={roleAction}>{roleAction}</li>
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PermissionsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  roleName: PropTypes.string.isRequired,
  services: PropTypes.arrayOf(PropTypes.string).isRequired,
  scopes: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string, name: PropTypes.string })).isRequired,
  onClose: PropTypes.func.isRequired,
};
