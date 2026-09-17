import PropTypes from "prop-types";
import { MenuItem, TextField } from "@mui/material";
import FormField from "../../../../../components/FormField";
import { PROTECTION_TYPES } from "../../data/protectionTypes";

/**
 * "1. What to Protect" sub-tab (Figma node 6239:9737): the activity type
 * for this task, defaulted from the Basic step's chosen Protection Type.
 */
export default function WhatToProtectPanel({ activityType, onActivityTypeChange }) {
  return (
    <FormField label="Activity Type" sx={{ maxWidth: 400 }}>
      <TextField
        select
        fullWidth
        size="small"
        value={activityType}
        onChange={(event) => onActivityTypeChange(event.target.value)}
      >
        {PROTECTION_TYPES.map((type) => (
          <MenuItem key={type.id} value={type.label}>
            {type.label}
          </MenuItem>
        ))}
      </TextField>
    </FormField>
  );
}

WhatToProtectPanel.propTypes = {
  activityType: PropTypes.string.isRequired,
  onActivityTypeChange: PropTypes.func.isRequired,
};
