import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

const TICK_MS = 150;

export const DISCOVERY_PHASES = [
  { id: "vms", label: "Virtual machines", threshold: 0.15, target: 150 },
  { id: "databases", label: "Databases", threshold: 0.25, target: 8 },
  { id: "fileServers", label: "File servers", threshold: 0.35, target: 12 },
  { id: "criticality", label: "Analyzing business criticality", threshold: 0.68, target: null },
  { id: "coverage", label: "Checking backup coverage", threshold: 0.9, target: null },
];

const COUNT_RAMP_SPAN = 0.15;

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/**
 * Simulates a backend discovery scan: progress ticks forward on a timer and
 * each phase flips to "done" as progress crosses its threshold. A real
 * integration would replace the interval with a subscription (websocket,
 * SSE, or poll) that reports the same progress/phase shape from live events.
 */
export function useEnvironmentDiscoverySimulation() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("scanning");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 0.045, 1);
        if (next >= 1) {
          clearInterval(interval);
          setStatus("complete");
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, []);

  const displayedProgress = status === "complete" ? 1 : progress;

  const phases = DISCOVERY_PHASES.map((phase) => {
    const done = status === "complete" || displayedProgress >= phase.threshold;

    if (!done || phase.target == null) {
      return { ...phase, status: done ? "done" : "pending", count: null };
    }

    const rampRatio =
      status === "complete" || prefersReducedMotion
        ? 1
        : Math.min(1, (displayedProgress - phase.threshold) / COUNT_RAMP_SPAN);

    return { ...phase, status: "done", count: Math.round(phase.target * easeOutCubic(rampRatio)) };
  });

  return { progress: displayedProgress, status, phases };
}
