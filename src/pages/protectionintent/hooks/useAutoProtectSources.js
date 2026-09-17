import { useCallback, useMemo, useState } from "react";
import { toastStore } from "../../../api/toastStore";
import { AUTO_PROTECT_SOURCES } from "../arcGenieOverviewData";

export function useAutoProtectSources() {
  const [sources, setSources] = useState(AUTO_PROTECT_SOURCES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSources = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return sources.filter((source) => {
      const matchesSearch = !term || source.sourceName.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || source.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sources, searchTerm, statusFilter]);

  const handlePrimaryAction = useCallback((source) => {
    toastStore.pushToast(`${source.actionLabel}: ${source.sourceName} → ${source.proposedPlan}.`);
  }, []);

  const handleDismissSource = useCallback(
    (sourceId) => {
      const source = sources.find((existing) => existing.id === sourceId);
      setSources((current) => current.filter((existing) => existing.id !== sourceId));
      if (source) toastStore.pushToast(`${source.sourceName} dismissed.`);
    },
    [sources],
  );

  const handleViewDetails = useCallback(
    (sourceId) => {
      const source = sources.find((existing) => existing.id === sourceId);
      if (source) toastStore.pushToast(`Opening details for ${source.sourceName}.`);
    },
    [sources],
  );

  const handleRunNow = useCallback(() => {
    toastStore.pushToast("Auto-Protect run started.");
  }, []);

  return {
    sources: filteredSources,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handlePrimaryAction,
    handleDismissSource,
    handleViewDetails,
    handleRunNow,
  };
}
