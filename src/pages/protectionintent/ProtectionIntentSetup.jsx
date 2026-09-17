import { Box, Button, Stack, Typography } from "@mui/material";
import ProtectionIntentStepper from "./components/ProtectionIntentStepper";
import ProtectionIntentOptionCard from "./components/ProtectionIntentOptionCard";
import ProtectionIntentCustomPromptPanel from "./components/ProtectionIntentCustomPromptPanel";
import ProtectionIntentArchitectingPanel from "./components/ProtectionIntentArchitectingPanel";
import ProtectionIntentRecommendationPanelEnhanced from "./components/ProtectionIntentRecommendationPanelEnhanced";
import ProtectionCategoryEditDialog from "./components/ProtectionCategoryEditDialog";
import ProtectionCategoryAddDialog from "./components/ProtectionCategoryAddDialog";
import EnvironmentDiscoveryStep from "./components/EnvironmentDiscoveryStep";
import ConfigureGoalsAutonomyStepEnhanced from "./components/ConfigureGoalsAutonomyStepEnhanced";
import ConfigureMessagingChannelsStep from "./components/ConfigureMessagingChannelsStep";
import ReviewApplyStepEnhanced from "./components/ReviewApplyStepEnhanced";
import ProtectionIntentActivationSuccess from "./components/ProtectionIntentActivationSuccess";
import { useProtectionIntentSetup } from "./hooks/useProtectionIntentSetup";
import {
  PROTECTION_INTENT_OPTIONS,
  PROTECTION_INTENT_STEPS,
} from "./protectionIntentData";

const TITLE_GRADIENT = "linear-gradient(90deg, #8A2BFF 0%, #00A7E1 100%)";

