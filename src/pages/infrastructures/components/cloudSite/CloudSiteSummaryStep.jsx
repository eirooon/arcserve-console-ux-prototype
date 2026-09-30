import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toastStore } from "../../../../api/toastStore";
import { getDeploymentSize } from "../../hooks/cloudSite/cloudSiteOptions";
import { formatMonthlyCost } from "../../hooks/cloudSite/cloudSiteForm";

const NOT_SET = "Not set";
const yesNo = (value) => (value ? "Yes" : "No");

function sizeLabel(value) {
  return getDeploymentSize(value)?.label ?? NOT_SET;
}

// Row order follows the design. Passwords are never echoed back.
function buildSummary(values, estimatedCost) {
  const storage = values.storageSize.trim();
  return [
    ["Name", values.name.trim()],
    ["Cloud Account", values.cloudAccount],
    ["Resource Group", values.resourceGroup],
    ["Region", values.region],
    ["Host Name", values.hostName.trim()],
    ["Network", values.network],
    ["Subnet", values.subnet],
    ["Security Group", values.securityGroup],
    ["Auto-assign Public IP", yesNo(values.autoAssignPublicIp)],
    ["Container/Bucket Name", values.containerName.trim()],
    ["Data Store Encryption", yesNo(values.encryptData)],
    ["Deployment Size", sizeLabel(values.deploymentSize)],
    ["Storage Size", storage ? `${storage} GB` : NOT_SET],
    ["Estimated Cost", formatMonthlyCost(estimatedCost)],
  ];
}

async function copyCode(code) {
  try {
    await navigator.clipboard.writeText(code);
    toastStore.pushToast("Authorization code copied.");
  } catch {
    toastStore.pushToast("Couldn't copy the code. Select it and copy it manually.", "error");
  }
}

/**
 * "Add Cloud Site" step 2 — Summary (Figma node 6391:3528): the site
 * has been configured; shows what was set up and the gateway authorization
 * code. The status line takes focus on arrival so screen readers announce
 * the result.
 */
const CloudSiteSummaryStep = forwardRef(function CloudSiteSummaryStep(
  { values, estimatedCost, authCode },
  statusRef,
) {
  const summary = buildSummary(values, estimatedCost);

  return (
    <Stack spacing={3} divider={<Divider flexItem />}>
      <Typography ref={statusRef} tabIndex={-1} variant="body2" sx={{ outline: "none" }}>
        Cloud Site has been successfully configured.
      </Typography>

      <Box
        component="dl"
        sx={{ m: 0, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "200px 1fr" }, columnGap: 0.5, rowGap: 1 }}
      >
        {summary.map(([label, value]) => (
          <Box key={label} sx={{ display: "contents" }}>
            <Typography component="dt" variant="body2" sx={{ fontWeight: 500 }}>
              {label}
            </Typography>
            <Typography
              component="dd"
              variant="body2"
              sx={{ color: "text.secondary", m: 0, overflowWrap: "anywhere" }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography component="h3" variant="body2" sx={{ fontWeight: 500 }}>
            Instructions for Arcserve Remote Management Gateway Installation:
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            The gateway will be installed and authorized automatically. The authorization code is provided for
            reference purposes only.
          </Typography>
        </Stack>
        <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
          <Stack spacing={1} sx={{ width: "100%" }}>
            <Typography id="gateway-auth-code-label" component="h4" variant="body2" sx={{ fontWeight: 500 }}>
              Gateway Authorization Code
            </Typography>
            <Box
              component="output"
              aria-labelledby="gateway-auth-code-label"
              sx={{
                display: "block",
                p: 2,
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "action.hover" : blueGrey[50]),
                typography: "body2",
                wordBreak: "break-all",
              }}
            >
              {authCode}
            </Box>
          </Stack>
          <Button variant="outlined" color="secondary" startIcon={<ContentCopyIcon />} onClick={() => copyCode(authCode)}>
            Copy Code
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
});

CloudSiteSummaryStep.propTypes = {
  values: PropTypes.object.isRequired,
  estimatedCost: PropTypes.number.isRequired,
  authCode: PropTypes.string.isRequired,
};

export default CloudSiteSummaryStep;
