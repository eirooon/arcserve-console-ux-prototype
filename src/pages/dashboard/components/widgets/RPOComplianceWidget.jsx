import { memo, useMemo } from "react";
import PropTypes from "prop-types";
import StatusDonutWidget from "./StatusDonutWidget";

const DEFAULT_COLORS = {
  compliant: "#00C853",
  notCompliant: "#FF1744",
};

function RPOComplianceWidget({
  data,
  colors = DEFAULT_COLORS,
  title,
  description,
}) {
  const fields = useMemo(
    () => [
      { key: "compliant", label: "Compliant", color: colors.compliant },
      { key: "notCompliant", label: "Not Compliant", color: colors.notCompliant },
    ],
    [colors],
  );

  return (
    <StatusDonutWidget
      title={title}
      description={description}
      data={data}
      fields={fields}
      primaryKey="compliant"
      centerSubtext="Compliant within 3 days"
    />
  );
}

RPOComplianceWidget.propTypes = {
  data: PropTypes.objectOf(PropTypes.number),
  colors: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.node,
  description: PropTypes.node,
};

export default memo(RPOComplianceWidget);
