import { useId, useState } from "react";
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

function toInputValue(field, rawValue) {
  if (field.type === "boolean") return Boolean(rawValue);
  if (field.type === "datetime") {
    if (!rawValue) return "";
    const date = new Date(rawValue);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
  }
  return rawValue ?? "";
}

function buildInitialValues(fields, initialValues) {
  return Object.fromEntries(
    fields.map((field) => [field.field, toInputValue(field, initialValues?.[field.field])]),
  );
}

function toSubmitValue(field, rawValue) {
  if (field.type === "number") return rawValue === "" ? null : Number(rawValue);
  if (field.type === "datetime") return rawValue === "" ? null : new Date(rawValue).toISOString();
  return rawValue;
}

// Holds the form state. Rendered only while the dialog is open, so it mounts
// fresh — with correct initial values — every time Add/Edit is invoked.
// (The outer EntityFormDialog component never unmounts, since the parent
// keeps it in the tree and just toggles `open`, so state can't live there.)
function EntityFormBody({ mode, entityLabel, fields, initialValues, saving, onClose, onSubmit, titleId }) {
  const [values, setValues] = useState(() => buildInitialValues(fields, initialValues));

  const handleChange = (field, rawValue) => {
    setValues((current) => ({ ...current, [field.field]: rawValue }));
  };

  const handleSubmit = () => {
    const payload = Object.fromEntries(
      fields.map((field) => [field.field, toSubmitValue(field, values[field.field])]),
    );
    onSubmit(payload);
  };

  return (
    <>
      <DialogTitle
        id={titleId}
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2 }}
      >
        <Typography variant="body1" fontWeight={700} color="text.primary">
          {mode === "edit" ? `Edit ${entityLabel}` : `Add ${entityLabel}`}
        </Typography>
        <IconButton onClick={onClose} aria-label="Close dialog" size="small" disabled={saving}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Stack spacing={2}>
          {fields.map((field) => {
            if (field.type === "boolean") {
              return (
                <FormControlLabel
                  key={field.field}
                  control={
                    <Checkbox
                      checked={Boolean(values[field.field])}
                      onChange={(event) => handleChange(field, event.target.checked)}
                    />
                  }
                  label={field.label}
                />
              );
            }

            if (field.type === "select") {
              return (
                <TextField
                  key={field.field}
                  select
                  fullWidth
                  size="small"
                  label={field.label}
                  value={values[field.field] ?? ""}
                  onChange={(event) => handleChange(field, event.target.value)}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }

            return (
              <TextField
                key={field.field}
                fullWidth
                size="small"
                label={field.label}
                type={
                  field.type === "number" ? "number" : field.type === "datetime" ? "datetime-local" : "text"
                }
                slotProps={field.type === "datetime" ? { inputLabel: { shrink: true } } : undefined}
                value={values[field.field] ?? ""}
                onChange={(event) => handleChange(field, event.target.value)}
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {mode === "edit" ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * Generic add/edit form driven by a field schema, reused across every
 * mocked list page instead of hand-building a bespoke dialog per entity.
 */
export default function EntityFormDialog({
  open,
  mode,
  entityLabel,
  fields,
  initialValues,
  saving,
  onClose,
  onSubmit,
}) {
  const titleId = useId();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby={titleId}>
      {open && (
        <EntityFormBody
          mode={mode}
          entityLabel={entityLabel}
          fields={fields}
          initialValues={initialValues}
          saving={saving}
          onClose={onClose}
          onSubmit={onSubmit}
          titleId={titleId}
        />
      )}
    </Dialog>
  );
}

EntityFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["add", "edit"]),
  entityLabel: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["text", "number", "boolean", "datetime", "select"]),
      options: PropTypes.arrayOf(
        PropTypes.shape({ value: PropTypes.string, label: PropTypes.string }),
      ),
    }),
  ).isRequired,
  initialValues: PropTypes.object,
  saving: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
