import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/** "Cloud Account is now connected" summary (Figma 10306:17708). */
const AzureConnectedView = forwardRef(function AzureConnectedView({ summary }, headingRef) {
  const updated = Boolean(summary.targetAccountId);
  const { app, role, storage } = summary;
  const rows = [
    ["Cloud Account (Display Name)", summary.displayName],
    ["Directory (tenant) ID", summary.tenantId],
    ["Subscription ID", summary.subscriptionId],
    ...(app
      ? [
          ["App Registration", app.name],
          ["Application (client) ID", app.clientId],
          ["Client Secret", "Stored (hidden)"],
          [role.isNew ? "Custom Role Assigned" : "Role Assigned", role.name],
          ["Assigned On", role.scopes.map((scope) => scope.name).join(", ")],
        ]
      : []),
    ...(storage
      ? [
          ["Storage Resource Group", storage.resourceGroup],
          ["Storage Account", storage.account],
          ["Storage Account Key", "Stored (hidden)"],
        ]
      : []),
  ];

  return (
    <Stack spacing={3} sx={{ alignItems: "center", py: 3 }}>
      <CheckCircleIcon sx={{ fontSize: 64, color: "success.main" }} aria-hidden />
      <Typography
        ref={headingRef}
        tabIndex={-1}
        component="h3"
        variant="h6"
        sx={{ fontWeight: 500, textAlign: "center", outline: "none" }}
      >
        {updated ? "Cloud Account is now connected and updated!" : "Cloud Account is now connected and created!"}
      </Typography>
      <Box
        component="dl"
        sx={{ m: 0, width: "100%", maxWidth: 720, border: 1, borderColor: "divider", borderRadius: 2 }}
      >
        {rows.map(([label, value], index) => (
          <Stack
            key={label}
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "space-between",
              p: 2,
              borderTop: index === 0 ? 0 : 1,
              borderColor: "divider",
            }}
          >
            <Typography component="dt" variant="body2">
              {label}
            </Typography>
            <Typography
              component="dd"
              variant="body2"
              sx={{ fontWeight: 500, textAlign: "right", m: 0, wordBreak: "break-all" }}
            >
              {value}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
});

AzureConnectedView.propTypes = {
  summary: PropTypes.object.isRequired,
};

export default AzureConnectedView;
