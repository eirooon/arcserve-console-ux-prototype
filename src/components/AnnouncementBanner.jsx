import { Alert, AlertTitle, Button, IconButton, Stack, SvgIcon, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import ArcGenieSparkleIcon from "../assets/arc-genie-sparkle.svg?react";

const ARC_GENIE_GRADIENT =
  "linear-gradient(90deg, #8A2BFF 0%, #00A7E1 31.429%)";

/**
 * Dismissible info banner for feature announcements.
 * Presentation only — visibility/persistence is owned by the caller.
 */
export default function AnnouncementBanner({
  icon = <SvgIcon component={ArcGenieSparkleIcon} inheritViewBox sx={{ fontSize: 32 }} />,
  title,
  description,
  actionLabel,
  onAction,
  onClose,
  sx,
}) {
  return (
    <Alert
      severity="info"
      icon={icon}
      action={
        <Stack direction="row" spacing={3} alignItems="center">
          {actionLabel && (
            <Button variant="contained" size="small" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          <IconButton
            size="small"
            aria-label="Dismiss announcement"
            onClick={onClose}
          >
            <Close fontSize="small" />
          </IconButton>
        </Stack>
      }
      sx={{
        alignItems: "center",
        borderRadius: 2,
        py: "20px",
        px: "24px",
        "& .MuiAlert-icon": { marginRight: "24px", padding: 0 },
        "& .MuiAlert-message": { flex: 1, minWidth: 0, padding: 0 },
        "& .MuiAlert-action": {
          alignItems: "center",
          marginLeft: "24px",
          paddingLeft: 0,
          marginTop: 0,
          marginBottom: 0,
          marginRight: 0,
        },
        ...sx,
      }}
    >
      {title && (
        <AlertTitle
          sx={{
            m: 0,
            fontWeight: 700,
            fontSize: 16,
            background: ARC_GENIE_GRADIENT,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </AlertTitle>
      )}
      {description && (
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      )}
    </Alert>
  );
}
