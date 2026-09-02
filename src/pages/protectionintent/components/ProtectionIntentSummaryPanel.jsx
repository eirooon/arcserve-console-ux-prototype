import { Stack, Typography } from "@mui/material";
import ProtectionCategoryAccordion, { DetailRow } from "./ProtectionCategoryAccordion";
import ReviewGoalSummaryCard from "./ReviewGoalSummaryCard";
import { useReviewApply } from "../hooks/useReviewApply";
import {
  getAssessmentFrequencyLabel,
  getAutonomyLevelLabel,
} from "../configureGoalsAutonomyData";
import {
  PROTECTION_CATEGORY_COLUMNS,
  getDestinationSettingsForCategory,
  getExtensionCountLabel,
  getExtensionsForCategory,
  getGeneralSettingsForCategory,
  getQuickStatsForCategory,
} from "../protectionIntentRecommendationData";

export default function ProtectionIntentSummaryPanel({
  categoryFormData,
  extensionState,
  goals,
  globalSettings,
}) {
  const { expandedCategories, toggleCategoryExpanded } = useReviewApply();

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Protection Categories
        </Typography>
        <Stack spacing={2}>
          {PROTECTION_CATEGORY_COLUMNS.map((category) => (
            <ProtectionCategoryAccordion
              key={category.id}
              readOnly
              category={{
                ...category,
                label: categoryFormData[category.id].categoryName,
              }}
              quickStats={getQuickStatsForCategory(category.id, categoryFormData)}
              extensionCountLabel={getExtensionCountLabel(category.id, extensionState)}
              generalSettings={getGeneralSettingsForCategory(category.id, categoryFormData)}
              destinationSettings={getDestinationSettingsForCategory(category.id, categoryFormData)}
              extensions={getExtensionsForCategory(category.id, extensionState, categoryFormData)}
              expanded={expandedCategories[category.id]}
              onToggleExpand={() => toggleCategoryExpanded(category.id)}
            />
          ))}
        </Stack>
      </Stack>

      <Stack direction="row" spacing={4} alignItems="flex-start">
        <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" fontWeight={700} color="text.primary">
            Your Agentic Goals
          </Typography>
          <Stack spacing={2}>
            {goals.map((goal) => (
              <ReviewGoalSummaryCard key={goal.id} goal={goal} globalSettings={globalSettings} />
            ))}
          </Stack>
        </Stack>

        <Stack spacing={2} sx={{ width: 360, flexShrink: 0 }}>
          <Typography variant="body1" fontWeight={700} color="text.primary">
            Global Goal Settings
          </Typography>
          <Stack spacing={1.5}>
            <DetailRow
              label="Autonomy Level"
              value={getAutonomyLevelLabel(globalSettings.autonomyLevel)}
            />
            <DetailRow
              label="Assessment Frequency"
              value={getAssessmentFrequencyLabel(globalSettings.assessmentFrequency)}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
