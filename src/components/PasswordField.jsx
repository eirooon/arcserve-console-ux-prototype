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
export default function PasswordField({ label, value, onChange, placeholder, sx }) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField label={label} sx={sx}>
      <TextField
        fullWidth
        size="small"
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{
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
  placeholder: PropTypes.string,
  sx: PropTypes.object,
};
