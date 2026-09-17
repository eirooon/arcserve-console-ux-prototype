import { useContext, useEffect } from "react";
import { PageBreadcrumbContext } from "../context/PageBreadcrumbContext";

function usePageBreadcrumbContext() {
  const context = useContext(PageBreadcrumbContext);
  if (!context) {
    throw new Error("usePageBreadcrumb must be used within a PageBreadcrumbProvider");
  }
  return context;
}

/**
 * Publishes `label` as a trailing breadcrumb segment (see AppBreadcrumbs)
 * for as long as the calling page stays mounted, clearing it on unmount so
 * the next page starts clean. Pass `null`/`undefined` (e.g. while the
 * underlying data is still loading) to publish nothing yet.
 */
export function usePageBreadcrumb(label) {
  const { setLabel } = usePageBreadcrumbContext();

  useEffect(() => {
    setLabel(label ?? null);
    return () => setLabel(null);
  }, [label, setLabel]);
}

/** Read-only access for AppBreadcrumbs itself. */
export function usePageBreadcrumbLabel() {
  return usePageBreadcrumbContext().label;
}
