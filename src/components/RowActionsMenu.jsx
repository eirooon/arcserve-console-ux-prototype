import { useState } from "react";
import PropTypes from "prop-types";
import { Divider, IconButton, ListSubheader, Menu, MenuItem, Tooltip } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// Horizontal inset shared by every section header and menu item, so the two
// line up on the same left edge instead of the header drifting from MUI's
// ListSubheader/MenuItem defaults (which aren't guaranteed to match).
const MENU_INSET = 2;

/**
 * A per-row "Action" trigger — a small icon-only dropdown button that opens
 * a menu of `groups`, each `{ section?, items }`. A group's `section` is
 * optional: omit it for a flat, ungrouped item list (no header, no divider)
 * — pass it to get a labeled section, with a divider before any group after
 * the first. Used by DataTable's optional `rowActions` column; see that
 * prop for the full `groups` shape.
 */
export default function RowActionsMenu({ groups, ariaLabel = "Actions" }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  if (!groups || groups.length === 0) return null;

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          aria-label={ariaLabel}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            border: "1px solid",
            borderColor: "secondary.main",
            borderRadius: 1,
            color: "secondary.main",
          }}
        >
          <ArrowDropDownIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {groups.flatMap((group, groupIndex) => [
          ...(group.section && groupIndex > 0
            ? [<Divider key={`divider-${group.section}`} sx={{ my: 0.5 }} />]
            : []),
          ...(group.section
            ? [
                <ListSubheader
                  key={`section-${group.section}`}
                  component="div"
                  disableSticky
                  sx={{
                    px: MENU_INSET,
                    lineHeight: "32px",
                    color: "text.secondary",
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {group.section}
                </ListSubheader>,
              ]
            : []),
          ...group.items.map((item) => (
            <MenuItem
              key={item.label}
              disabled={item.disabled}
              onClick={() => {
                item.onClick?.();
                setAnchorEl(null);
              }}
              sx={{ px: MENU_INSET, whiteSpace: "nowrap" }}
            >
              {item.label}
            </MenuItem>
          )),
        ])}
      </Menu>
    </>
  );
}

RowActionsMenu.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      section: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          onClick: PropTypes.func,
          disabled: PropTypes.bool,
        }),
      ).isRequired,
    }),
  ),
  ariaLabel: PropTypes.string,
};
