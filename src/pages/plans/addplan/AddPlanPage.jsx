import { Box } from "@mui/material";
import AddPlanHeader from "./components/AddPlanHeader";
import AddPlanStepNav from "./components/AddPlanStepNav";
import BasicStep from "./components/BasicStep";
import SourcesStep from "./components/SourcesStep";
import TasksStep from "./components/TasksStep";
import { useAddPlanWizard } from "./hooks/useAddPlanWizard";

// Header (64px, global AppHeader) is rendered once by AppShell; this page
// only owns the space below it, so its body fills the rest of the viewport
// the same way SplitPageLayout does for the split-nav pages.
const HEADER_HEIGHT = 64;

export default function AddPlanPage() {
  const wizard = useAddPlanWizard();

  return (
    <Box sx={{ height: `calc(100vh - ${HEADER_HEIGHT}px)`, display: "flex", flexDirection: "column" }}>
      <AddPlanHeader
        isEditing={wizard.isEditing}
        planName={wizard.planName}
        onCancel={wizard.cancel}
        onPrevious={wizard.goPrevious}
        onNext={wizard.goNext}
        onSubmit={wizard.submit}
        isFirstStep={wizard.isFirstStep}
        isLastStep={wizard.isLastStep}
        canSubmit={wizard.canSubmit}
        saving={wizard.saving}
      />

      <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
        <AddPlanStepNav
          steps={wizard.steps}
          stepId={wizard.stepId}
          stepIndex={wizard.stepIndex}
          onSelect={wizard.goToStep}
        />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          {wizard.stepId === "basic" && (
            <BasicStep
              planName={wizard.planName}
              onPlanNameChange={wizard.setPlanName}
              protectionTypeId={wizard.protectionTypeId}
              onProtectionTypeChange={wizard.setProtectionTypeId}
              description={wizard.description}
              onDescriptionChange={wizard.setDescription}
            />
          )}

          {wizard.stepId === "sources" && (
            <SourcesStep
              selectedSourceIds={wizard.selectedSourceIds}
              onSelectionChange={wizard.setSelectedSourceIds}
            />
          )}

          {wizard.stepId === "tasks" && (
            <TasksStep
              selectedSourceIds={wizard.selectedSourceIds}
              onRemoveSources={wizard.removeSources}
              activityType={wizard.activityType}
              onActivityTypeChange={wizard.setActivityType}
              taskDetails={wizard.taskDetails}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
