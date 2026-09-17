import { useCallback, useState } from "react";
import { DEFAULT_APPLY_SCOPE } from "../protectionIntentData";

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
  const [applyScope, setApplyScope] = useState(DEFAULT_APPLY_SCOPE);

  const toggleCategoryExpanded = useCallback((categoryId) => {
    setExpandedCategories((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }));
  }, []);

  return { expandedCategories, toggleCategoryExpanded, applyScope, setApplyScope };
}
