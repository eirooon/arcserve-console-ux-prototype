import { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import FormField from "./FormField";

/**
 * A password `TextField` wrapped in the app-wide `FormField` label, with a
 * show/hide toggle so entered credentials can be visually verified. Shared
 * by every password field in the app instead of each form re-implementing
 * its own visibility toggle.
 */
export default function PasswordField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  error,
  helperText,
  autoComplete,
  inputRef,
  labelAdornment,
  sx,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField label={label} required={required} labelAdornment={labelAdornment} sx={sx}>
      <TextField
        fullWidth
        size="small"
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        autoComplete={autoComplete}
        inputRef={inputRef}
        slotProps={{
          htmlInput: { "aria-required": required || undefined },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
                  onClick={() => setVisible((current) => !current)}
                  edge="end"
                >
                  {visible ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </FormField>
  );
}

PasswordField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.node,
  autoComplete: PropTypes.string,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  labelAdornment: PropTypes.node,
  sx: PropTypes.object,
};
