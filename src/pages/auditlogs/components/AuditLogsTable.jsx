import { useEffect } from "react";
import PropTypes from "prop-types";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import { auditLogsStore, columns, useAuditLogsData } from "../hooks/useAuditLogsData";

const selectTableState = (state) => ({ rows: state.rows, loading: state.loading });

// `rows` lets AuditLogsLayout hand down the filtered result set (see
// auditLogsFilters.js) instead of the store's full, unfiltered rows —
// loading still comes from the store either way.
export default function AuditLogsTable({ rows: rowsOverride }) {
  const { rows: storeRows, loading } = useAuditLogsData(selectTableState);
  const rows = rowsOverride ?? storeRows;
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

AuditLogsTable.propTypes = {
  rows: PropTypes.array,
};
