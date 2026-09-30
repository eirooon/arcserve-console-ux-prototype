import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

/**
 * An "i" icon that explains something in a tooltip. It's a real button, so
 * keyboard users can focus it to read the tip too (a bare icon only shows
 * its tooltip on mouse hover). `label` names the button for screen readers,
 * e.g. "About Virtual Machine Details".
 */
export default function InfoTip({ title, label }) {
  return (
    <Tooltip title={title} placement="right" describeChild>
      <IconButton
        size="small"
        aria-label={label}
        sx={{ p: 0.25, color: "action.active" }}
      >
        <InfoIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

InfoTip.propTypes = {
  title: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};
