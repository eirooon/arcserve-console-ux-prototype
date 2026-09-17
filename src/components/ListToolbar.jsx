import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  OutlinedInput,
  InputAdornment,
  Button,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  SearchOutlined,
  ArrowDropDown,
  FilterListOutlined,
  SettingsOutlined,
  AddOutlined,
} from "@mui/icons-material";

const DEFAULT_ACTION_ITEMS = [
  { label: "Collect Diagnostic Information" },
  { label: "Install and Upgrade Agent" },
  { label: "Delete" },
];

export default function ListToolbar({
  addLabel,
  onAdd,
  addMenuItems,
  extraAction,
  showSearch = false,
  searchPlaceholder,
  showFilters = false,
  secondaryAction,
  selectedCount,
  actionItems = DEFAULT_ACTION_ITEMS,
  showColumnsButton = true,
  apiRef,
  sx,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [addAnchorEl, setAddAnchorEl] = React.useState(null);
  const addMenuOpen = Boolean(addAnchorEl);

  const handleAddClick = (event) => setAddAnchorEl(event.currentTarget);
  const handleAddClose = () => setAddAnchorEl(null);

  const handleEditColumns = (event) => {
    apiRef?.current?.setEditColumnsAnchor?.(event.currentTarget);
    apiRef?.current?.showPreferences("columns");
  };

  const hasLeadingContent = Boolean(showSearch || showFilters);
  const hasSelection = selectedCount !== undefined || secondaryAction;
  const hasTrailingContent = hasSelection || showColumnsButton || addLabel || Boolean(extraAction);

  // The divider between the selection controls and the Edit Columns/Add
  // group only reads correctly while those two groups share a row — once
  // the toolbar wraps far enough that they land on different rows, a
  // flexItem divider renders as an orphaned line trailing off into empty
  // space. There's no CSS-only way to know "did my sibling wrap to a new
  // line" (it depends on this page's specific button set, not a fixed
  // viewport breakpoint), so this measures it directly: show the divider
  // only while the two groups' rendered offsetTop still match.
  const toolbarRef = React.useRef(null);
  const selectionGroupRef = React.useRef(null);
  const addGroupRef = React.useRef(null);
  const [dividerAligned, setDividerAligned] = React.useState(true);

  React.useLayoutEffect(() => {
    const container = toolbarRef.current;
    if (!container) return undefined;

    const checkAlignment = () => {
      const selectionEl = selectionGroupRef.current;
      const addEl = addGroupRef.current;
      setDividerAligned(
        Boolean(selectionEl && addEl && selectionEl.offsetTop === addEl.offsetTop),
      );
    };

    checkAlignment();
    const observer = new ResizeObserver(checkAlignment);
    observer.observe(container);
    return () => observer.disconnect();
  }, [hasSelection, showColumnsButton, extraAction, addLabel]);

  return (
    <Box
      ref={toolbarRef}
      sx={{
        p: 2,
        borderBottom: "1px solid rgba(0,0,0,0.12)",
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: hasLeadingContent ? "space-between" : "flex-end",
        gap: 1.5,
        ...sx,
      }}
    >
      {hasLeadingContent && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
            "& .MuiButtonBase-root": { flexShrink: 0 },
          }}
        >
          {showSearch && (
            <OutlinedInput
              size="small"
              placeholder={searchPlaceholder}
              inputProps={{ "aria-label": searchPlaceholder || "Search" }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              }
              sx={{ minWidth: 160 }}
            />
          )}

          {showFilters && (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FilterListOutlined />}
            >
              Filters
            </Button>
          )}
        </Box>
      )}

      {hasTrailingContent && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            "& .MuiButtonBase-root": { flexShrink: 0 },
          }}
        >
          {hasSelection && (
            <Box
              ref={selectionGroupRef}
              sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}
            >
              {selectedCount !== undefined && (
                <Typography fontSize={14} color="text.secondary">
                  {selectedCount} selected
                </Typography>
              )}

              {secondaryAction && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={secondaryAction.icon}
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )}

              {selectedCount !== undefined && (
                <>
                  <Button
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    variant="outlined"
                    color="secondary"
                    endIcon={<ArrowDropDown />}
                    disabled={!selectedCount}
                  >
                    Actions
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    {actionItems.map((item) => (
                      <MenuItem
                        key={item.label}
                        onClick={() => {
                          item.onClick?.();
                          handleClose();
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>
          )}

          {hasSelection && showColumnsButton && dividerAligned && (
            <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
          )}

          {(showColumnsButton || extraAction || addLabel) && (
            <Box
              ref={addGroupRef}
              sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}
            >
              {showColumnsButton && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<SettingsOutlined />}
                  onClick={handleEditColumns}
                >
                  Edit Columns
                </Button>
              )}

              {extraAction && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={extraAction.icon}
                  onClick={extraAction.onClick}
                >
                  {extraAction.label}
                </Button>
              )}

              {addLabel && addMenuItems?.length > 0 && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<AddOutlined />}
                    endIcon={<ArrowDropDown />}
                    aria-haspopup="true"
                    aria-expanded={addMenuOpen ? "true" : undefined}
                    onClick={handleAddClick}
                  >
                    <Typography noWrap component="span" sx={{ width: "100%" }} variant="body">
                      {addLabel}
                    </Typography>
                  </Button>
                  <Menu
                    anchorEl={addAnchorEl}
                    open={addMenuOpen}
                    onClose={handleAddClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    {addMenuItems.map((item) => (
                      <MenuItem
                        key={item.label}
                        onClick={() => {
                          item.onClick?.();
                          handleAddClose();
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}

              {addLabel && !addMenuItems?.length && (
                <Button variant="contained" startIcon={<AddOutlined />} onClick={() => onAdd?.()}>
                  <Typography noWrap component="span" sx={{ width: "100%" }} variant="body">
                    {addLabel}
                  </Typography>
                </Button>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

ListToolbar.propTypes = {
  addLabel: PropTypes.node,
  onAdd: PropTypes.func,
  addMenuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    }),
  ),
  extraAction: PropTypes.shape({
    label: PropTypes.node.isRequired,
    icon: PropTypes.node,
    onClick: PropTypes.func,
  }),
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  showFilters: PropTypes.bool,
  secondaryAction: PropTypes.shape({
    label: PropTypes.node.isRequired,
    icon: PropTypes.node,
    onClick: PropTypes.func,
  }),
  selectedCount: PropTypes.number,
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    }),
  ),
  showColumnsButton: PropTypes.bool,
  apiRef: PropTypes.shape({ current: PropTypes.object }),
  sx: PropTypes.object,
};
