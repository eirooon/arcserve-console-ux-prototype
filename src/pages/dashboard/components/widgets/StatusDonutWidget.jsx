import { memo } from "react";
import PropTypes from "prop-types";
import CardWidget from "../../../../components/CardWidget";
import SharedDonutChart from "../SharedDonutChart";

function StatusDonutWidget({
  title,
  description,
  data,
  fields,
  primaryKey,
  centerSubtext,
}) {
  const total = Object.values(data || {}).reduce(
    (acc, val) => acc + (val || 0),
    0,
  );
  const primaryField = fields.find((field) => field.key === primaryKey);
  const primaryRate =
    total > 0 ? Math.round(((data?.[primaryKey] ?? 0) / total) * 100) : 0;

  const chartData = fields
    .map((field) => ({
      id: field.key,
      label: `${field.label} (${data?.[field.key] ?? 0})`,
      value: data?.[field.key] ?? 0,
      color: field.color,
    }))
    .filter((item) => item.value > 0);

  return (
    <CardWidget title={title} description={description}>
      <SharedDonutChart
        data={chartData}
        centerValue={`${primaryRate}%`}
        centerValueColor={primaryField?.color}
        centerSubtext={centerSubtext}
      />
    </CardWidget>
  );
}

StatusDonutWidget.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  data: PropTypes.objectOf(PropTypes.number),
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
  primaryKey: PropTypes.string.isRequired,
  centerSubtext: PropTypes.node.isRequired,
};

export default memo(StatusDonutWidget);
