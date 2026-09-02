import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROTECTION_INTENT_STEPS } from "../protectionIntentData";
import { PROTECTION_CATEGORY_COLUMNS } from "../protectionIntentRecommendationData";
import { ARCHITECTING_SCENARIOS } from "../architectingScenarios";
import { useArcGenieActivation } from "../../../hooks/useArcGenieActivation";
import { plansStore } from "../../plans/hooks/usePlansData";
import { jobsStore } from "../../jobs/hooks/useJobsData";
import { useConfigureGoalsAutonomy } from "./useConfigureGoalsAutonomy";
import { useProtectionCategories } from "./useProtectionCategories";

const CUSTOM_PROMPT_OPTION_ID = "custom-prompt";
const DEFAULT_ARCHITECTING_DURATION_MS = 4800;

export function useProtectionIntentSetup() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [phase, setPhase] = useState("select"); // "select" | "customPrompt" | "architecting" | "recommended"
  const [promptText, setPromptText] = useState("");
  const [isActivated, setIsActivated] = useState(false);
  const { setIsArcGenieActivated } = useArcGenieActivation();
  const {
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
  } = useProtectionCategories();
  const { goals, toggleGoalEnabled, setGoalField, globalSettings, setGlobalField } =
    useConfigureGoalsAutonomy();

  const selectOption = useCallback((optionId) => {
    setSelectedOption(optionId);
    setPhase(optionId === CUSTOM_PROMPT_OPTION_ID ? "customPrompt" : "architecting");
  }, []);

  const handleGeneratePrompt = useCallback(() => {
    setPhase("architecting");
  }, []);

  const handleTryAnotherOption = useCallback(() => {
    setSelectedOption(null);
    setPromptText("");
    setPhase("select");
  }, []);

  useEffect(() => {
    if (phase !== "architecting") return undefined;
    const durationMs =
      ARCHITECTING_SCENARIOS[selectedOption]?.durationMs ?? DEFAULT_ARCHITECTING_DURATION_MS;
    const timer = setTimeout(() => setPhase("recommended"), durationMs);
    return () => clearTimeout(timer);
  }, [phase, selectedOption]);

  const handleCancel = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const handleNext = useCallback(() => {
    setActiveStep((current) => Math.min(current + 1, PROTECTION_INTENT_STEPS.length - 1));
  }, []);

  const handlePrevious = useCallback(() => {
    setActiveStep((current) => Math.max(current - 1, 0));
  }, []);

  const handleActivate = useCallback(() => {
    setIsActivated(true);
    setIsArcGenieActivated(true);
    // Plans are only created once the protection intent is activated, not
    // while it's still being defined in earlier steps. Saved one at a time
    // (not concurrently) so each create-then-reload cycle finishes before
    // the next starts — firing them in parallel let overlapping reloads
    // race and clobber each other, dropping categories from the final list.
    (async () => {
      for (const category of PROTECTION_CATEGORY_COLUMNS) {
        const planName = `${category.label} Protection Plan`;
        await plansStore.save({
          plan_name: planName,
          plan_type: "backup_recovery",
          plan_status: "active",
          protected_sources: 0,
          unprotected_sources: 0,
        });
        // Once a plan is created it immediately starts monitoring the
        // account's environment, tracked as a job on the Jobs page.
        await jobsStore.save({
          job_name: `environment_monitoring - ${category.label}`,
          job_type: "environment_monitoring",
          job_status: "in_progress",
          source_name: category.label,
          start_time_ts: new Date().toISOString(),
          duration: "00:00:00",
        });
      }
    })();
  }, [setIsArcGenieActivated]);

  const handleViewOverview = useCallback(() => {
    navigate("/arcgenie/overview");
  }, [navigate]);

  return {
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
    canProceed: phase === "recommended",
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
  };
}
