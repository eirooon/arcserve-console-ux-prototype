import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { toastStore } from "../../../api/toastStore";
import { infrastructureStore } from "./useInfrastructureData";
import { SITE_STATUS_DEPLOYING } from "./siteStatus";

/** The Sites row menu's "Redeploy": restarts a cloud site's deployment from 0%. */
export async function redeploySite(row) {
  try {
    await apiClient.put(`${ENDPOINTS.INFRASTRUCTURE}/${row.id}`, {
      ...row,
      status: SITE_STATUS_DEPLOYING,
      deployProgress: 0,
    });
    await infrastructureStore.refetch();
    toastStore.pushToast(`Redeploying ${row.name}.`);
  } catch {
    toastStore.pushToast(`Couldn't redeploy ${row.name}. Try again.`, "error");
  }
}
