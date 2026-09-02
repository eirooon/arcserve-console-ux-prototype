import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import ProtectionIntentStepper from "./components/ProtectionIntentStepper";
import ProtectionIntentOptionCard from "./components/ProtectionIntentOptionCard";
import ProtectionIntentCustomPromptPanel from "./components/ProtectionIntentCustomPromptPanel";
import ProtectionIntentArchitectingPanel from "./components/ProtectionIntentArchitectingPanel";
import ProtectionIntentRecommendationPanel from "./components/ProtectionIntentRecommendationPanel";
import ProtectionCategoryEditDialog from "./components/ProtectionCategoryEditDialog";
import ConfigureGoalsAutonomyStep from "./components/ConfigureGoalsAutonomyStep";
import ConfigureMessagingChannelsStep from "./components/ConfigureMessagingChannelsStep";
import ReviewApplyStep from "./components/ReviewApplyStep";
import ProtectionIntentActivatedPanel from "./components/ProtectionIntentActivatedPanel";
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
    handleEditCategory,
    expandedCategories,
    toggleCategoryExpanded,
    extensionState,
    toggleExtension,
    editDialogCategoryId,
    closeEditDialog,
    handleSaveCategoryEdit,
    categoryFormData,
    snackbarMessage,
    closeSnackbar,
    canProceed,
    handleCancel,
    handleNext,
    handlePrevious,
    isActivated,
    handleActivate,
    handleViewOverview,
    goals,
    toggleGoalEnabled,
    setGoalField,
    globalSettings,
    setGlobalField,
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
        <ProtectionIntentActivatedPanel
          goals={goals}
          globalSettings={globalSettings}
          onViewOverview={handleViewOverview}
        />
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

          {activeStep === 0 && (
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
                  <ProtectionIntentRecommendationPanel
                    onTryAnotherOption={handleTryAnotherOption}
                    onEditCategory={handleEditCategory}
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

          {activeStep === 1 && (
            <ConfigureGoalsAutonomyStep
              onCancel={handleCancel}
              onPrevious={handlePrevious}
              onNext={handleNext}
              nextStepLabel={nextStepLabel}
              goals={goals}
              toggleGoalEnabled={toggleGoalEnabled}
              setGoalField={setGoalField}
              globalSettings={globalSettings}
              setGlobalField={setGlobalField}
            />
          )}

          {activeStep === 2 && (
            <ConfigureMessagingChannelsStep
              onCancel={handleCancel}
              onPrevious={handlePrevious}
              onNext={handleNext}
              nextStepLabel={nextStepLabel}
            />
          )}

          {activeStep === 3 && (
            <ReviewApplyStep
              categoryFormData={categoryFormData}
              extensionState={extensionState}
              goals={goals}
              globalSettings={globalSettings}
              onCancel={handleCancel}
              onPrevious={handlePrevious}
              onActivate={handleActivate}
            />
          )}

          {activeStep > 3 && (
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
        onClose={closeEditDialog}
        onSave={handleSaveCategoryEdit}
      />

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={closeSnackbar}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
