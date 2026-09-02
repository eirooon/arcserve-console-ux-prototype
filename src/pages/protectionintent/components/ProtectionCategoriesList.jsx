import { Stack } from "@mui/material";
import ProtectionCategoryAccordion from "./ProtectionCategoryAccordion";
import {
  PROTECTION_CATEGORY_COLUMNS,
  getDestinationSettingsForCategory,
  getExtensionCountLabel,
  getExtensionsForCategory,
  getGeneralSettingsForCategory,
  getQuickStatsForCategory,
} from "../protectionIntentRecommendationData";

export default function ProtectionCategoriesList({
  categoryFormData,
  extensionState,
  expandedCategories,
  onToggleCategoryExpand,
  onToggleExtension,
  onEditCategory,
}) {
  return (
    <Stack spacing={2}>
      {PROTECTION_CATEGORY_COLUMNS.map((category) => (
        <ProtectionCategoryAccordion
          key={category.id}
          category={{
            ...category,
            label: categoryFormData[category.id].categoryName,
          }}
          quickStats={getQuickStatsForCategory(category.id, categoryFormData)}
          extensionCountLabel={getExtensionCountLabel(category.id, extensionState)}
          generalSettings={getGeneralSettingsForCategory(category.id, categoryFormData)}
          destinationSettings={getDestinationSettingsForCategory(category.id, categoryFormData)}
          extensions={getExtensionsForCategory(category.id, extensionState, categoryFormData)}
          expanded={Boolean(expandedCategories[category.id])}
          onToggleExpand={() => onToggleCategoryExpand(category.id)}
          onToggleExtension={(extensionLabel) => onToggleExtension(category.id, extensionLabel)}
          onEdit={() => onEditCategory(category.id)}
        />
      ))}
    </Stack>
  );
}
