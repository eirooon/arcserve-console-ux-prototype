import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { buildRouteRegistry } from "../routes/routeRegistry";
import { getBreadcrumbTrail } from "../routes/getBreadcrumbTrail";
import { subRoutes } from "../routes/subRoutes";
import { usePageBreadcrumbLabel } from "../hooks/usePageBreadcrumb";

const registry = buildRouteRegistry({ subRoutes });

export default function AppBreadcrumbs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dynamicLabel = usePageBreadcrumbLabel();

  const matchedTrail = getBreadcrumbTrail(pathname, registry);
  if (!matchedTrail.length) return null;

  // The registry only knows static routes, so a dynamic segment (e.g. a
  // specific plan's id) resolves to its nearest static ancestor. When the
  // current page has published its own label for that segment (see
  // usePageBreadcrumb), append it as one more crumb rather than relying on
  // a registry entry that can't exist for every possible id.
  const lastMatch = matchedTrail[matchedTrail.length - 1];
  const trail =
    dynamicLabel && lastMatch.path !== pathname
      ? [...matchedTrail, { path: pathname, label: dynamicLabel }]
      : matchedTrail;

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {trail.map((crumb, idx) => {
        const isLast = idx === trail.length - 1;

        // For "virtual section nodes", don't navigate
        const isSection = crumb.path.startsWith("__section__/");

        if (isLast) {
          return (
            <Typography
              key={crumb.path}
              component="h1"
              sx={{
                fontSize: 16,
                fontWeight: "inherit",
                lineHeight: "inherit",
                m: 0,
                color: "#000",
              }}
            >
              {crumb.label}
            </Typography>
          );
        }

        return (
          <Link
            key={crumb.path}
            component="button"
            underline="hover"
            onClick={() => {
              if (!isSection) navigate(crumb.path);
            }}
            sx={{
              fontSize: 16,
              color: "text.secondary",
              cursor: isSection ? "default" : "pointer",
            }}
          >
            {crumb.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
