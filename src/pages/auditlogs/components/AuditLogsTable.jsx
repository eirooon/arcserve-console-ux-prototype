import { useEffect } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import { auditLogsStore, columns, useAuditLogsData } from "../hooks/useAuditLogsData";

export default function AuditLogsTable() {
  const { rows, loading } = useAuditLogsData();
  const apiRef = useGridApiRef();
  useEffect(() => auditLogsStore.setApiRef(apiRef), [apiRef]);
  return (
    <DataTable
      ariaLabel="Audit logs"
      columns={columns}
      rows={rows}
      loading={loading}
      apiRef={apiRef}
    />
  );
}
