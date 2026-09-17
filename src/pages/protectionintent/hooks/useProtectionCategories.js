import { useCallback, useState } from "react";
import { toastStore } from "../../../api/toastStore";
import {
  PROTECTION_CATEGORY_COLUMNS,
  buildInitialExtensionState,
  buildDefaultExtensionState,
} from "../protectionIntentRecommendationData";
import { buildInitialCategoryFormData } from "../protectionCategoryEditOptions";

function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueCategoryId(categoryName, existingCategories) {
  const base = slugify(categoryName) || "custom-category";
  const existingIds = new Set(existingCategories.map((category) => category.id));
  if (!existingIds.has(base)) return base;

  let suffix = 2;
  while (existingIds.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export function useProtectionCategories() {
  const [categories, setCategories] = useState(PROTECTION_CATEGORY_COLUMNS);
  const [expandedCategories, setExpandedCategories] = useState(() => ({
    [PROTECTION_CATEGORY_COLUMNS[0].id]: true,
  }));
  const [extensionState, setExtensionState] = useState(buildInitialExtensionState);
  const [editDialogCategoryId, setEditDialogCategoryId] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState(buildInitialCategoryFormData);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const toggleCategoryExpanded = useCallback((categoryId) => {
    setExpandedCategories((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }));
  }, []);

  const toggleExtension = useCallback((categoryId, extensionLabel) => {
    setExtensionState((current) => ({
      ...current,
      [categoryId]: {
        ...current[categoryId],
        [extensionLabel]: !current[categoryId][extensionLabel],
      },
    }));
  }, []);

  const handleEditCategory = useCallback((categoryId) => {
    setEditDialogCategoryId(categoryId);
  }, []);

  const closeEditDialog = useCallback(() => {
    setEditDialogCategoryId(null);
  }, []);

  const handleSaveCategoryEdit = useCallback((categoryId, formValues) => {
    setCategoryFormData((current) => ({ ...current, [categoryId]: formValues }));
    setEditDialogCategoryId(null);
    toastStore.pushToast(`${formValues.categoryName} settings saved successfully.`);
  }, []);

  const openAddCategory = useCallback(() => {
    setIsAddCategoryOpen(true);
  }, []);

  const closeAddCategory = useCallback(() => {
    setIsAddCategoryOpen(false);
  }, []);

  const handleAddCategory = useCallback((formValues) => {
    setCategories((current) => {
      const id = uniqueCategoryId(formValues.categoryName, current);

      setCategoryFormData((formData) => ({ ...formData, [id]: formValues }));
      setExtensionState((state) => ({ ...state, [id]: buildDefaultExtensionState() }));
      setExpandedCategories((expanded) => ({ ...expanded, [id]: true }));

      return [
        ...current,
        {
          id,
          label: formValues.categoryName,
          description: "Custom protection category",
          sourcesCount: 0,
        },
      ];
    });
    setIsAddCategoryOpen(false);
    toastStore.pushToast(`${formValues.categoryName} added as a new protection category.`);
  }, []);

  return {
    categories,
    expandedCategories,
    toggleCategoryExpanded,
    extensionState,
    toggleExtension,
    editDialogCategoryId,
    handleEditCategory,
    closeEditDialog,
    categoryFormData,
    handleSaveCategoryEdit,
    isAddCategoryOpen,
    openAddCategory,
    closeAddCategory,
    handleAddCategory,
  };
}
