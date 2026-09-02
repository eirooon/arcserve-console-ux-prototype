import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SplitPageLayout from "./SplitPageLayout";
import { subRoutes } from "../routes/subRoutes";

function getSplitItems(parentPath) {
  return Object.entries(subRoutes)
    .filter(([, node]) => node.parent === parentPath)
    .map(([path, node]) => ({
      id: node.id || path,
      label: node.label,
      to: path, // absolute path
      count: node.count ?? 0,
    }));
}

export function createSplitLayout({ parentPath, rootLabel, defaultId, useCounts }) {
  // Optional: a hook returning { [itemId]: count } to override the static
  // counts from subRoutes.js with live ones derived from real data (see
  // useSourceCounts for the Sources section). Sections that don't pass one
  // keep the static placeholder counts unchanged.
  const useLiveCounts = useCounts || (() => null);

  function SplitLayout() {
    const liveCounts = useLiveCounts();
    const baseItems = React.useMemo(() => getSplitItems(parentPath), []);
    const items = React.useMemo(() => {
      if (!liveCounts) return baseItems;
      return baseItems.map((item) =>
        item.id in liveCounts ? { ...item, count: liveCounts[item.id] } : item,
      );
    }, [baseItems, liveCounts]);
    const location = useLocation();
    const navigate = useNavigate();

    const selectedId = React.useMemo(() => {
      // exact match first
      const exact = items.find((i) => i.to === location.pathname);
      if (exact) return exact.id;

      // fallback to longest prefix (supports deeper routes like /sources/machines/123)
      const prefixMatches = items
        .filter((i) => location.pathname.startsWith(i.to + "/"))
        .sort((a, b) => b.to.length - a.to.length);

      return prefixMatches[0]?.id ?? items[0]?.id ?? defaultId;
    }, [items, location.pathname]);

    const handleSelect = (id) => {
      const target = items.find((i) => i.id === id);
      if (target) navigate(target.to);
    };

    return (
      <SplitPageLayout
        rootLabel={rootLabel}
        items={items}
        selectedId={selectedId}
        onSelect={handleSelect}
      >
        <Outlet context={{ selectedId }} />
      </SplitPageLayout>
    );
  }

  SplitLayout.displayName = `SplitLayout(${rootLabel})`;
  return SplitLayout;
}
