import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { toastStore } from "../../../api/toastStore";

const ACTION_MESSAGES = {
  approve: (item) => `${item.source} approved and assigned to the ${item.proposedPlan} plan.`,
  assign: (item) => `${item.source} sent for manual policy assignment.`,
  review: (item) => `Opening ${item.source} for review.`,
};

export function useNeedsAttention() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get(ENDPOINTS.NEEDS_ATTENTION)
      .then((data) => {
        if (!cancelled) setItems(data ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const resolveItem = useCallback((item) => {
    setItems((current) => current.filter((existing) => existing.id !== item.id));
    return apiClient.delete(`${ENDPOINTS.NEEDS_ATTENTION}/${item.id}`);
  }, []);

  const handleAction = useCallback(
    (item, actionKey) => {
      const message = ACTION_MESSAGES[actionKey]?.(item);
      if (message) toastStore.pushToast(message);

      if (actionKey === "approve" || actionKey === "assign") {
        resolveItem(item);
        apiClient.post(ENDPOINTS.ARCGENIE_ACTIVITY_LOG, {
          message: `${item.source} was assigned to the ${item.proposedPlan} plan.`,
          approvedBy: "You",
          date: new Date().toLocaleString(undefined, {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
        });
      }
    },
    [resolveItem],
  );

  const handleDismiss = useCallback(
    (item) => {
      resolveItem(item);
      toastStore.pushToast(`${item.title} set aside for now.`);
    },
    [resolveItem],
  );

  return { items, loading, handleAction, handleDismiss };
}
