import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

export default function SharedDonutChart({
  data,
  centerValue,
  centerSubtext,
  centerValueColor,
  height = 200,
  width = 200,
  margin = { top: 0, bottom: 0, left: 0, right: 0 },
  innerRadius = 65,
  outerRadius = 90,
  legendWidth,
}) {
  const hasData = data.length > 0 && data.some((item) => item.value > 0);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        p: 2,
      }}
    >
      {/* Container that wraps the chart and overlay tightly */}
      <Box sx={{ position: "relative", width: "fit-content" }}>
        <PieChart
          series={[
            {
              data: hasData
                ? data
                : [{ value: 1, color: "#f5f5f5", label: "No Data" }],
              innerRadius,
              outerRadius,
              paddingAngle: 0,
              cornerRadius: 0,
              valueFormatter: () => "",
              highlightScope: { faded: "global", highlighted: "item" },
            },
          ]}
          width={width}
          height={height}
          margin={margin}
          sx={{
            "& .MuiChartsLegend-root": {
              width: legendWidth,
            },
            [`& .MuiChartsLegend-label`]: {
              fontSize: "14px !important",
              color: "#00729A !important",
              cursor: "pointer",
              whiteSpace: "normal",
            },
            [`& .MuiChartsLegend-mark`]: {
              rx: 6, // Use rx/ry for rounding SVG markers
              ry: 6,
              cursor: "pointer",
            },
          }}
          slotProps={{
            legend: {
              onItemClick: (event, d) => {
                console.log("Clicked legend item:", d.label);
              },
            },
            tooltip: { trigger: "item" },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: `${height / 2}px`,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
            width: innerRadius * 1.8, // Constraints text inside the ring
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: centerValueColor,
              my: 0.5,
              fontSize: "2rem", // Scale font for mobile
            }}
          >
            {centerValue}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.55rem", md: "0.70rem" },
              width: "80%",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {centerSubtext}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

SharedDonutChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
  centerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  centerSubtext: PropTypes.node.isRequired,
  centerValueColor: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  margin: PropTypes.object,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  legendWidth: PropTypes.number,
};
