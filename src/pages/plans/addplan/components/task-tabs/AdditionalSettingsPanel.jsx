import PropTypes from "prop-types";
import { Checkbox, FormControlLabel } from "@mui/material";

/**
 * "4. Additional Settings" sub-tab (Figma node 8327:27661).
 */
export default function AdditionalSettingsPanel({ executeCopyJobsInParallel, onChange }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={executeCopyJobsInParallel}
          onChange={(event) => onChange(event.target.checked)}
        />
      }
      label="Execute all copy jobs using this task as the source of copy in parallel"
    />
  );
}

AdditionalSettingsPanel.propTypes = {
  executeCopyJobsInParallel: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