export default function ProtectionIntentSetup() {
  const {
    activeStep,
    phase,
    selectedOption,
    selectOption,
    promptText,
    setPromptText,
    handleGeneratePrompt,
    handleTryAnotherOption,
    categories,
    handleEditCategory,
    expandedCategories,
    toggleCategoryExpanded,
    extensionState,
    toggleExtension,
    editDialogCategoryId,
    closeEditDialog,
    handleSaveCategoryEdit,
    categoryFormData,
    isAddCategoryOpen,
    openAddCategory,
    closeAddCategory,
    handleAddCategory,
    canProceed,
    handleCancel,
    handleNext,
    handlePrevious,
    goToStep,
    isActivated,
    handleActivate,
    handleViewOverview,
    goals,
    toggleGoalEnabled,
    setGoalField,
  } = useProtectionIntentSetup();

  const nextStepLabel = PROTECTION_INTENT_STEPS[activeStep + 1];

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        minHeight: "calc(100vh - 64px)",
        py: 6,
        ...(isActivated && {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }),
      }}
    >
      {isActivated ? (
        <ProtectionIntentActivationSuccess onViewDashboard={() => handleViewOverview()} />
      ) : (
        <Stack spacing={4} sx={{ maxWidth: "1132px", mx: "auto", px: 6 }}>
          <Box>
            <Typography variant="h6" color="text.primary">
              Let’s Get Started!
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                width: "fit-content",
                background: TITLE_GRADIENT,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              ArcGenie Protection Intent Setup
            </Typography>
          </Box>

          <ProtectionIntentStepper
            steps={PROTECTION_INTENT_STEPS}
            activeStep={activeStep}
          />

          {/* STEP 0: Environment Discovery */}
          {activeStep === 0 && (
            <EnvironmentDiscoveryStep
              onDiscoveryComplete={handleNext}
              onCancel={handleCancel}
            />
          )}

          {/* STEP 1: Define Protection Intent (formerly Step 0) */}
          {activeStep === 1 && (
            <>
              <Stack spacing={3}>
                {(phase === "select" || phase === "customPrompt") && (
                  <Box>
                    <Typography variant="body1" fontWeight={700} color="text.primary">
                      How would you like to define your protection intent?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Establish your organization&rsquo;s default protection intent.
                      ArcGenie will use this philosophy to automatically recommend and
                      apply policies to all sources.
                    </Typography>
                  </Box>
                )}

                {phase === "select" && (
                  <Stack direction="row" spacing={2}>
                    {PROTECTION_INTENT_OPTIONS.map((option) => (
                      <ProtectionIntentOptionCard
                        key={option.id}
                        icon={option.icon}
                        iconColor={option.iconColor}
                        avatarBgColor={option.avatarBgColor}
                        title={option.title}
                        description={option.description}
                        selected={selectedOption === option.id}
                        onSelect={() => selectOption(option.id)}
                      />
                    ))}
                  </Stack>
                )}

                {phase === "customPrompt" && (
                  <ProtectionIntentCustomPromptPanel
                    value={promptText}
                    onChange={setPromptText}
                    onGenerate={handleGeneratePrompt}
                  />
                )}

                {phase === "architecting" && (
                  <ProtectionIntentArchitectingPanel
                    selectedOption={selectedOption}
                    promptText={promptText}
                  />
                )}

                {phase === "recommended" && (
                  <ProtectionIntentRecommendationPanelEnhanced
                    recommendationData={{ sourcesCount: 31 }}
                    onTryAnotherOption={handleTryAnotherOption}
                    categories={categories}
                    onEditCategory={handleEditCategory}
                    onAddCategory={openAddCategory}
                    expandedCategories={expandedCategories}
                    onToggleCategoryExpand={toggleCategoryExpanded}
                    extensionState={extensionState}
                    onToggleExtension={toggleExtension}
                    categoryFormData={categoryFormData}
                  />
                )}
              </Stack>

              {phase !== "architecting" && (
                <Stack direction="row" justifyContent="space-between">
                  <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!canProceed}
                    onClick={handleNext}
                  >
                    {nextStepLabel ? `Next: ${nextStepLabel}` : "Next"}
                  </Button>
                </Stack>
              )}
            </>
          )}

          {/* STEP 2: Configure Goals & Autonomy (formerly Step 1) */}
          {activeStep === 2 && (
            <ConfigureGoalsAutonomyStepEnhanced
              onCancel={handleCancel}
              onPrevious={handlePrevious}
              onNext={handleNext}
              nextStepLabel={nextStepLabel}
              goals={goals}
              toggleGoalEnabled={toggleGoalEnabled}
              setGoalField={setGoalField}
            />
          )}

          {/* STEP 3: Configure Messaging Channels (formerly Step 2) */}
          {activeStep === 3 && (
            <ConfigureMessagingChannelsStep
              onCancel={handleCancel}
              onPrevious={handlePrevious}
              onNext={handleNext}
              nextStepLabel={nextStepLabel}
            />
          )}

          {/* STEP 4: Review & Apply (formerly Step 3) */}
          {activeStep === 4 && (
            <ReviewApplyStepEnhanced
              categories={categories}
              categoryFormData={categoryFormData}
              extensionState={extensionState}
              goals={goals}
              onCancel={handleCancel}
              onPrevious={handlePrevious}
              onActivate={handleActivate}
              onEditProtection={() => goToStep(1)}
              onEditGoals={() => goToStep(2)}
              onEditNotifications={() => goToStep(3)}
            />
          )}

          {activeStep > 4 && (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                {PROTECTION_INTENT_STEPS[activeStep]} is coming soon.
              </Typography>
              <Button variant="outlined" color="secondary" onClick={handlePrevious} sx={{ mt: 2 }}>
                Previous
              </Button>
            </Box>
          )}
        </Stack>
      )}

      <ProtectionCategoryEditDialog
        categoryId={editDialogCategoryId}
        categoryFormData={categoryFormData}
        categories={categories}
        onClose={closeEditDialog}
        onSave={handleSaveCategoryEdit}
      />

      <ProtectionCategoryAddDialog
        open={isAddCategoryOpen}
        onClose={closeAddCategory}
        onSave={handleAddCategory}
      />
    </Box>
  );
}
