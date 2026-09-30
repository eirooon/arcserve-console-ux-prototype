import { useCallback, useState } from "react";
import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { toastStore } from "../../../api/toastStore";
import { infrastructureStore } from "./useInfrastructureData";

function describeCloudAccountDelete(row) {
  const parts = [`${row.name} will be removed from Cloud Accounts.`];
  if (row.policyCount > 0) {
    parts.push(`${row.policyCount} ${row.policyCount === 1 ? "policy uses" : "policies use"} it and will stop running.`);
  }
  if (row.azure) {
    parts.push(
      "Nothing is deleted in Azure. To also remove what Arcserve created there, use Disconnect on the account’s Modify page.",
    );
  }
  return parts.join(" ");
}

// Per-category confirm copy for the row menu's "Delete".
export const CLOUD_ACCOUNT_DELETE = {
  title: "Delete Cloud Account?",
  describe: describeCloudAccountDelete,
};

export const SITE_DELETE = {
  title: "Delete Site?",
  describe: (row) => `${row.name} will be removed from Sites. This cannot be undone.`,
};

/**
 * A row menu's "Delete": asks for confirmation first (copy from `config`, e.g.
 * CLOUD_ACCOUNT_DELETE), then removes the row and reports the outcome with a
 * toast.
 */
export function useInfrastructureRowDelete(config) {
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const requestDelete = useCallback((row) => setTarget(row), []);
  const cancelDelete = useCallback(() => setTarget(null), []);

  const confirmDelete = useCallback(async () => {
    if (!target) return;
    setDeleting(true);
    try {
      await apiClient.delete(`${ENDPOINTS.INFRASTRUCTURE}/${target.id}`);
      const { selectionModel } = infrastructureStore.getSnapshot();
      infrastructureStore.setSelectionModel(selectionModel.filter((id) => id !== target.id));
      await infrastructureStore.refetch();
      toastStore.pushToast(`${target.name} deleted.`);
      setTarget(null);
    } catch {
      toastStore.pushToast(`Couldn't delete ${target.name}. Try again.`, "error");
    } finally {
      setDeleting(false);
    }
  }, [target]);

  return {
    confirm: {
      open: Boolean(target),
      title: config.title,
      description: target ? config.describe(target) : "",
      confirmLabel: "Delete",
      confirming: deleting,
      onClose: deleting ? () => {} : cancelDelete,
      onConfirm: confirmDelete,
    },
    requestDelete,
  };
}
