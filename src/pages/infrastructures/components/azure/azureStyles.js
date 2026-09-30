import { alpha } from "@mui/material/styles";

// Figma "text/primary/_states/selected" — the purple tint behind selected
// option cards, the in-progress setup task and account avatars. The theme's
// `action.selected` is neutral grey, so it can't stand in for this.
export const primaryTint = (theme) => alpha(theme.palette.primary.main, 0.08);

// Small form controls at 14px throughout the wizard. Applied once on the
// dialog content so every TextField, Select, PasswordField and
// Checkbox/Radio label picks it up without per-field overrides.
export const smallControlsSx = {
  "& .MuiInputBase-root": { fontSize: 14 },
  "& .MuiFormControlLabel-label": { fontSize: 14 },
  "& .MuiFormHelperText-root": { fontSize: 12 },
};

// Select menus render in a portal outside the dialog content, so they need
// the 14px size passed explicitly (see PlaceholderSelect's `selectProps`).
export const SMALL_SELECT_PROPS = {
  MenuProps: { slotProps: { paper: { sx: { "& .MuiMenuItem-root": { fontSize: 14 } } } } },
};
