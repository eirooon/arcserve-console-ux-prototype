import { useCallback, useMemo, useState } from "react";
import { PROTECTION_CATEGORY_COLUMNS } from "../protectionIntentRecommendationData";

export function useProtectionCategoryEditForm(categoryId, categoryFormData) {
  const category = useMemo(
    () => PROTECTION_CATEGORY_COLUMNS.find((item) => item.id === categoryId) ?? null,
    [categoryId],
  );

  const [formValues, setFormValues] = useState(() =>
    category ? categoryFormData[category.id] : null,
  );
  const [loadedCategoryId, setLoadedCategoryId] = useState(categoryId);
  const [expandedExtension, setExpandedExtension] = useState("Compliance");

  if (categoryId !== loadedCategoryId) {
    setLoadedCategoryId(categoryId);
    setExpandedExtension("Compliance");
    setFormValues(category ? categoryFormData[category.id] : null);
  }

  const setField = useCallback((field, value) => {
    setFormValues((current) => (current ? { ...current, [field]: value } : current));
  }, []);

  const toggleExtensionExpanded = useCallback((label) => {
    setExpandedExtension((current) => (current === label ? null : label));
  }, []);

  return { category, formValues, setField, expandedExtension, toggleExtensionExpanded };
}
