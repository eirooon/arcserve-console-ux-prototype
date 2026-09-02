import { useCallback, useState } from "react";
import { GLOBAL_GOAL_SETTINGS, INITIAL_AGENTIC_GOALS } from "../configureGoalsAutonomyData";

export function useConfigureGoalsAutonomy() {
  const [goals, setGoals] = useState(INITIAL_AGENTIC_GOALS);
  const [globalSettings, setGlobalSettings] = useState(GLOBAL_GOAL_SETTINGS);

  const toggleGoalEnabled = useCallback((goalId) => {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === goalId ? { ...goal, enabled: !goal.enabled } : goal,
      ),
    );
  }, []);

  const setGoalField = useCallback((goalId, field, value) => {
    setGoals((current) =>
      current.map((goal) => (goal.id === goalId ? { ...goal, [field]: value } : goal)),
    );
  }, []);

  const setGlobalField = useCallback((field, value) => {
    setGlobalSettings((current) => ({ ...current, [field]: value }));
  }, []);

  return {
    goals,
    toggleGoalEnabled,
    setGoalField,
    globalSettings,
    setGlobalField,
  };
}
