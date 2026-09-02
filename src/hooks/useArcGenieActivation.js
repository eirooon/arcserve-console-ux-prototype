import { useContext } from "react";
import { ArcGenieActivationContext } from "../context/ArcGenieActivationContext";

export function useArcGenieActivation() {
  const context = useContext(ArcGenieActivationContext);
  if (!context) {
    throw new Error("useArcGenieActivation must be used within an ArcGenieActivationProvider");
  }
  return context;
}
