import PropTypes from "prop-types";
import { MenuItem } from "@mui/material";
import FormField from "../../../../components/FormField";
import PlaceholderSelect from "../../../../components/PlaceholderSelect";
import { SUBSCRIPTIONS } from "../../hooks/azure/azureMockData";
import { SMALL_SELECT_PROPS } from "./azureStyles";

/**
 * The subscription Arcserve works in. Shown on Permissions (role rights are
 * checked per subscription), or on Storage when no app is needed.
 */
export default function SubscriptionField({ value, onChange, helperText, disabled = false }) {
  return (
    <FormField label="Subscription">
      <PlaceholderSelect
        size="small"
        fullWidth
        placeholder="Select subscription"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        helperText={helperText}
        disabled={disabled}
        selectProps={SMALL_SELECT_PROPS}
      >
        {SUBSCRIPTIONS.map((subscription) => (
          <MenuItem key={subscription.id} value={subscription.id}>
            {subscription.name}
          </MenuItem>
        ))}
      </PlaceholderSelect>
    </FormField>
  );
}

SubscriptionField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  helperText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
