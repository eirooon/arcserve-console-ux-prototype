import { useCallback, useState } from "react";

/**
 * Tracks which one of a list of panels (identified by id) is open, so
 * expanding one collapses whichever other one was open — e.g. only one
 * Waiting on You card's inline dismiss-reason panel at a time.
 */
export function useExclusiveDisclosure() {
  const [openId, setOpenId] = useState(null);

  const isOpen = useCallback((id) => openId === id, [openId]);
  const open = useCallback((id) => setOpenId(id), []);
  const close = useCallback(() => setOpenId(null), []);

  return { openId, isOpen, open, close };
}
