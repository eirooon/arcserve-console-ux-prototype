import { Box } from "@mui/material";
import JobsToolbar from "./components/JobsToolbar";
import JobsTable from "./components/JobsTable";

export default function JobsLayout() {
  return (
    <Box>
      <JobsToolbar />
      <JobsTable />
    </Box>
  );
}
