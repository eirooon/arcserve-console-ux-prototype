import { useCallback, useMemo, useState } from "react";
import { AUTO_PROTECT_SOURCES } from "../arcGenieOverviewData";

export function useAutoProtectSources() {
  const [sources, setSources] = useState(AUTO_PROTECT_SOURCES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [menuState, setMenuState] = useState({ anchorEl: null, sourceId: null });
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  const filteredSources = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return sources.filter((source) => {
      const matchesSearch = !term || source.sourceName.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || source.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sources, searchTerm, statusFilter]);

  const openMenu = useCallback((event, sourceId) => {
    setMenuState({ anchorEl: event.currentTarget, sourceId });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuState({ anchorEl: null, sourceId: null });
  }, []);

  const handlePrimaryAction = useCallback((source) => {
    setSnackbarMessage(`${source.actionLabel}: ${source.sourceName} → ${source.proposedPlan}.`);
  }, []);

  const handleDismissSource = useCallback(
    (sourceId) => {
      const source = sources.find((existing) => existing.id === sourceId);
      setSources((current) => current.filter((existing) => existing.id !== sourceId));
      setSnackbarMessage(source ? `${source.sourceName} dismissed.` : null);
      closeMenu();
    },
    [sources, closeMenu],
  );

  const handleViewDetails = useCallback(
    (sourceId) => {
      const source = sources.find((existing) => existing.id === sourceId);
      setSnackbarMessage(source ? `Opening details for ${source.sourceName}.` : null);
      closeMenu();
    },
    [sources, closeMenu],
  );

  const handleRunNow = useCallback(() => {
    setSnackbarMessage("Auto-Protect run started.");
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbarMessage(null);
  }, []);

  return {
    sources: filteredSources,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    menuState,
    openMenu,
    closeMenu,
    handlePrimaryAction,
    handleDismissSource,
    handleViewDetails,
    handleRunNow,
    snackbarMessage,
    closeSnackbar,
  };
}
