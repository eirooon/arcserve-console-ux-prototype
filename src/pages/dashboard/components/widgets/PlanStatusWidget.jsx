import { memo, useMemo } from "react";
import PropTypes from "prop-types";
import StatusDonutWidget from "./StatusDonutWidget";

const DEFAULT_COLORS = {
  deployed: "#00C853",
  deploying: "#2979FF",
  failed: "#FF1744",
  disabled: "#78909C",
};

function PlanStatusWidget({
  data,
  colors = DEFAULT_COLORS,
  title,
  description,
}) {
  const fields = useMemo(
    () => [
      { key: "deployed", label: "Deployed", color: colors.deployed },
      { key: "deploying", label: "Deploying", color: colors.deploying },
      { key: "failed", label: "Failed", color: colors.failed },
      { key: "disabled", label: "Disabled", color: colors.disabled },
    ],
    [colors],
  );

  return (
    <StatusDonutWidget
      title={title}
      description={description}
      data={data}
      fields={fields}
      primaryKey="deployed"
      centerSubtext="Successful Deployment"
    />
  );
}

PlanStatusWidget.propTypes = {
  data: PropTypes.objectOf(PropTypes.number),
  colors: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.node,
  description: PropTypes.node,
};

export default memo(PlanStatusWidget);
