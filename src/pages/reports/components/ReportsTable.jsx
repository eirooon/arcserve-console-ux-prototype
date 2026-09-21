import { useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import { useEntityFilterState } from "../../../hooks/useEntityFilterState";
import { reportsFilterStore } from "../hooks/reportsFilters";
import { columns, filterReportsByCategory, reportsStore, useReportsData } from "../hooks/useReportsData";

export default function ReportsTable() {
  const { selectedId } = useOutletContext();
  const { rows, loading, selectionModel } = useReportsData();
  const apiRef = useGridApiRef();
  useEffect(() => reportsStore.setApiRef(apiRef), [apiRef]);

  // Entity filters/search (see ReportsToolbar, which independently computes
  // the same categoryRows against the shared reportsFilterStore) apply on
  // top of whichever left sub-nav category is currently selected.
  const categoryRows = useMemo(
    () => filterReportsByCategory(rows, selectedId),
    [rows, selectedId],
  );
  const { filteredRows } = useEntityFilterState(reportsFilterStore, categoryRows);

  return (
    <DataTable
      ariaLabel="Reports"
      columns={columns}
      rows={filteredRows}
      loading={loading}
      getRowId={(row) => row.id}
      apiRef={apiRef}
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={reportsStore.setSelectionModel}
    />
  );
}
