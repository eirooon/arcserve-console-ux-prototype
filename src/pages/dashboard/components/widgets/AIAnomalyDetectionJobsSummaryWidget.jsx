import { memo } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  Stack,
  FormControl,
  Button,
} from "@mui/material";

import CardWidget from "../../../../components/CardWidget";

const StatCard = ({ label, value, color, bgColor }) => (
  <Card
    sx={{
      bgcolor: bgColor,
      borderRadius: 2,
      boxShadow: "none",
      border: `1px solid ${color}33`,
      height: "100%",
    }}
  >
    <CardContent>
      <Typography sx={{ color: color, fontSize: "1rem", mb: 0 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ color: color, fontWeight: 700 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

function AIAnomalyDetectionJobsSummaryWidget({
  title,
  description,
  data = [],
  linkText,
  onLinkClick,
  onTimeRangeChange,
  timeRangeValue = 30,
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
                  minWidth: 240,
                  bgcolor: "background.paper",
                }}
              >
                <MenuItem value={7}>Last 7 days</MenuItem>
                <MenuItem value={30}>Last 30 days</MenuItem>
                <MenuItem value={90}>Last 90 days</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          {onLinkClick && (
            <Button onClick={onLinkClick} variant="text" color="secondary">
              {linkText}
            </Button>
          )}
        </Stack>
      }
    >
      <Grid container spacing={2}>
        {data.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </CardWidget>
  );
}

export default memo(AIAnomalyDetectionJobsSummaryWidget);
