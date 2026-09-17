import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { visuallyHidden } from "@mui/utils";
import RowActionsMenu from "./RowActionsMenu";

// Exported so a caller that needs the actions column pinned (see
// ArcGenieGoalDetailPage) can reference its field name in `initialState`
// without hardcoding a copy of this string.
export const ACTIONS_COLUMN_FIELD = "__rowActions";
// MUI's built-in checkbox-selection column field. Excluded from the "Edit
// Columns" panel below since toggling it there wouldn't be meaningful.
const CHECKBOX_SELECTION_FIELD = "__check__";

export default function DataTable({
  columns,
  rows,
  pageSizeOptions = [10, 20, 30, 40, 50, 60],
  initialPageSize = 20,
  checkboxSelection = true,
  disableRowSelectionOnClick = true,
  disableColumnMenu = true,
  rowSelectionModel,
  onRowSelectionModelChange,
  getRowId = (row) => row.id,
  ariaLabel,
  loading,
  initialState,
  apiRef,
  slotProps,
  // Opt-in leading "Actions" column (checkbox, then Actions, then the rest).
  // Omit it and the grid renders exactly as before — every existing table
  // using DataTable is unaffected. Pass it to add a per-row dropdown menu:
  // `rowActions={(row) => [{ section: "Job", items: [{ label, onClick }] }]}`.
  rowActions,
  rowActionsAriaLabel,
  ...gridProps
}) {
  // The "Edit Columns" trigger lives in ListToolbar, outside the DataGrid's
  // own component tree, so MUI can't anchor the columns panel to it via its
  // internal trigger ref. We expose a setter on apiRef that ListToolbar calls
  // with its button element, and anchor the panel's popper to that instead
  // of MUI's default (top-right corner of the grid).
  const [editColumnsAnchor, setEditColumnsAnchor] = useState(null);
  useEffect(() => {
    if (apiRef?.current) {
      apiRef.current.setEditColumnsAnchor = setEditColumnsAnchor;
    }
  }, [apiRef]);
  // Callers work with a plain array of ids (simple to store/compare); MUI
  // X Data Grid v8 internally uses { type: "include" | "exclude", ids: Set }.
  // Translate at this single boundary so the rest of the app never has to
  // know about that shape.
  const gridSelectionModel =
    rowSelectionModel !== undefined
      ? { type: "include", ids: new Set(rowSelectionModel) }
      : undefined;

  const handleSelectionModelChange = onRowSelectionModelChange
    ? (model) => {
        // Clicking the header "select all" checkbox emits { type: "exclude",
        // ids: <empty set> } rather than an explicit list of every row id
        // (an efficient way to represent "all rows" without enumerating
        // them). Resolve it against the current rows so callers always get
        // a concrete included-ids array.
        const included =
          model.type === "exclude"
            ? rows.map(getRowId).filter((id) => !model.ids.has(id))
            : Array.from(model.ids);
        onRowSelectionModelChange(included);
      }
    : undefined;

  const effectiveColumns = useMemo(() => {
    if (!rowActions) return columns;
    return [
      {
        field: ACTIONS_COLUMN_FIELD,
        headerName: "Actions",
        width: 72,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        resizable: false,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <RowActionsMenu
            groups={rowActions(row)}
            ariaLabel={rowActionsAriaLabel?.(row)}
          />
        ),
      },
      ...columns,
    ];
  }, [columns, rowActions, rowActionsAriaLabel]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box role="status" aria-live="polite" sx={visuallyHidden}>
        {loading ? "Loading" : rows.length === 0 ? "No rows to display" : ""}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={effectiveColumns}
          loading={loading}
          getRowId={getRowId}
          aria-label={ariaLabel}
          initialState={{
            pagination: { paginationModel: { pageSize: initialPageSize } },
            ...initialState,
          }}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          disableColumnMenu={disableColumnMenu}
          rowSelectionModel={gridSelectionModel}
          onRowSelectionModelChange={handleSelectionModelChange}
          apiRef={apiRef}
          slotProps={{
            ...slotProps,
            panel: { target: editColumnsAnchor, ...slotProps?.panel },
            columnsManagement: {
              // Checkbox selection and the row-actions column aren't
              // meaningful things to show/hide, so they're left out of the
              // "Edit Columns" panel entirely. The panel's own reset button
              // stays intact for the remaining columns.
              getTogglableColumns: (cols) =>
                cols
                  .filter(
                    (col) =>
                      col.field !== CHECKBOX_SELECTION_FIELD &&
                      col.field !== ACTIONS_COLUMN_FIELD,
                  )
                  .map((col) => col.field),
              disableShowHideToggle: true,
              ...slotProps?.columnsManagement,
            },
          }}
          {...gridProps}
        />
      </Box>
    </Box>
  );
}

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  initialPageSize: PropTypes.number,
  checkboxSelection: PropTypes.bool,
  disableRowSelectionOnClick: PropTypes.bool,
  disableColumnMenu: PropTypes.bool,
  rowSelectionModel: PropTypes.array,
  onRowSelectionModelChange: PropTypes.func,
  getRowId: PropTypes.func,
  ariaLabel: PropTypes.string,
  initialState: PropTypes.object,
  loading: PropTypes.bool,
  apiRef: PropTypes.shape({ current: PropTypes.object }),
  slotProps: PropTypes.object,
  rowActions: PropTypes.func,
  rowActionsAriaLabel: PropTypes.func,
};
