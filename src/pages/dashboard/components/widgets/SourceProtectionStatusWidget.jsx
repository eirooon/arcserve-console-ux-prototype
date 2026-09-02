import { memo, useMemo } from "react";
import PropTypes from "prop-types";
import StatusDonutWidget from "./StatusDonutWidget";

const DEFAULT_COLORS = {
  success: "#00C853",
  failed: "#FF1744",
  missed: "#FFAB00",
  cancelled: "#6200EA",
  noPlan: "#78909C",
};

function SourceProtectionStatusWidget({
  data,
  colors = DEFAULT_COLORS,
  title,
  description,
}) {
  const fields = useMemo(
    () => [
      { key: "success", label: "Success", color: colors.success },
      { key: "failed", label: "Failed", color: colors.failed },
      { key: "missed", label: "Missed", color: colors.missed },
      { key: "cancelled", label: "Cancelled", color: colors.cancelled },
      { key: "noPlan", label: "No Plan", color: colors.noPlan },
    ],
    [colors],
  );

  return (
    <StatusDonutWidget
      title={title}
      description={description}
      data={data}
      fields={fields}
      primaryKey="success"
      centerSubtext="Successful Last Backups"
    />
  );
}

SourceProtectionStatusWidget.propTypes = {
  data: PropTypes.objectOf(PropTypes.number),
  colors: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.node,
  description: PropTypes.node,
};

export default memo(SourceProtectionStatusWidget);
