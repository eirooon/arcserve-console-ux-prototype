import { useEffect, useId, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import FormField from "../../../components/FormField";
import { DISMISS_PANEL_COPY, DISMISS_REASON_OPTIONS } from "../suggestionDismissal";

/**
 * Inline "why are you dismissing this?" panel for a suggestion card. Opens
 * in place of the Dismiss button (not a modal); a reason is always optional,
 * so the confirm button is never disabled. Owns only its own draft
 * reason/note — the parent card decides when it's open and what happens on
 * confirm/cancel.
 */
export default function SuggestionDismissPanel({ source, onCancel, onConfirm }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const headingId = useId();
  const firstRadioRef = useRef(null);

  // Moves focus into the panel as soon as it mounts, per the "focus the
  // radio group on open" requirement — this component is only ever rendered
  // while its panel is open (the parent unmounts it via Collapse's
  // unmountOnExit), so mount time *is* open time.
  useEffect(() => {
    firstRadioRef.current?.focus();
  }, []);

  return (
    <Box sx={{ bgcolor: "action.hover", borderRadius: "8px", p: 2.5 }}>
      <Stack spacing={2.5}>
        <Stack spacing={1}>
          <Typography id={headingId} variant="subtitle2" fontWeight={700} color="text.primary">
            {DISMISS_PANEL_COPY.radioGroupLabel}{" "}
            <Typography component="span" variant="body2" color="text.secondary">
              {DISMISS_PANEL_COPY.radioGroupOptionalSuffix}
            </Typography>
          </Typography>

          <RadioGroup
            aria-labelledby={headingId}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          >
            <Stack spacing={1}>
              {DISMISS_REASON_OPTIONS.map((option, index) => {
                const selected = reason === option.value;
                return (
                  <Box
                    key={option.value}
                    sx={{
                      border: 1,
                      borderColor: selected ? "primary.main" : "divider",
                      borderRadius: "8px",
                      bgcolor: "background.paper",
                    }}
                  >
                    <FormControlLabel
                      value={option.value}
                      sx={{ m: 0, width: "100%", minHeight: 44, px: 1.5, py: 1 }}
                      control={<Radio inputRef={index === 0 ? firstRadioRef : undefined} />}
                      label={
                        <Typography variant="body2" color="text.primary">
                          {option.label}
                        </Typography>
                      }
                    />
                  </Box>
                );
              })}
            </Stack>
          </RadioGroup>
        </Stack>

        <FormField label={DISMISS_PANEL_COPY.noteLabel}>
          <TextField
            fullWidth
            size="small"
            multiline
            minRows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={DISMISS_PANEL_COPY.notePlaceholder}
          />
        </FormField>

        <Typography variant="caption" color="text.secondary">
          {DISMISS_PANEL_COPY.helperText(source)}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => onConfirm({ reason: reason || null, note: note.trim() || null })}
          >
            {DISMISS_PANEL_COPY.dismissButtonLabel}
          </Button>
          <Button variant="text" color="secondary" onClick={onCancel}>
            {DISMISS_PANEL_COPY.cancelButtonLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

SuggestionDismissPanel.propTypes = {
  source: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
