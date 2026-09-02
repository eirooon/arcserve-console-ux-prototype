import { useState } from "react";

/**
 * Drives the "confirm delete selected rows" flow shared by every list
 * toolbar: tracks whether the confirm dialog is open, and wraps the
 * store's delete action so the dialog closes once it settles.
 */
export function useDeleteConfirmation(deleteSelected) {
  const [open, setOpen] = useState(false);

  return {
    open,
    openConfirm: () => setOpen(true),
    closeConfirm: () => setOpen(false),
    confirmDelete: async () => {
      await deleteSelected();
      setOpen(false);
    },
  };
}
