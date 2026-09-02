import { useEffect } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import { columns, disasterRecoveryStore, useDisasterRecoveryData } from "../hooks/useDisasterRecoveryData";

export default function DisasterRecoveryTable() {
  const { rows, loading, selectionModel } = useDisasterRecoveryData();
  const apiRef = useGridApiRef();
  useEffect(() => disasterRecoveryStore.setApiRef(apiRef), [apiRef]);

  return (
    <DataTable
      ariaLabel="Disaster recovery"
      columns={columns}
      rows={rows}
      loading={loading}
      getRowId={(row) => row.id}
      apiRef={apiRef}
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={disasterRecoveryStore.setSelectionModel}
    />
  );
}
