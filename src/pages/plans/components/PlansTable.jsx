import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import { getColumns, getPlanRowActionGroups, plansStore, usePlansData } from "../hooks/usePlansData";

const selectTableState = (state) => ({
  rows: state.rows,
  loading: state.loading,
  selectionModel: state.selectionModel,
});

// `rows` lets PlansLayout hand down the filtered result set (see
// plansFilters.js) instead of the store's full, unfiltered rows — loading and
// selection still come from the store either way.
export default function PlansTable({ rows: rowsOverride }) {
  const navigate = useNavigate();
  const { rows: storeRows, loading, selectionModel } = usePlansData(selectTableState);
  const rows = rowsOverride ?? storeRows;
  const apiRef = useGridApiRef();
  useEffect(() => plansStore.setApiRef(apiRef), [apiRef]);

  const columns = useMemo(() => getColumns(navigate), [navigate]);
  const rowActions = useMemo(() => getPlanRowActionGroups(navigate), [navigate]);
  // Stable identity so it doesn't defeat DataTable's effectiveColumns
  // useMemo (which depends on this prop) on every render.
  const rowActionsAriaLabel = useCallback((row) => `Actions for ${row.plan_name}`, []);

  return (
    <DataTable
      ariaLabel="Plans"
      columns={columns}
      rows={rows}
      loading={loading}
      getRowId={(row) => row.id}
      apiRef={apiRef}
      rowActions={rowActions}
      rowActionsAriaLabel={rowActionsAriaLabel}
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={plansStore.setSelectionModel}
      onRowDoubleClick={(params) => navigate(`/plans/${params.row.id}`)}
    />
  );
}

PlansTable.propTypes = {
  rows: PropTypes.array,
};
