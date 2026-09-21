import { useEffect } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import { useEntityFilterState } from "../../../hooks/useEntityFilterState";
import { disasterRecoveryFilterStore } from "../hooks/disasterRecoveryFilters";
import { columns, disasterRecoveryStore, useDisasterRecoveryData } from "../hooks/useDisasterRecoveryData";

export default function DisasterRecoveryTable() {
  const { rows, loading, selectionModel } = useDisasterRecoveryData();
  const apiRef = useGridApiRef();
  useEffect(() => disasterRecoveryStore.setApiRef(apiRef), [apiRef]);

  // Entity filters/search (see DisasterRecoveryToolbar, which independently
  // computes the same filtered result against the shared
  // disasterRecoveryFilterStore) apply on top of the store's full rows —
  // all 4 sub-nav pages share this same underlying runbook data today.
  const { filteredRows } = useEntityFilterState(disasterRecoveryFilterStore, rows);

  return (
    <DataTable
      ariaLabel="Disaster recovery"
      columns={columns}
      rows={filteredRows}
      loading={loading}
      getRowId={(row) => row.id}
      apiRef={apiRef}
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={disasterRecoveryStore.setSelectionModel}
    />
  );
}
