import { Box } from "@mui/material";
import AuditLogsTable from "./components/AuditLogsTable";
import AuditLogsToolbar from "./components/AuditLogsToolbar";
import { useAuditLogsData } from "./hooks/useAuditLogsData";
import { useEntityFilterState } from "../../hooks/useEntityFilterState";
import { auditLogsFilterStore } from "./hooks/auditLogsFilters";

const selectRows = (state) => ({ rows: state.rows });

export default function AuditLogsLayout() {
  const { rows } = useAuditLogsData(selectRows);
  const { filteredRows } = useEntityFilterState(auditLogsFilterStore, rows);

  return (
    <Box>
      <AuditLogsToolbar />
      <AuditLogsTable rows={filteredRows} />
    </Box>
  );
}
