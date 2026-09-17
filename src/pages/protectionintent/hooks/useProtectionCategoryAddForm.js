import { useCallback, useState } from "react";
import { buildDefaultCategoryFormValues } from "../protectionCategoryEditOptions";

// Mirrors useProtectionCategoryEditForm's reset-on-change pattern, but reset
// is keyed on the dialog opening (there's no persisted category yet) rather
// than on a categoryId changing.
export function useProtectionCategoryAddForm(open) {
  const [formValues, setFormValues] = useState(() => buildDefaultCategoryFormValues(""));
  const [expandedExtension, setExpandedExtension] = useState("Compliance");
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setFormValues(buildDefaultCategoryFormValues(""));
      setExpandedExtension("Compliance");
    }
  }

  const setField = useCallback((field, value) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  }, []);

  const toggleExtensionExpanded = useCallback((label) => {
    setExpandedExtension((current) => (current === label ? null : label));
  }, []);

  return { formValues, setField, expandedExtension, toggleExtensionExpanded };
}
