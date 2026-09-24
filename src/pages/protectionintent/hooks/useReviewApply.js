import { useCallback, useState } from "react";

function buildInitialExpandedState(categories) {
  return categories.reduce((acc, category) => {
    acc[category.id] = true;
    return acc;
  }, {});
}

export function useReviewApply(categories) {
  const [expandedCategories, setExpandedCategories] = useState(() =>
    buildInitialExpandedState(categories),
  );

  const toggleCategoryExpanded = useCallback((categoryId) => {
    setExpandedCategories((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }));
  }, []);

  return { expandedCategories, toggleCategoryExpanded };
}
