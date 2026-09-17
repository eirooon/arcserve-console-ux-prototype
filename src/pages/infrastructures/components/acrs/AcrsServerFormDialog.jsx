import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormField from "../../../../components/FormField";
import PasswordField from "../../../../components/PasswordField";
import { useInfrastructureData } from "../../hooks/useInfrastructureData";

const selectSiteRows = (state) => ({ rows: state.rows });

const EMPTY_VALUES = {
  site: "",
  displayName: "",
  hostnameIp: "",
  username: "",
  password: "",
};

// Holds the form state. Rendered only while the dialog is open (see the
// `open &&` guard below), so it mounts fresh — with correct initial values —
// every time Add/Modify is invoked, same reasoning as ConfigureNetworkForm.
function AcrsServerForm({ mode, initialValues, saving, onClose, onSubmit }) {
  const { rows: sites } = useInfrastructureData(selectSiteRows);
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues, password: "" });

  const setField = (field, value) => setValues((current) => ({ ...current, [field]: value }));

  const canSave = values.displayName.trim().length > 0;

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
          {mode === "edit" ? "Edit Arcserve Cyber Resilient Server" : "Add Arcserve Cyber Resilient Server"}
        </Typography>
        <IconButton onClick={onClose} aria-label="Close dialog" size="small" disabled={saving}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormField label="Site">
          <TextField
            select
            size="small"
            fullWidth
            disabled={mode === "edit"}
            value={values.site}
            onChange={(event) => setField("site", event.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="" disabled>
              Select site
            </MenuItem>
            {sites.map((site) => (
              <MenuItem key={site.id} value={site.name}>
                {site.name}
              </MenuItem>
            ))}
          </TextField>
        </FormField>
        <FormField label="Display Name" required>
          <TextField
            size="small"
            fullWidth
            placeholder="Enter Display Name"
            value={values.displayName}
            onChange={(event) => setField("displayName", event.target.value)}
          />
        </FormField>
        <FormField label="Hostname/IP Address">
          <TextField
            size="small"
            fullWidth
            placeholder="Enter Hostname/IP Address"
            value={values.hostnameIp}
            onChange={(event) => setField("hostnameIp", event.target.value)}
          />
        </FormField>
        <FormField label="Username">
          <TextField
            size="small"
            fullWidth
            placeholder="Enter username"
            value={values.username}
            onChange={(event) => setField("username", event.target.value)}
          />
        </FormField>
        <PasswordField
          label="Password"
          placeholder="Enter password"
          value={values.password}
          onChange={(value) => setField("password", value)}
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
            Save
          </Button>
        </Stack>
      </DialogActions>
    </>
  );
}

/**
 * Add/Modify dialog for Arcserve Cyber Resilient Servers (Figma "UXD-16 CRS
 * Management", node 7316:7481) — a bespoke layout (Site select, required
 * Display Name, credentials) rather than the generic schema-driven
 * EntityFormDialog used by the other infrastructure pages.
 */
export default function AcrsServerFormDialog({ open, mode, initialValues, saving, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {open && (
        <AcrsServerForm
          mode={mode}
          initialValues={initialValues}
          saving={saving}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Dialog>
  );
}

AcrsServerFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["add", "edit"]),
  initialValues: PropTypes.shape({
    site: PropTypes.string,
    displayName: PropTypes.string,
    hostnameIp: PropTypes.string,
    username: PropTypes.string,
  }),
  saving: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

AcrsServerForm.propTypes = {
  mode: PropTypes.oneOf(["add", "edit"]),
  initialValues: PropTypes.object,
  saving: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
