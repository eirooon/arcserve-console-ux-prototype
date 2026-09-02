import { useCallback, useState } from "react";
import {
  PROTECTION_CATEGORY_COLUMNS,
  buildInitialExtensionState,
} from "../protectionIntentRecommendationData";
import { buildInitialCategoryFormData } from "../protectionCategoryEditOptions";

export function useProtectionCategories() {
  const [expandedCategories, setExpandedCategories] = useState(() => ({
    [PROTECTION_CATEGORY_COLUMNS[0].id]: true,
  }));
  const [extensionState, setExtensionState] = useState(buildInitialExtensionState);
  const [editDialogCategoryId, setEditDialogCategoryId] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState(buildInitialCategoryFormData);
  const [snackbarMessage, setSnackbarMessage] = useState(null);

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
    setSnackbarMessage(`${formValues.categoryName} settings saved successfully.`);
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbarMessage(null);
  }, []);

  return {
    expandedCategories,
    toggleCategoryExpanded,
    extensionState,
    toggleExtension,
    editDialogCategoryId,
    handleEditCategory,
    closeEditDialog,
    categoryFormData,
    handleSaveCategoryEdit,
    snackbarMessage,
    closeSnackbar,
  };
}
