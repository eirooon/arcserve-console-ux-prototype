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
 */
export default function PlaceholderSelect({ placeholder, value, selectProps, children, ...textFieldProps }) {
  const renderValue = (selected) => {
    const isEmpty = Array.isArray(selected) ? selected.length === 0 : !selected;
    if (isEmpty) {
      return (
        <Typography component="span" variant="body2" color="text.secondary">
          {placeholder}
        </Typography>
      );
    }
    const match = Children.toArray(children).find(
      (child) => isValidElement(child) && child.props.value === selected,
    );
    return match ? match.props.children : selected;
  };

  return (
    <TextField select value={value} SelectProps={{ displayEmpty: true, renderValue, ...selectProps }} {...textFieldProps}>
      {children}
    </TextField>
  );
}

PlaceholderSelect.propTypes = {
  placeholder: PropTypes.node.isRequired,
  value: PropTypes.any,
  selectProps: PropTypes.object,
  children: PropTypes.node.isRequired,
};
