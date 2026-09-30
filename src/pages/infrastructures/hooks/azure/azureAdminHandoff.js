import { apiClient } from "../../../../api/client";
import { ENDPOINTS } from "../../../../api/endpoints";
import { toastStore } from "../../../../api/toastStore";
import { infrastructureStore } from "../useInfrastructureData";
import { TENANT } from "./azureMockData";
import { PENDING_ADMIN_STATUS } from "../cloudServices";

/**
 * "Send setup to your Azure admin" leaves a trackable row in Cloud Accounts
 * (status "Pending admin setup") instead of a dead end — the requester can
 * see it, resend the link or cancel, and whoever finishes setup later for
 * the same tenant completes that row rather than creating a duplicate.
 */
export async function sendAdminSetupLink({ email, displayName, existingPendingRow }) {
  const trimmed = email.trim();
  if (existingPendingRow) {
    await apiClient.put(`${ENDPOINTS.INFRASTRUCTURE}/${existingPendingRow.id}`, { adminEmail: trimmed });
  } else {
    await apiClient.post(ENDPOINTS.INFRASTRUCTURE, {
      type: "cloud_account",
      name: displayName,
      cloudService: "Microsoft Azure",
      tenantId: TENANT.id,
      status: PENDING_ADMIN_STATUS,
      adminEmail: trimmed,
      lastRefresh: null,
      policyCount: null,
    });
  }
  await infrastructureStore.refetch();
  toastStore.pushToast(`Setup link sent to ${trimmed}.`);
}

export function resendAdminSetupLink(row) {
  toastStore.pushToast(`Setup link resent to ${row.adminEmail}.`);
}

export async function cancelAdminSetupRequest(row) {
  await apiClient.delete(`${ENDPOINTS.INFRASTRUCTURE}/${row.id}`);
  await infrastructureStore.refetch();
  toastStore.pushToast(`Setup request for ${row.name} was cancelled.`);
}
