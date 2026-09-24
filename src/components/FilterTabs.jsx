import PropTypes from "prop-types";
import { Chip, Stack, Tab, Tabs } from "@mui/material";

/**
 * Tabs-based filter control (All / X / Y / Z, each with an optional count),
 * shared by the ArcGenie Waiting on You and Activity Log filters so both use
 * the same pattern instead of separate one-off implementations. Counts render
 * as a small Chip matching the badge next to the "Waiting on You" section
 * title, just smaller, rather than appended "(N)" text.
 */
export default function FilterTabs({ value, onChange, options, ariaLabel }) {
  return (
    <Tabs
      value={value}
      onChange={(event, next) => onChange(next)}
      aria-label={ariaLabel}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={{ borderBottom: 1, borderColor: "divider", minHeight: 40 }}
    >
      {options.map((option) => (
        <Tab
          key={option.value}
          value={option.value}
          sx={{ minHeight: 40, py: 0 }}
          label={
            typeof option.count === "number" ? (
              <Stack direction="row" spacing={0.75} alignItems="center">
                <span>{option.label}</span>
                <Chip
                  label={option.count}
                  size="small"
                  sx={{ height: 18, fontSize: 11, "& .MuiChip-label": { px: 0.75 } }}
                />
              </Stack>
            ) : (
              option.label
            )
          }
        />
      ))}
    </Tabs>
  );
}

FilterTabs.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
    }),
  ).isRequired,
  ariaLabel: PropTypes.string.isRequired,
};
