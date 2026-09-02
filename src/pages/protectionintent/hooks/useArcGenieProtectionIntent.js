import { useCallback, useState } from "react";
import { useProtectionCategories } from "./useProtectionCategories";
import { useConfigureGoalsAutonomy } from "./useConfigureGoalsAutonomy";

export function useArcGenieProtectionIntent() {
  const categories = useProtectionCategories();
  const goalsAutonomy = useConfigureGoalsAutonomy();
  const [isDirty, setIsDirty] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  const toggleExtension = useCallback(
    (categoryId, extensionLabel) => {
      categories.toggleExtension(categoryId, extensionLabel);
      setIsDirty(true);
    },
    [categories],
  );

  const handleSaveCategoryEdit = useCallback(
    (categoryId, formValues) => {
      categories.handleSaveCategoryEdit(categoryId, formValues);
      setIsDirty(true);
      setSnackbarMessage(`${formValues.categoryName} settings updated.`);
    },
    [categories],
  );

  const toggleGoalEnabled = useCallback(
    (goalId) => {
      goalsAutonomy.toggleGoalEnabled(goalId);
      setIsDirty(true);
    },
    [goalsAutonomy],
  );

  const setGoalField = useCallback(
    (goalId, field, value) => {
      goalsAutonomy.setGoalField(goalId, field, value);
      setIsDirty(true);
    },
    [goalsAutonomy],
  );

  const setGlobalField = useCallback(
    (field, value) => {
      goalsAutonomy.setGlobalField(field, value);
      setIsDirty(true);
    },
    [goalsAutonomy],
  );

  const handleSave = useCallback(() => {
    setIsDirty(false);
    setSnackbarMessage("Protection intent settings saved.");
  }, []);

  const closeSnackbar = useCallback(() => setSnackbarMessage(null), []);

  return {
    // Protection categories
    expandedCategories: categories.expandedCategories,
    toggleCategoryExpanded: categories.toggleCategoryExpanded,
    extensionState: categories.extensionState,
    editDialogCategoryId: categories.editDialogCategoryId,
    handleEditCategory: categories.handleEditCategory,
    closeEditDialog: categories.closeEditDialog,
    categoryFormData: categories.categoryFormData,
    toggleExtension,
    handleSaveCategoryEdit,

    // Goals & autonomy
    goals: goalsAutonomy.goals,
    globalSettings: goalsAutonomy.globalSettings,
    toggleGoalEnabled,
    setGoalField,
    setGlobalField,

    // Page-level
    isDirty,
    handleSave,
    snackbarMessage,
    closeSnackbar,
  };
}
