import ArcGenieSuggestArchitecting from "./architecting/ArcGenieSuggestArchitecting";
import CategoryBasedArchitecting from "./architecting/CategoryBasedArchitecting";
import CustomPromptArchitecting from "./architecting/CustomPromptArchitecting";

const ARCHITECTING_VARIANTS = {
  "arcgenie-suggest": ArcGenieSuggestArchitecting,
  "category-based": CategoryBasedArchitecting,
  "custom-prompt": CustomPromptArchitecting,
};

export default function ProtectionIntentArchitectingPanel({ selectedOption, promptText }) {
  const VariantComponent = ARCHITECTING_VARIANTS[selectedOption] ?? ArcGenieSuggestArchitecting;

  return <VariantComponent promptText={promptText} />;
}
