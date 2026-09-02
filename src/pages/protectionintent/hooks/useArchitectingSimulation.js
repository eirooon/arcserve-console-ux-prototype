import { useEffect, useState } from "react";

const TICK_MS = 150;

/**
 * Drives the simulated progress for an architecting scenario: an elapsed-time
 * clock ticks forward, steps complete in sequence, and the currently active
 * step's counter animates toward its target. Each protection intent option
 * renders its own variant component, so switching options remounts this hook
 * with a fresh start rather than requiring an in-place reset.
 */
export function useArchitectingSimulation(scenario) {
  const [elapsed, setElapsed] = useState(0);
  const { durationMs, steps } = scenario;

  useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.min(Date.now() - startedAt, durationMs));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [durationMs]);

  const progressRatio = durationMs > 0 ? elapsed / durationMs : 0;
  const remainingSeconds = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
  const activeIndex = Math.min(steps.length - 1, Math.floor(progressRatio * steps.length));

  const stepStates = steps.map((step, index) => {
    if (index < activeIndex) {
      return { ...step, status: "done", count: step.target ?? null };
    }
    if (index > activeIndex) {
      return { ...step, status: "pending", count: 0 };
    }
    const segmentStart = index / steps.length;
    const segmentEnd = (index + 1) / steps.length;
    const segmentRatio = Math.min(
      1,
      Math.max(0, (progressRatio - segmentStart) / (segmentEnd - segmentStart)),
    );
    const isComplete = index === steps.length - 1 && progressRatio >= 1;
    return {
      ...step,
      status: isComplete ? "done" : "active",
      count: step.target != null ? Math.round(step.target * segmentRatio) : null,
    };
  });

  return { elapsed, progressRatio, remainingSeconds, stepStates };
}
