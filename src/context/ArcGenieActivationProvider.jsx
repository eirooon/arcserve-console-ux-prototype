import { useEffect, useMemo, useState } from "react";
import { ArcGenieActivationContext } from "./ArcGenieActivationContext";

const STORAGE_KEY = "arcserve.arcgenie.activated";

function readInitialValue() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function ArcGenieActivationProvider({ children }) {
  const [isArcGenieActivated, setIsArcGenieActivated] = useState(readInitialValue);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isArcGenieActivated));
    } catch {
      // ignore
    }
  }, [isArcGenieActivated]);

  const value = useMemo(
    () => ({ isArcGenieActivated, setIsArcGenieActivated }),
    [isArcGenieActivated],
  );

  return (
    <ArcGenieActivationContext.Provider value={value}>
      {children}
    </ArcGenieActivationContext.Provider>
  );
}
