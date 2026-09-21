import { Box } from "@mui/material";
import AlertRulesTable from "./components/AlertRulesTable";
import AlertRulesToolbar from "./components/AlertRulesToolbar";
import { useAlertRulesData } from "./hooks/useAlertRulesData";
import { useEntityFilterState } from "../../hooks/useEntityFilterState";
import { alertRulesFilterStore } from "./hooks/alertRulesFilters";

const selectRows = (state) => ({ rows: state.rows });

export default function AlertRulesLayout() {
  const { rows } = useAlertRulesData(selectRows);
  const { filteredRows } = useEntityFilterState(alertRulesFilterStore, rows);

  return (
    <Box>
      <AlertRulesToolbar />
      <AlertRulesTable rows={filteredRows} />
    </Box>
  );
}
