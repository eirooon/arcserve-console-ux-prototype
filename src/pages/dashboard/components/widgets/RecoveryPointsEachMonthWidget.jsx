import { memo } from "react";
import CardWidget from "../../../../components/CardWidget";
import SharedBarChart from "../SharedBarChart";
import {
  Typography,
  Select,
  MenuItem,
  Stack,
  FormControl,
} from "@mui/material";

function RecoveryPointsEachMonthWidget({
  title,
  description,
  data,
  onTimeRangeChange,
  timeRangeValue = 2026,
}) {
  return (
    <CardWidget
      title={title}
      description={description}
      action={
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mt: 1, mr: 1 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Show results from
            </Typography>
            <FormControl>
              <Select
                value={timeRangeValue}
                onChange={onTimeRangeChange}
                sx={{
                  height: 40,
                  fontSize: "1rem",
                  minWidth: 120,
                  bgcolor: "background.paper",
                }}
              >
                <MenuItem value={2026}>2026</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
                <MenuItem value={2024}>2024</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      }
    >
      <SharedBarChart
        height={400}
        series={data}
        showLegend={false}
      ></SharedBarChart>
    </CardWidget>
  );
}

export default memo(RecoveryPointsEachMonthWidget);
