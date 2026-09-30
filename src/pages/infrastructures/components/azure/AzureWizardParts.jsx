import { forwardRef, useId } from "react";
import PropTypes from "prop-types";
import { Box, CircularProgress, Collapse, Radio, Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

/**
 * Title + subtitle at the top of each wizard step. Focusable (tabIndex -1)
 * so the wizard can move focus here on every step change, announcing the
 * new step to screen reader users instead of leaving focus on a button
 * that may no longer exist.
 */
export const StepHeading = forwardRef(function StepHeading({ title, subtitle }, ref) {
  return (
    <Stack spacing={0.5}>
      <Typography
        ref={ref}
        tabIndex={-1}
        component="h3"
        variant="body1"
        sx={{ fontWeight: 500, color: "text.primary", outline: "none" }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
});

StepHeading.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
};

/**
 * A radio option with a title, description, optional action button and
 * revealable content (Figma "How do you want to continue?" / "Client
 * Secret" choices). Plain layout — no border, padding or fill — so the radio
 * itself shows the selection. The whole option is clickable; the real
 * <input type="radio"> keeps keyboard arrow-key navigation and screen
 * reader semantics from the surrounding RadioGroup. `children` (e.g. an
 * email field) reveal only while the option is selected.
 */
export function OptionCard({ value, selected, onSelect, title, description, action, children }) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <Box
      onClick={() => onSelect(value)}
      sx={{ display: "flex", gap: 2, alignItems: "flex-start", cursor: "pointer" }}
    >
      <Radio
        value={value}
        checked={selected}
        size="small"
        sx={{ p: 0, mt: "1px" }}
        slotProps={{ input: { "aria-labelledby": titleId, "aria-describedby": descriptionId } }}
      />
      <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Typography id={titleId} variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
            {title}
          </Typography>
          <Typography id={descriptionId} variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </Stack>
        {action && <Box sx={{ alignSelf: "flex-start" }}>{action}</Box>}
        {children && (
          <Collapse in={selected} unmountOnExit>
            {/* Clicks inside the revealed content shouldn't re-trigger selection logic. */}
            <Box onClick={(event) => event.stopPropagation()}>{children}</Box>
          </Collapse>
        )}
      </Stack>
    </Box>
  );
}

OptionCard.propTypes = {
  value: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  action: PropTypes.node,
  children: PropTypes.node,
};

/**
 * The inline result of one Azure access check, run only when a step needs
 * it: a spinner while checking, a quiet confirmation when allowed, and the
 * step's own recovery options (`denied`) when not.
 */
export function AccessCheck({ result, checkingLabel, allowedLabel, denied }) {
  if (result === "checking") {
    return (
      <Stack role="status" direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <CircularProgress size={16} aria-hidden />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {checkingLabel}
        </Typography>
      </Stack>
    );
  }
  if (result === "allowed") {
    return (
      <Stack
        role="status"
        direction="row"
        spacing={1}
        sx={{ alignItems: "flex-start", color: "success.main" }}
      >
        <CheckIcon fontSize="small" aria-hidden />
        <Typography variant="body2" color="inherit">
          {allowedLabel}
        </Typography>
      </Stack>
    );
  }
  if (result === "denied") return denied;
  return null;
}

AccessCheck.propTypes = {
  result: PropTypes.oneOf(["idle", "checking", "allowed", "denied"]).isRequired,
  checkingLabel: PropTypes.node.isRequired,
  allowedLabel: PropTypes.node.isRequired,
  denied: PropTypes.node.isRequired,
};
