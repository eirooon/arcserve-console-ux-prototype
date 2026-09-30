import PropTypes from "prop-types";
import { MenuItem } from "@mui/material";
import FormField from "../../../../components/FormField";
import PlaceholderSelect from "../../../../components/PlaceholderSelect";
import { SECRET_EXPIRY_OPTIONS } from "../../hooks/azure/azureMockData";
import { SMALL_SELECT_PROPS } from "./azureStyles";

/** How long a new client secret lasts — wizard App step and Replace Secret. */
export default function SecretExpiryField({ value, onChange }) {
  return (
    <FormField label="Client Secret Expires After">
      <PlaceholderSelect
        size="small"
        fullWidth
        placeholder="Select expiry"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        helperText="Arcserve reminds you before it expires, so backups don’t stop."
        selectProps={SMALL_SELECT_PROPS}
      >
        {SECRET_EXPIRY_OPTIONS.map((option) => (
          <MenuItem key={option.months} value={option.months}>
            {option.label}
          </MenuItem>
        ))}
      </PlaceholderSelect>
    </FormField>
  );
}

SecretExpiryField.propTypes = { value: PropTypes.number.isRequired, onChange: PropTypes.func.isRequired };
