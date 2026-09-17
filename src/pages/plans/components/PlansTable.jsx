import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import { getColumns, getPlanRowActionGroups, plansStore, usePlansData } from "../hooks/usePlansData";

export default function PlansTable() {
  const navigate = useNavigate();
  const { rows, loading, selectionModel } = usePlansData();
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
