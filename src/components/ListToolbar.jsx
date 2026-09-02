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

  const handleEditColumns = (event) => {
    apiRef?.current?.setEditColumnsAnchor?.(event.currentTarget);
    apiRef?.current?.showPreferences("columns");
  };

  const hasLeadingContent = Boolean(showSearch || showFilters);
  const hasSelection = selectedCount !== undefined || secondaryAction;
  const hasTrailingContent = hasSelection || showColumnsButton || addLabel;

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: "1px solid rgba(0,0,0,0.12)",
        alignItems: "center",
        display: "flex",
        justifyContent: hasLeadingContent ? "space-between" : "flex-end",
        gap: 1,
        ...sx,
      }}
    >
      {hasLeadingContent && (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {hasSelection && (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
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

          {hasSelection && showColumnsButton && (
            <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
          )}

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

          {addLabel && (
            <Button variant="contained" startIcon={<AddOutlined />} onClick={onAdd}>
              <Typography noWrap component="span" sx={{ width: "100%" }} variant="body">
                {addLabel}
              </Typography>
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}

ListToolbar.propTypes = {
  addLabel: PropTypes.node,
  onAdd: PropTypes.func,
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
