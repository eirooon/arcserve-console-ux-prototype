import { cloneElement, isValidElement, useId } from "react";
import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";

/**
 * App-wide default form field layout: a label above its control, matching
 * the "Edit Protection Category" modal. When the child is a single element
 * without its own `id`, the label is programmatically associated with it via
 * `htmlFor` for screen readers.
 */
export default function FormField({ label, labelId, required, labelAdornment, children, sx }) {
  const fieldId = useId();
  const associable = isValidElement(children) && !children.props.id;

  return (
    <Stack spacing={1} sx={{ minWidth: 0, ...sx }}>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        <Typography
          variant="body2"
          component="label"
          id={labelId}
          htmlFor={associable ? fieldId : undefined}
          sx={{ color: "text.primary" }}
        >
          {label}
          {required && (
            // Visual only — pair `required` with aria-required on the control.
            <Typography component="span" aria-hidden="true" sx={{ color: "error.main", ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>
        {labelAdornment}
      </Stack>
      {associable ? cloneElement(children, { id: fieldId }) : children}
    </Stack>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  // Lets a control that <label for> can't name (e.g. a Select's combobox)
  // point at this label via aria-labelledby instead.
  labelId: PropTypes.string,
  required: PropTypes.bool,
  labelAdornment: PropTypes.node,
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};
