import PropTypes from "prop-types";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toastStore } from "../../../../api/toastStore";
import { AZURE_SERVICES, ROLE_ACTIONS_BY_SERVICE } from "../../hooks/azure/azureMockData";

const TITLE_ID = "azure-permission-list-title";

// Groups a flat action list by the Azure service it belongs to, in the same
// order as ROLE_ACTIONS_BY_SERVICE.
function groupByService(actions) {
  return Object.entries(ROLE_ACTIONS_BY_SERVICE)
    .map(([service, serviceActions]) => ({
      service,
      actions: serviceActions.filter((roleAction) => actions.includes(roleAction)),
    }))
    .filter((group) => group.actions.length > 0);
}

async function copyActions(actions) {
  try {
    await navigator.clipboard.writeText(JSON.stringify({ Actions: actions }, null, 2));
    toastStore.pushToast("Permissions copied as a role definition.");
  } catch {
    toastStore.pushToast("Couldn't copy the permissions. Select them and copy them manually.", "error");
  }
}

/**
 * A long permission list (up to 25 actions) in its own dialog, so viewing it
 * never pushes the step content down. "Copy" gives the list in Azure's role
 * definition shape, ready to send to an Azure admin.
 */
export default function PermissionListDialog({ open, title, description, actions, onClose }) {
  const groups = groupByService(actions);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper" aria-labelledby={TITLE_ID}>
      <DialogTitle id={TITLE_ID}>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
          {groups.map((group) => (
            <Box key={group.service}>
              <Typography component="h3" variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                {AZURE_SERVICES[group.service]} ({group.actions.length})
              </Typography>
              <Box
                component="ul"
                sx={{ m: 0, pl: 2.5, fontFamily: "monospace", fontSize: 13, color: "text.secondary", lineHeight: 1.7, overflowWrap: "anywhere" }}
              >
                {group.actions.map((roleAction) => (
                  <li key={roleAction}>{roleAction}</li>
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button color="secondary" startIcon={<ContentCopyIcon fontSize="small" />} onClick={() => copyActions(actions)}>
          Copy
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PermissionListDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
};
