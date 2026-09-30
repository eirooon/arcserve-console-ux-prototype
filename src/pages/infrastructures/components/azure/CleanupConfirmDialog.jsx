import PropTypes from "prop-types";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";

const TITLE_ID = "azure-cleanup-title";

const COPY = {
  cancel: { title: "Cancel setup?", remove: "Remove and Cancel", keep: "Keep and Cancel" },
  startOver: { title: "Start over?", remove: "Remove and Start Over", keep: "Keep and Start Over" },
};

/**
 * Cancel / Start Over after steps already created things in Azure: remove
 * them (the safe default), or keep them — nothing is left behind silently.
 */
export default function CleanupConfirmDialog({ intent, items, removing, onRemove, onKeep, onBack }) {
  const copy = COPY[intent ?? "cancel"];
  return (
    <Dialog open={Boolean(intent)} onClose={removing ? undefined : onBack} maxWidth="sm" fullWidth aria-labelledby={TITLE_ID}>
      <DialogTitle id={TITLE_ID}>{copy.title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Arcserve already created these in Azure:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, typography: "body2" }}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Remove them, or keep them to reuse later.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button variant="outlined" color="secondary" onClick={onBack} disabled={removing}>
          Go Back
        </Button>
        <Stack direction="row" spacing={1}>
          <Button color="secondary" onClick={onKeep} disabled={removing}>
            {copy.keep}
          </Button>
          <Button variant="contained" color="error" onClick={onRemove} disabled={removing}>
            {removing ? "Removing…" : copy.remove}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

CleanupConfirmDialog.propTypes = {
  intent: PropTypes.oneOf(["cancel", "startOver"]),
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  removing: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  onKeep: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
