import { useId } from "react";
import PropTypes from "prop-types";
import { Box, Paper, Stack, Typography } from "@mui/material";

/**
 * One card on the account page (Figma 10378:18865): a title, a subtitle,
 * an optional header action, then label/value rows.
 */
export function DetailsSection({ title, subtitle, action, children }) {
  const titleId = useId();
  return (
    <Paper component="section" variant="outlined" aria-labelledby={titleId} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: "center", px: 2, py: 1.5, borderBottom: children ? 1 : 0, borderColor: "divider" }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography id={titleId} component="h3" variant="body1" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {subtitle}
          </Typography>
        </Box>
        {action}
      </Stack>
      {children && (
        <Box component="dl" sx={{ m: 0 }}>
          {children}
        </Box>
      )}
    </Paper>
  );
}

DetailsSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  action: PropTypes.node,
  children: PropTypes.node,
};

/** A label/value row inside a DetailsSection, with an optional row action. */
export function DetailsRow({ label, children, action, muted = false }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 0.5, sm: 6 }}
      sx={{
        alignItems: { xs: "flex-start", sm: "center" },
        px: 2,
        py: 1.5,
        "& + &": { borderTop: 1, borderColor: "divider" }
      }}
    >
      <Typography
        component="dt"
        variant="body2"
        sx={{
          color: "text.secondary",
          width: { sm: 220 },
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      {/* The action lives inside <dd>: a <dl> row may only hold dt/dd. */}
      <Box
        component="dd"
        sx={{ m: 0, flex: 1, minWidth: 0, width: { xs: "100%", sm: "auto" }, display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box sx={{ flex: 1, minWidth: 0, typography: "body2", color: muted ? "text.secondary" : "text.primary" }}>
          {children}
        </Box>
        {action}
      </Box>
    </Stack>
  );
}

DetailsRow.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  action: PropTypes.node,
  muted: PropTypes.bool,
};
