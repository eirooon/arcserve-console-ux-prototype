import { memo } from "react";
import PropTypes from "prop-types";
import CardWidget from "../../../../components/CardWidget";
import SharedBarChart from "../SharedBarChart";

function BarChartWidget({ title, description, data }) {
  return (
    <CardWidget title={title} description={description}>
      <SharedBarChart height={400} series={data} showLegend={false} />
    </CardWidget>
  );
}

BarChartWidget.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  data: PropTypes.array.isRequired,
};

export default memo(BarChartWidget);
