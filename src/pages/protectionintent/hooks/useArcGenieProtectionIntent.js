import { useCallback } from "react";
import { toastStore } from "../../../api/toastStore";
import { useProtectionCategories } from "./useProtectionCategories";
import { useConfigureGoalsAutonomy } from "./useConfigureGoalsAutonomy";
import { useDirtyState } from "../../../hooks/useDirtyState";

// `track(fn)` (see useDirtyState) returns a fresh wrapper function every
// time it's called, so calling it inline defeats useCallback's memoization.
// This keeps that wrapper's identity stable across renders too, as long as
// `track` and `fn` themselves are (which they are for everything below).
function useTrackedSetter(track, fn) {
  return useCallback((...args) => track(fn)(...args), [track, fn]);
}

export function useArcGenieProtectionIntent() {
  const categories = useProtectionCategories();
  const goalsAutonomy = useConfigureGoalsAutonomy();
  // See useDirtyState — the app-standard way to keep Save disabled until
  // something has actually changed, and disabled again right after saving.
  const { dirty: isDirty, track, markClean } = useDirtyState();

  const toggleExtension = useTrackedSetter(track, categories.toggleExtension);

  const handleSaveCategoryEdit = useCallback(
    (categoryId, formValues) => {
      track(categories.handleSaveCategoryEdit)(categoryId, formValues);
      toastStore.pushToast(`${formValues.categoryName} settings updated.`);
    },
    [categories, track],
  );

  const toggleGoalEnabled = useTrackedSetter(track, goalsAutonomy.toggleGoalEnabled);

  const setGoalField = useTrackedSetter(track, goalsAutonomy.setGoalField);

  const handleSave = useCallback(() => {
    markClean();
    toastStore.pushToast("Protection intent settings saved.");
  }, [markClean]);

  return {
    // Protection categories
    categories: categories.categories,
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
    toggleGoalEnabled,
    setGoalField,

    // Page-level
    isDirty,
    handleSave,
  };
}
