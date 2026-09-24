import { useMemo, useState } from "react";

export const ALL_REQUEST_TYPES = "all";

const REQUEST_TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "approval", label: "Approvals" },
  { value: "suggestion", label: "Suggestions" },
  { value: "exception", label: "Blocked" },
];

/**
 * Filters Waiting on You items by request type (approval / suggestion /
 * exception) and derives per-filter counts. Shared by the Overview page's
 * preview section and the full Waiting On You page so both use the same
 * segmented filter instead of drifting into separate implementations.
 */
export function useWaitingOnYouFilter(items) {
  const [activeType, setActiveType] = useState(ALL_REQUEST_TYPES);

  const visibleItems = useMemo(
    () =>
      activeType === ALL_REQUEST_TYPES
        ? items
        : items.filter((item) => item.type === activeType),
    [items, activeType],
  );

  const filterOptions = useMemo(
    () =>
      REQUEST_TYPE_FILTERS.map((option) => ({
        ...option,
        count:
          option.value === ALL_REQUEST_TYPES
            ? items.length
            : items.filter((item) => item.type === option.value).length,
      })),
    [items],
  );

  return { activeType, setActiveType, visibleItems, filterOptions };
}
