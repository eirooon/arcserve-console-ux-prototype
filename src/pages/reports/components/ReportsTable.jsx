import { useEffect } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import { columns, reportsStore, useReportsData } from "../hooks/useReportsData";

export default function ReportsTable() {
  const { rows, loading, selectionModel } = useReportsData();
  const apiRef = useGridApiRef();
  useEffect(() => reportsStore.setApiRef(apiRef), [apiRef]);

  return (
    <DataTable
      ariaLabel="Reports"
      columns={columns}
      rows={rows}
      loading={loading}
      getRowId={(row) => row.id}
      apiRef={apiRef}
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={reportsStore.setSelectionModel}
    />
  );
}
