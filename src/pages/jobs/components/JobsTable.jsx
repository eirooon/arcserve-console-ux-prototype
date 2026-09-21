import { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import { getColumns, getJobRowActionGroups, jobsStore, useJobsData } from "../hooks/useJobsData";

const selectTableState = (state) => ({
  rows: state.rows,
  loading: state.loading,
  selectionModel: state.selectionModel,
});

// `rows` lets JobsLayout hand down the filtered result set (see
// jobsFilters.js) instead of the store's full, unfiltered rows — loading and
// selection still come from the store either way.
export default function JobsTable({ rows: rowsOverride }) {
  const { rows: storeRows, loading, selectionModel } = useJobsData(selectTableState);
  const rows = rowsOverride ?? storeRows;
  const apiRef = useGridApiRef();
  useEffect(() => jobsStore.setApiRef(apiRef), [apiRef]);

  const columns = useMemo(() => getColumns(), []);
  const rowActions = useMemo(() => getJobRowActionGroups(), []);
  // Stable identity so it doesn't defeat DataTable's effectiveColumns
  // useMemo (which depends on this prop) on every render.
  const rowActionsAriaLabel = useCallback((row) => `Actions for ${row.job_name}`, []);

  return (
    <DataTable
      ariaLabel="Jobs"
      columns={columns}
      rows={rows}
      loading={loading}
      getRowId={(row) => row.id}
      apiRef={apiRef}
      rowActions={rowActions}
      rowActionsAriaLabel={rowActionsAriaLabel}
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={jobsStore.setSelectionModel}
    />
  );
}

JobsTable.propTypes = {
  rows: PropTypes.array,
};
