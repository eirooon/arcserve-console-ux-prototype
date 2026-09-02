import { useEffect } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import { columns, jobsStore, useJobsData } from "../hooks/useJobsData";

const selectTableState = (state) => ({
  rows: state.rows,
  loading: state.loading,
  selectionModel: state.selectionModel,
});

export default function JobsTable() {
  const { rows, loading, selectionModel } = useJobsData(selectTableState);
  const apiRef = useGridApiRef();
  useEffect(() => jobsStore.setApiRef(apiRef), [apiRef]);

  return (
    <DataTable
      ariaLabel="Jobs"
      columns={columns}
      rows={rows}
      loading={loading}
      getRowId={(row) => row.id}
      apiRef={apiRef}
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={jobsStore.setSelectionModel}
    />
  );
}
