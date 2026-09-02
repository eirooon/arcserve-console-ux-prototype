import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { visuallyHidden } from "@mui/utils";

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box role="status" aria-live="polite" sx={visuallyHidden}>
        {loading ? "Loading" : rows.length === 0 ? "No rows to display" : ""}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
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
};
