import { Box } from "@mui/material";
import PlansToolbar from "./components/PlansToolbar";
import PlansTable from "./components/PlansTable";

export default function PlansLayout() {
  return (
    <Box>
      <PlansToolbar />
      <PlansTable />
    </Box>
  );
}
