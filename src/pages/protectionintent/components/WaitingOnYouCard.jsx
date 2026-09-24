import { useRef } from "react";
import { Button, Collapse, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { WAITING_ON_YOU_TYPE_META } from "../arcGenieOverviewData";
import SuggestionDismissPanel from "./SuggestionDismissPanel";

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

function RequestTypeBadge({ type }) {
  const meta = WAITING_ON_YOU_TYPE_META[type] ?? WAITING_ON_YOU_TYPE_META.approval;
  const Icon = meta.icon;

  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{
        bgcolor: meta.bgcolor,
        color: meta.color,
        borderRadius: "12px",
        px: 1.25,
        py: 0.375,
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: 14 }} aria-hidden="true" />
      <Typography variant="caption" fontWeight={600}>
        {meta.label}
      </Typography>
    </Stack>
  );
}

/**
 * `isDismissPanelOpen`/`onOpenDismissPanel`/`onCloseDismissPanel` are only
 * meaningful for `type: "suggestion"` items — the parent list owns which
 * (if any) card's panel is open so only one can be expanded at a time (see
 * useExclusiveDisclosure). Approval/exception cards ignore them entirely and
 * keep their original single-click `onDismiss`.
 */
export default function WaitingOnYouCard({
  item,
  onAction,
  onDismiss,
  isDismissPanelOpen = false,
  onOpenDismissPanel,
  onCloseDismissPanel,
  onConfirmDismiss,
}) {
  const typeMeta = WAITING_ON_YOU_TYPE_META[item.type] ?? WAITING_ON_YOU_TYPE_META.approval;
  const isSuggestion = item.type === "suggestion";
  const dismissTriggerRef = useRef(null);

  const handleCancelDismiss = () => {
    onCloseDismissPanel();
    // Wait a frame so focus lands after the panel has actually collapsed,
    // rather than fighting its own exit transition for it.
    requestAnimationFrame(() => dismissTriggerRef.current?.focus());
  };

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
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" rowGap={0.5}>
          <RequestTypeBadge type={item.type} />
          <Typography variant="body2" color="text.secondary">
            {item.category}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
          {item.timestamp}
        </Typography>
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="body1" fontWeight={500} color={typeMeta.titleColor}>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 2 }}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{
          bgcolor: "action.hover",
          borderRadius: "8px",
          px: 2,
          py: 1.5,
        }}
      >
        <SourceColumn label="Source" primary={item.source} secondary={item.sourceType} />
        <ArrowForwardRoundedIcon
          sx={{
            color: "text.disabled",
            flexShrink: 0,
            alignSelf: { xs: "flex-start", sm: "center" },
            transform: { xs: "rotate(90deg)", sm: "none" },
          }}
          fontSize="small"
        />
        <SourceColumn label="Current" primary={item.currentPlan} secondary={item.currentDetail} />
        <ArrowForwardRoundedIcon
          sx={{
            color: "text.disabled",
            flexShrink: 0,
            alignSelf: { xs: "flex-start", sm: "center" },
            transform: { xs: "rotate(90deg)", sm: "none" },
          }}
          fontSize="small"
        />
        <SourceColumn
          label="Proposed"
          primary={item.proposedPlan}
          secondary={item.proposedDetail}
          color={item.proposedColor}
        />
      </Stack>

      {isSuggestion && (
        <Collapse in={isDismissPanelOpen} unmountOnExit>
          <SuggestionDismissPanel
            source={item.source}
            onCancel={handleCancelDismiss}
            onConfirm={({ reason, note }) => onConfirmDismiss(item, { reason, note })}
          />
        </Collapse>
      )}

      {!(isSuggestion && isDismissPanelOpen) && (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button
            variant={item.primaryVariant ?? "contained"}
            color={item.primaryColor ?? "primary"}
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
          <Button
            ref={dismissTriggerRef}
            variant="text"
            color="secondary"
            size="small"
            onClick={() => (isSuggestion ? onOpenDismissPanel() : onDismiss(item))}
          >
            {typeMeta.dismissLabel}
          </Button>
          <Typography
            variant="caption"
            color={item.footerNoteColor ?? "text.secondary"}
            sx={{ ml: "auto" }}
          >
            {item.footerNote}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
