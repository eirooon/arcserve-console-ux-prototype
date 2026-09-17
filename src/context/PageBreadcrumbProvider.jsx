import { useMemo, useState } from "react";
import { PageBreadcrumbContext } from "./PageBreadcrumbContext";

/**
 * Lets a page publish a label for a breadcrumb segment the static route
 * registry (see src/routes/routeRegistry.js) can't know ahead of time —
 * e.g. a specific plan's name on its detail page. AppBreadcrumbs appends it
 * as a trailing crumb; see useSetPageBreadcrumb for the publishing side.
 */
export function PageBreadcrumbProvider({ children }) {
  const [label, setLabel] = useState(null);

  const value = useMemo(() => ({ label, setLabel }), [label]);

  return (
    <PageBreadcrumbContext.Provider value={value}>{children}</PageBreadcrumbContext.Provider>
  );
}
