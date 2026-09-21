import { useId, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlaceholderSelect from "./PlaceholderSelect";
import { buildEmptyFilters, resolveFieldOptions } from "../utils/entityFilters";

// A "label above field" PlaceholderSelect, matching FormField's visual
// layout (see src/components/FormField.jsx) but wiring the label itself as
// MUI Select's `labelId` instead of relying on FormField's `htmlFor`. A
// plain `<label for>` only gives an accessible name to real form controls
// (input/select/textarea); MUI's Select renders a `div[role="combobox"]`,
// which always sets its own `aria-labelledby` pointing at itself — that
// self-reference wins over `htmlFor` *and* over a plain `aria-label`,
// silently discarding the visible label text unless `labelId` is folded
// into that same `aria-labelledby` chain.
function FilterSelectField({ id, label, sx, selectProps, children, ...selectFieldProps }) {
  const labelId = `${id}-label`;
  return (
    <Stack spacing={1} sx={{ minWidth: 0, ...sx }}>
      <Typography id={labelId} variant="body2" color="text.primary" component="label">
        {label}
      </Typography>
      <PlaceholderSelect
        placeholder="Select"
        fullWidth
        size="small"
        id={id}
        selectProps={{ labelId, ...selectProps }}
        {...selectFieldProps}
      >
        {children}
      </PlaceholderSelect>
    </Stack>
  );
}

// Rendered only while the dialog is open (see EntityFiltersDialog below), so
// it mounts fresh — with the currently-applied filters as its starting
// point — every time the "Filters" button is clicked, matching
// EntityFormDialog's same reasoning for its form body.
function FiltersFormBody({ title, fields, rows, initialFilters, onClose, onSearch, titleId }) {
  const emptyFilters = useMemo(() => buildEmptyFilters(fields), [fields]);
  const [filters, setFilters] = useState({ ...emptyFilters, ...initialFilters });
  const baseId = useId();

  const setField = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <>
      <DialogTitle
        id={titleId}
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2 }}
      >
        <Typography variant="body1" fontWeight={700} color="text.primary">
          {title}
        </Typography>
        <IconButton onClick={onClose} aria-label="Close dialog" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignContent: "flex-start" }}>
        {fields.map((field) => {
          const fieldId = `${baseId}-${field.key}`;
          const options = resolveFieldOptions(field, rows);
          const disabled = options.length === 0;

          if (field.type === "multiselect") {
            const value = filters[field.key];
            return (
              <FilterSelectField
                key={field.key}
                id={fieldId}
                label={field.label}
                sx={{ flex: "1 1 240px" }}
                disabled={disabled}
                value={value}
                onChange={(event) => setField(field.key, event.target.value)}
                selectProps={{
                  multiple: true,
                  renderValue: (selected) => {
                    if (!selected.length) {
                      return (
                        <Typography component="span" variant="body2" color="text.secondary">
                          Select
                        </Typography>
                      );
                    }
                    if (selected.length === 1) {
                      return options.find((option) => option.value === selected[0])?.label ?? selected[0];
                    }
                    return `${selected.length} selected`;
                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox size="small" checked={value.includes(option.value)} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </FilterSelectField>
            );
          }

          return (
            <FilterSelectField
              key={field.key}
              id={fieldId}
              label={field.label}
              sx={{ flex: "1 1 240px" }}
              disabled={disabled}
              value={filters[field.key]}
              onChange={(event) => setField(field.key, event.target.value)}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </FilterSelectField>
          );
        })}
      </DialogContent>
      <DialogActions sx={{ p: 1 }}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => setFilters(emptyFilters)}>
          Clear
        </Button>
        <Button variant="contained" onClick={() => onSearch(filters)}>
          Search
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * A list page's "Filters" modal, driven entirely by a `fields` schema (see
 * src/utils/entityFilters.js for the field descriptor shape) instead of a
 * bespoke form per page — first built for the Jobs page, now shared by every
 * list page using the same filter/search flow (see useEntityFilterState).
 * `initialFilters` seeds the form with whatever's currently applied (ad-hoc
 * or from an active saved search) so re-opening it shows the criteria in
 * effect. "Clear" only resets the form's own fields — nothing is applied
 * until "Search" is pressed.
 */
export default function EntityFiltersDialog({ open, title = "Filters", fields, rows, initialFilters, onClose, onSearch }) {
  const titleId = useId();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby={titleId}>
      {open && (
        <FiltersFormBody
          title={title}
          fields={fields}
          rows={rows}
          initialFilters={initialFilters}
          onClose={onClose}
          onSearch={onSearch}
          titleId={titleId}
        />
      )}
    </Dialog>
  );
}

EntityFiltersDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["select", "multiselect", "dateRange"]).isRequired,
      field: PropTypes.string.isRequired,
    }),
  ).isRequired,
  rows: PropTypes.array.isRequired,
  initialFilters: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};
