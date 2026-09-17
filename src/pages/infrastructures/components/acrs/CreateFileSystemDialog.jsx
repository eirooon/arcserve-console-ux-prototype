import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormField from "../../../../components/FormField";

const POOL_OPTIONS = ["Pool 1", "Pool 2"];

const EMPTY_VALUES = {
  name: "",
  pool: "",
  mountAutomatically: true,
};

// Holds the form state. Rendered only while the dialog is open (see the
// `open &&` guard below), so it mounts fresh every time "Create File System"
// is invoked, same reasoning as AcrsServerFormDialog/ConfigureNetworkForm.
function CreateFileSystemForm({ saving, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY_VALUES);

  const setField = (field, value) => setValues((current) => ({ ...current, [field]: value }));

  const canSave = values.name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSave) return;
    onSubmit(values);
  };

  return (
    <>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2 }}
      >
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Create File System
        </Typography>
        <IconButton onClick={onClose} aria-label="Close dialog" size="small" disabled={saving}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormField label="File System Name" required>
          <TextField
            size="small"
            fullWidth
            placeholder="Enter File System Name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
          />
        </FormField>
        <FormField label="Pool">
          <TextField
            select
            size="small"
            fullWidth
            value={values.pool}
            onChange={(event) => setField("pool", event.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="" disabled>
              Select pool
            </MenuItem>
            {POOL_OPTIONS.map((pool) => (
              <MenuItem key={pool} value={pool}>
                {pool}
              </MenuItem>
            ))}
          </TextField>
        </FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.mountAutomatically}
              onChange={(event) => setField("mountAutomatically", event.target.checked)}
            />
          }
          label="Mount this file system automatically"
        />
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1, justifyContent: "space-between" }}>
        <Button color="secondary" disabled>
          Help
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving || !canSave}>
            Create
          </Button>
        </Stack>
      </DialogActions>
    </>
  );
}

/**
 * "Create File System" dialog (Figma "UXD-16 CRS Management", node
 * 7316:7874), opened from the File Systems tab on an ACRS server's details
 * page.
 */
export default function CreateFileSystemDialog({ open, saving, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {open && <CreateFileSystemForm saving={saving} onClose={onClose} onSubmit={onSubmit} />}
    </Dialog>
  );
}

CreateFileSystemDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  saving: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

CreateFileSystemForm.propTypes = {
  saving: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
