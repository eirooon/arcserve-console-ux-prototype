import { useCallback, useState } from "react";
import { INITIAL_AGENTIC_GOALS } from "../configureGoalsAutonomyData";

export function useConfigureGoalsAutonomy() {
  const [goals, setGoals] = useState(INITIAL_AGENTIC_GOALS);

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

  return {
    goals,
    toggleGoalEnabled,
    setGoalField,
  };
}
