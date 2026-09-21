import { useId, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormField from "./FormField";

function SaveSearchFormBody({ onClose, onSave, titleId }) {
  const [name, setName] = useState("");

  return (
    <>
      <DialogTitle
        id={titleId}
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2 }}
      >
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Save Search
        </Typography>
        <IconButton onClick={onClose} aria-label="Close dialog" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Enter a name to save this search criteria. A shortcut with this name will be created under
          Saved Searches to quickly choose from.
        </Typography>
        <FormField label="Save Search Name">
          <TextField
            fullWidth
            size="small"
            autoFocus
            placeholder="Enter save search name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>
      </DialogContent>
      <DialogActions sx={{ p: 1 }}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" disabled={!name.trim()} onClick={() => onSave(name.trim())}>
          Save
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * Prompts for a name to save the currently-applied ad-hoc filters as a
 * reusable "Saved Search" chip (see useEntityFilterState/EntityFilterBar —
 * first built for the Jobs page, now shared by every list page using the
 * same filter/search flow).
 */
export default function SaveSearchDialog({ open, onClose, onSave }) {
  const titleId = useId();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby={titleId}>
      {open && <SaveSearchFormBody onClose={onClose} onSave={onSave} titleId={titleId} />}
    </Dialog>
  );
}

SaveSearchDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
