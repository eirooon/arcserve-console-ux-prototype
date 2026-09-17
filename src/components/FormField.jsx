import { cloneElement, isValidElement, useId } from "react";
import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";

/**
 * App-wide default form field layout: a label above its control, matching
 * the "Edit Protection Category" modal. When the child is a single element
 * without its own `id`, the label is programmatically associated with it via
 * `htmlFor` for screen readers.
 */
export default function FormField({ label, required, labelAdornment, children, sx }) {
  const fieldId = useId();
  const associable = isValidElement(children) && !children.props.id;

  return (
    <Stack spacing={1} sx={{ minWidth: 0, ...sx }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography
          variant="body2"
          color="text.primary"
          component="label"
          htmlFor={associable ? fieldId : undefined}
        >
          {label}
          {required && (
            <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
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
  required: PropTypes.bool,
  labelAdornment: PropTypes.node,
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};
