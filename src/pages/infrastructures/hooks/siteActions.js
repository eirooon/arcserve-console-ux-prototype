import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { toastStore } from "../../../api/toastStore";
import { infrastructureStore } from "./useInfrastructureData";
import { SITE_STATUS_DEPLOYING } from "./siteStatus";

// Simulated deploy pacing: a few-second run with uneven steps so it reads as
// real work rather than a smooth timer.
const DEPLOY_TICK_MS = 700;
const MIN_STEP = 4;
const MAX_STEP = 14;

// Site id -> interval id. Module-level (outside React) so a deploy keeps
// running when the user leaves the Sites page, and a second Redeploy on the
// same site restarts its run instead of racing it.
const activeDeploys = new Map();

function stopDeploy(siteId) {
  clearInterval(activeDeploys.get(siteId));
  activeDeploys.delete(siteId);
}

/**
 * Persists a deploy state to the mock API (so a later refetch doesn't reset
 * the bar) and mirrors it into the cached row without a refetch.
 */
async function setDeployState(siteId, patch) {
  await apiClient.put(`${ENDPOINTS.INFRASTRUCTURE}/${siteId}`, patch);
  infrastructureStore.patchRow(siteId, patch);
}

function simulateDeploy(row) {
  stopDeploy(row.id);
  let progress = 0;
  let inFlight = false;

  const intervalId = setInterval(async () => {
    // Skip a tick rather than queue PUTs if the previous one hasn't landed.
    if (inFlight) return;
    inFlight = true;
    progress = Math.min(100, progress + MIN_STEP + Math.round(Math.random() * (MAX_STEP - MIN_STEP)));
    const done = progress === 100;
    if (done) stopDeploy(row.id);

    try {
      await setDeployState(
        row.id,
        done ? { status: "online", deployProgress: 100 } : { deployProgress: progress },
      );
      if (done) toastStore.pushToast(`${row.name} deployed successfully.`);
    } catch {
      stopDeploy(row.id);
      toastStore.pushToast(`Couldn't finish deploying ${row.name}.`, "error");
    } finally {
      inFlight = false;
    }
  }, DEPLOY_TICK_MS);

  activeDeploys.set(row.id, intervalId);
}

/** The Sites row menu's "Redeploy": restarts a cloud site's deployment from 0%. */
export async function redeploySite(row) {
  try {
    await setDeployState(row.id, { status: SITE_STATUS_DEPLOYING, deployProgress: 0 });
    toastStore.pushToast(`Redeploying ${row.name}.`);
    simulateDeploy(row);
  } catch {
    toastStore.pushToast(`Couldn't redeploy ${row.name}. Try again.`, "error");
  }
}
