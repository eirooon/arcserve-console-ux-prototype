import { memo } from "react";
import PropTypes from "prop-types";
import { LinearProgress, Stack, Typography } from "@mui/material";
import IconCell from "../../../components/IconCell";
import { SITE_STATUS_META, SITE_STATUS_DEPLOYING } from "../hooks/siteStatus";

/**
 * Sites "Status" cell: a determinate progress bar plus "Deploying (n%
 * completed)" while a cloud site deploys, otherwise icon + label.
 */
function SiteStatusCell({ status, deployProgress = 0 }) {
  if (status === SITE_STATUS_DEPLOYING) {
    const label = `Deploying (${deployProgress}% completed)`;
    return (
      <Stack spacing={0.5} sx={{ justifyContent: "center", height: "100%", width: "100%" }}>
        <LinearProgress
          variant="determinate"
          color="primary"
          value={deployProgress}
          aria-label={label}
          sx={{ borderRadius: 1 }}
        />
        <Typography variant="body2" noWrap sx={{ color: "secondary.main" }}>
          {label}
        </Typography>
      </Stack>
    );
  }

  const meta = SITE_STATUS_META[status];
  return <IconCell icon={meta?.icon} label={meta?.label} color={meta?.color} showLabel />;
}

SiteStatusCell.propTypes = {
  status: PropTypes.string,
  deployProgress: PropTypes.number,
};

export default memo(SiteStatusCell);
