import { Button, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

function SourceColumn({ label, primary, secondary, color }) {
  return (
    <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 11 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} color={color ?? "text.primary"} noWrap>
        {primary}
      </Typography>
      <Typography variant="caption" color="text.secondary" noWrap>
        {secondary}
      </Typography>
    </Stack>
  );
}

export default function NeedsAttentionCard({ item, onAction, onDismiss }) {
  return (
    <Stack
      spacing={2}
      sx={{
        p: 2.5,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: "12px",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" color="secondary.main">
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.description}
          </Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 2 }}>
          {item.timestamp}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          bgcolor: "action.hover",
          borderRadius: "8px",
          px: 2,
          py: 1.5,
        }}
      >
        <SourceColumn label="Source" primary={item.source} secondary={item.sourceType} />
        <ArrowForwardRoundedIcon sx={{ color: "text.disabled", flexShrink: 0 }} fontSize="small" />
        <SourceColumn label="Current" primary={item.currentPlan} secondary={item.currentDetail} />
        <ArrowForwardRoundedIcon sx={{ color: "text.disabled", flexShrink: 0 }} fontSize="small" />
        <SourceColumn
          label="Proposed"
          primary={item.proposedPlan}
          secondary={item.proposedDetail}
          color={item.proposedColor}
        />
      </Stack>

      <Stack direction="row" spacing={2.5} alignItems="center" flexWrap="wrap" useFlexGap>
        <Button
          variant="contained"
          color="primary"
          size="small"
          disableElevation
          onClick={() => onAction(item, item.primaryActionKey)}
        >
          {item.primaryActionLabel}
        </Button>
        {item.secondaryActionLabel && (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => onAction(item, item.secondaryActionKey)}
          >
            {item.secondaryActionLabel}
          </Button>
        )}
        <Typography
          component="button"
          onClick={() => onDismiss(item)}
          sx={{
            border: 0,
            m: 0,
            p: 0,
            bgcolor: "transparent",
            cursor: "pointer",
            typography: "body2",
            fontWeight: 500,
            color: "secondary.main",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Not Now
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
          {item.footerNote}
        </Typography>
      </Stack>
    </Stack>
  );
}
