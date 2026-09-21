import { Box } from "@mui/material";
import JobsToolbar from "./components/JobsToolbar";
import JobsTable from "./components/JobsTable";
import { useJobsData } from "./hooks/useJobsData";
import { useEntityFilterState } from "../../hooks/useEntityFilterState";
import { jobsFilterStore } from "./jobsFilters";

const selectRows = (state) => ({ rows: state.rows });

export default function JobsLayout() {
  const { rows } = useJobsData(selectRows);
  const { filteredRows } = useEntityFilterState(jobsFilterStore, rows);

  return (
    <Box>
      <JobsToolbar />
      <JobsTable rows={filteredRows} />
    </Box>
  );
}
