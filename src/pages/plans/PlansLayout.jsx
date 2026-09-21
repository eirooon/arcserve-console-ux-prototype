import { Box } from "@mui/material";
import PlansToolbar from "./components/PlansToolbar";
import PlansTable from "./components/PlansTable";
import { usePlansData } from "./hooks/usePlansData";
import { useEntityFilterState } from "../../hooks/useEntityFilterState";
import { plansFilterStore } from "./plansFilters";

const selectRows = (state) => ({ rows: state.rows });

export default function PlansLayout() {
  const { rows } = usePlansData(selectRows);
  const { filteredRows } = useEntityFilterState(plansFilterStore, rows);

  return (
    <Box>
      <PlansToolbar />
      <PlansTable rows={filteredRows} />
    </Box>
  );
}
