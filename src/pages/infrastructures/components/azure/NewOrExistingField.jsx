import PropTypes from "prop-types";
import { FormControlLabel, MenuItem, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import FormField from "../../../../components/FormField";
import PlaceholderSelect from "../../../../components/PlaceholderSelect";
import { SMALL_SELECT_PROPS } from "./azureStyles";

// "Create new" / "Use existing" choice plus the matching name field or
// picker — the same shape for Resource Group and Storage Account.
export default function NewOrExistingField({
  label,
  existingLabel,
  existingPlaceholder,
  mode,
  onModeChange,
  newLabel,
  newPlaceholder,
  newValue,
  onNewChange,
  newError,
  existingOptions,
  existingValue,
  onExistingChange,
  existingError,
}) {
  const labelId = `${label.replace(/\s+/g, "-").toLowerCase()}-mode`;
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography id={labelId} variant="body2" sx={{ color: "text.primary" }}>
          {label}
        </Typography>
        <RadioGroup row aria-labelledby={labelId} value={mode} onChange={(event) => onModeChange(event.target.value)}>
          <FormControlLabel value="new" control={<Radio size="small" />} label="Create new" />
          <FormControlLabel value="existing" control={<Radio size="small" />} label="Use existing" />
        </RadioGroup>
      </Stack>
      {mode === "new" ? (
        <FormField label={newLabel}>
          <TextField
            size="small"
            fullWidth
            placeholder={newPlaceholder}
            value={newValue}
            onChange={(event) => onNewChange(event.target.value)}
            error={Boolean(newError)}
            helperText={newError}
          />
        </FormField>
      ) : (
        <FormField label={existingLabel}>
          <PlaceholderSelect
            size="small"
            fullWidth
            placeholder={existingPlaceholder}
            value={existingValue}
            onChange={(event) => onExistingChange(event.target.value)}
            error={Boolean(existingError) && existingValue !== ""}
            selectProps={SMALL_SELECT_PROPS}
          >
            {existingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </PlaceholderSelect>
        </FormField>
      )}
    </Stack>
  );
}

NewOrExistingField.propTypes = {
  label: PropTypes.string.isRequired,
  existingLabel: PropTypes.string.isRequired,
  existingPlaceholder: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["new", "existing"]).isRequired,
  onModeChange: PropTypes.func.isRequired,
  newLabel: PropTypes.string.isRequired,
  newPlaceholder: PropTypes.string.isRequired,
  newValue: PropTypes.string.isRequired,
  onNewChange: PropTypes.func.isRequired,
  newError: PropTypes.string,
  existingOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  existingValue: PropTypes.string.isRequired,
  onExistingChange: PropTypes.func.isRequired,
  existingError: PropTypes.string,
};
