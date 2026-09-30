import { useId } from "react";
import PropTypes from "prop-types";
import { MenuItem } from "@mui/material";
import FormField from "./FormField";
import PlaceholderSelect from "./PlaceholderSelect";

/**
 * A labeled single-select in the app-wide FormField layout (label above),
 * with a muted placeholder (see PlaceholderSelect). The label names the
 * select's combobox via aria-labelledby, since <label for> can't.
 */
export default function SelectField({
  label,
  required,
  placeholder,
  value,
  options,
  onChange,
  onBlur,
  error,
  helperText,
  disabled,
  inputRef,
  selectProps,
  sx,
}) {
  const labelId = useId();
  const id = useId();

  return (
    <FormField label={label} labelId={labelId} required={required} sx={sx}>
      <PlaceholderSelect
        id={id}
        fullWidth
        size="small"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        disabled={disabled}
        inputRef={inputRef}
        selectProps={{
          ...selectProps,
          SelectDisplayProps: { "aria-labelledby": labelId, "aria-required": required || undefined },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </PlaceholderSelect>
    </FormField>
  );
}

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.node,
  disabled: PropTypes.bool,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectProps: PropTypes.object,
  sx: PropTypes.object,
};
