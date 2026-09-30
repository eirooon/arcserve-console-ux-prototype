import PropTypes from "prop-types";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { smallControlsSx } from "../azureStyles";

/**
 * Shell for the account page's edit dialogs. Its body (`children`) is only
 * mounted while open, so every opening starts from the saved values; the
 * body renders DetailsDialogLayout so its own state drives Save.
 * Can't be dismissed while saving.
 */
export function DetailsDialog({ open, titleId, busy, onClose, children }) {
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      maxWidth={false}
      fullWidth
      slotProps={{ paper: { sx: { maxWidth: 640 } } }}
      aria-labelledby={titleId}
    >
      {open && children}
    </Dialog>
  );
}

DetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  titleId: PropTypes.string.isRequired,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

/** Title, 14px form content, and Cancel / primary actions. */
export function DetailsDialogLayout({ titleId, title, busy, onClose, primaryLabel, busyLabel, canSave, onSave, children }) {
  return (
    <>
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <DialogContent dividers sx={smallControlsSx}>
        {children}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button variant="outlined" color="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSave} disabled={!canSave || busy}>
          {busy ? busyLabel : primaryLabel}
        </Button>
      </DialogActions>
    </>
  );
}

DetailsDialogLayout.propTypes = {
  titleId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  busy: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  primaryLabel: PropTypes.string.isRequired,
  busyLabel: PropTypes.string.isRequired,
  canSave: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
