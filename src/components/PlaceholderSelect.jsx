import { Children, isValidElement } from "react";
import PropTypes from "prop-types";
import { TextField, Typography } from "@mui/material";

/**
 * A `TextField select` whose placeholder ("Select a site", etc.) renders in
 * a muted, secondary color when nothing is selected, instead of a
 * selectable-looking (but disabled) "Select ..." item sitting inside the
 * dropdown list itself — that item was visually indistinguishable from a
 * real option until clicked, and did nothing when clicked. Pass the same
 * `<MenuItem>` children you would to a plain `TextField select`; no
 * placeholder MenuItem needed.
 *
 * The selected value displays as its MenuItem's children, unless
 * `getOptionLabel(value)` is given — for menus whose items are richer than
 * the one-line text the closed select should show (e.g. table rows).
 */
export default function PlaceholderSelect({
  placeholder,
  value,
  selectProps,
  getOptionLabel,
  children,
  slotProps,
  ...textFieldProps
}) {
  const renderValue = (selected) => {
    const isEmpty = Array.isArray(selected) ? selected.length === 0 : !selected;
    if (isEmpty) {
      return (
        <Typography component="span" variant="body2" sx={{ color: "text.secondary" }}>
          {placeholder}
        </Typography>
      );
    }
    if (getOptionLabel) return getOptionLabel(selected);
    const match = Children.toArray(children).find(
      (child) => isValidElement(child) && child.props.value === selected,
    );
    return match ? match.props.children : selected;
  };

  return (
    <TextField
      select
      value={value}
      slotProps={{ ...slotProps, select: { displayEmpty: true, renderValue, ...selectProps, ...slotProps?.select } }}
      {...textFieldProps}
    >
      {children}
    </TextField>
  );
}

PlaceholderSelect.propTypes = {
  placeholder: PropTypes.node.isRequired,
  value: PropTypes.any,
  selectProps: PropTypes.object,
  getOptionLabel: PropTypes.func,
  slotProps: PropTypes.object,
  children: PropTypes.node.isRequired,
};
