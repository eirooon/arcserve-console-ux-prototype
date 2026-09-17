import { useCallback, useMemo, useState } from "react";

export function useProtectionCategoryEditForm(categoryId, categoryFormData, categories) {
  const category = useMemo(
    () => categories.find((item) => item.id === categoryId) ?? null,
    [categoryId, categories],
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
