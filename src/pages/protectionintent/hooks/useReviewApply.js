import { useCallback, useState } from "react";
import { PROTECTION_CATEGORY_COLUMNS } from "../protectionIntentRecommendationData";

function buildInitialExpandedState() {
  return PROTECTION_CATEGORY_COLUMNS.reduce((acc, category) => {
    acc[category.id] = true;
    return acc;
  }, {});
}

export function useReviewApply() {
  const [expandedCategories, setExpandedCategories] = useState(buildInitialExpandedState);

  const toggleCategoryExpanded = useCallback((categoryId) => {
    setExpandedCategories((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }));
  }, []);

  return { expandedCategories, toggleCategoryExpanded };
}
