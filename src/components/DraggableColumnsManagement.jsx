import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { useGridApiContext } from "@mui/x-data-grid";
import { useGridSelector } from "@mui/x-data-grid/hooks/utils";
import {
  gridColumnDefinitionsSelector,
  gridColumnVisibilityModelSelector,
} from "@mui/x-data-grid/hooks/features/columns";

// Drag-and-drop column reordering is a DataGrid Pro feature — the Community
// edition we use doesn't expose a public API for it (its `setColumnIndex` is
// registered as a private method for the plain `DataGrid`). Instead of
// reaching into that private API, this panel reorders the `columns` array
// DataTable feeds the grid (see DataTable's `columnOrder` state) and lets the
// grid's normal "columns prop changed" handling rebuild its column order from
// that new array — a fully public, Community-safe way to get the same result.
//
// Replaces DataGrid's built-in columns-management panel (see DataTable's
// `slots.columnsManagement`) everywhere in the app, so every table's "Edit
// Columns" menu gets reordering from this one place.
export default function DraggableColumnsManagement({ getTogglableColumns, onReorder }) {
  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const columnVisibilityModel = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
  const [searchValue, setSearchValue] = useState("");
  const [draggedField, setDraggedField] = useState(null);
  const [dragOverField, setDragOverField] = useState(null);

  const togglableColumns = useMemo(() => {
    const togglableFields = getTogglableColumns
      ? getTogglableColumns(columns)
      : columns.map((column) => column.field);
    return columns.filter((column) => togglableFields.includes(column.field));
  }, [columns, getTogglableColumns]);

  const visibleRows = useMemo(() => {
    if (!searchValue) return togglableColumns;
    const query = searchValue.toLowerCase();
    return togglableColumns.filter((column) =>
      (column.headerName || column.field).toLowerCase().includes(query),
    );
  }, [togglableColumns, searchValue]);

  // Reordering while a search filter is active would only let a column move
  // relative to the other filtered-in rows, which resolves to a confusing
  // final position once the filter clears — so dragging is disabled while
  // searching rather than gambling on a surprising reorder.
  const reorderDisabled = searchValue.length > 0;

  const toggleColumn = useCallback(
    (field) => {
      apiRef.current.setColumnVisibility(field, columnVisibilityModel[field] === false);
    },
    [apiRef, columnVisibilityModel],
  );

  const moveColumn = useCallback(
    (field, targetField) => {
      if (!onReorder || field === targetField) return;
      const fields = togglableColumns.map((column) => column.field);
      const fromIndex = fields.indexOf(field);
      const toIndex = fields.indexOf(targetField);
      if (fromIndex === -1 || toIndex === -1) return;
      const reordered = [...fields];
      reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, field);
      onReorder(reordered);
    },
    [togglableColumns, onReorder],
  );

  const moveColumnBy = useCallback(
    (field, direction) => {
      const fields = togglableColumns.map((column) => column.field);
      const index = fields.indexOf(field);
      const targetIndex = index + direction;
      if (index === -1 || targetIndex < 0 || targetIndex >= fields.length) return;
      moveColumn(field, fields[targetIndex]);
    },
    [togglableColumns, moveColumn],
  );

  const handleReset = useCallback(() => {
    apiRef.current.setColumnVisibilityModel({});
    onReorder?.(null);
  }, [apiRef, onReorder]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
        <TextField
          size="small"
          fullWidth
          autoFocus
          placeholder="Find column"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchValue ? (
                <InputAdornment position="end">
                  <IconButton size="small" edge="end" onClick={() => setSearchValue("")}>
                    <ClearRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
      </Box>
      <List dense disablePadding sx={{ maxHeight: 320, overflowY: "auto", px: 1.5 }}>
        {visibleRows.map((column) => {
          const label = column.headerName || column.field;
          const isDragged = draggedField === column.field;
          const isDragOver = dragOverField === column.field && draggedField !== column.field;
          return (
            <ListItem
              key={column.field}
              disablePadding
              onDragOver={(event) => {
                if (reorderDisabled || !draggedField) return;
                event.preventDefault();
                setDragOverField(column.field);
              }}
              onDrop={(event) => {
                if (reorderDisabled || !draggedField) return;
                event.preventDefault();
                moveColumn(draggedField, column.field);
                setDraggedField(null);
                setDragOverField(null);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 0.5,
                borderRadius: 1,
                opacity: isDragged ? 0.4 : 1,
                outline: isDragOver ? "2px solid" : "none",
                outlineColor: "primary.main",
                outlineOffset: -2,
              }}
            >
              <FormControlLabel
                sx={{ flex: 1, minWidth: 0, mr: 1 }}
                control={
                  <Checkbox
                    size="small"
                    checked={columnVisibilityModel[column.field] !== false}
                    disabled={column.hideable === false}
                    onChange={() => toggleColumn(column.field)}
                  />
                }
                label={
                  <Typography variant="body2" noWrap>
                    {label}
                  </Typography>
                }
              />
              <IconButton
                size="small"
                edge="end"
                disabled={reorderDisabled}
                draggable={!reorderDisabled}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  setDraggedField(column.field);
                }}
                onDragEnd={() => {
                  setDraggedField(null);
                  setDragOverField(null);
                }}
                onKeyDown={(event) => {
                  if (reorderDisabled) return;
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    moveColumnBy(column.field, -1);
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    moveColumnBy(column.field, 1);
                  }
                }}
                aria-label={`Reorder ${label} column. Use the arrow up and down keys to move it.`}
                sx={{
                  cursor: reorderDisabled ? "default" : "grab",
                  color: reorderDisabled ? "action.disabled" : "action.active",
                  flexShrink: 0,
                }}
              >
                <DragIndicatorRoundedIcon fontSize="small" />
              </IconButton>
            </ListItem>
          );
        })}
        {visibleRows.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
            No columns found
          </Typography>
        )}
      </List>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          p: 1,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button size="small" onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Box>
  );
}

DraggableColumnsManagement.propTypes = {
  getTogglableColumns: PropTypes.func,
  onReorder: PropTypes.func,
};
