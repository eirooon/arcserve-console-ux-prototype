import { useCallback, useMemo, useState } from "react";
import { apiClient } from "../../../../api/client";
import { ENDPOINTS } from "../../../../api/endpoints";
import { toastStore } from "../../../../api/toastStore";
import { CURRENT_USER } from "../../../../data/currentUser";
import { PENDING_ADMIN_STATUS } from "../cloudServices";
import { infrastructureStore, useInfrastructureData } from "../useInfrastructureData";
import {
  INITIAL_CLOUD_SITE_VALUES,
  applyFieldChange,
  buildCloudSiteRow,
  estimateMonthlyCost,
  firstInvalidField,
  generateGatewayAuthCode,
  validateCloudSite,
} from "./cloudSiteForm";

export const CLOUD_SITE_STEPS = [
  { id: "properties", label: "Site Properties" },
  { id: "summary", label: "Summary" },
];

// The mock API answers instantly; keep the "configuring" spinner on screen
// long enough to actually be seen.
const MIN_CONFIGURE_MS = 600;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const selectRows = (state) => ({ rows: state.rows });

/**
 * State and actions for the "Add Cloud Site" wizard: field values, which
 * errors to show (a field's error appears once it's been left, or for every
 * field after Next is pressed), and `configure` — Next on Site Properties,
 * which creates the site (it starts deploying) and moves to Summary
 * with the gateway authorization code.
 */
export function useAddCloudSite() {
  const { rows } = useInfrastructureData(selectRows);
  const [values, setValues] = useState(INITIAL_CLOUD_SITE_VALUES);
  const [touched, setTouched] = useState({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [configuring, setConfiguring] = useState(false);
  const [authCode, setAuthCode] = useState(null);

  // Only connected accounts can host a site — not ones still waiting on an
  // admin to finish setup.
  const cloudAccountOptions = useMemo(
    () =>
      rows
        .filter((row) => row.type === "cloud_account" && row.status !== PENDING_ADMIN_STATUS)
        .map((row) => ({ value: row.name, label: row.name })),
    [rows],
  );

  const errors = useMemo(() => validateCloudSite(values), [values]);
  const visibleErrors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(errors).filter(([field]) => showAllErrors || touched[field]),
      ),
    [errors, showAllErrors, touched],
  );

  const estimatedCost = useMemo(
    () => estimateMonthlyCost(values),
    [values],
  );

  const setField = useCallback((field, value) => {
    setValues((current) => applyFieldChange(current, field, value));
  }, []);

  const touchField = useCallback((field) => {
    setTouched((current) => (current[field] ? current : { ...current, [field]: true }));
  }, []);

  /**
   * Creates the site and moves to Summary. Resolves to the first
   * invalid field (for the caller to focus) when the form isn't ready, else
   * null.
   */
  const configure = useCallback(async () => {
    const invalid = firstInvalidField(errors);
    if (invalid) {
      setShowAllErrors(true);
      return invalid;
    }
    const row = buildCloudSiteRow(values, { registeredEmail: CURRENT_USER.email });
    setConfiguring(true);
    try {
      await Promise.all([apiClient.post(ENDPOINTS.INFRASTRUCTURE, row), wait(MIN_CONFIGURE_MS)]);
      await infrastructureStore.refetch();
      setAuthCode(generateGatewayAuthCode());
      setStepIndex(1);
    } catch {
      toastStore.pushToast(`Couldn't configure ${row.name}. Try again.`, "error");
    } finally {
      setConfiguring(false);
    }
    return null;
  }, [errors, values]);

  return {
    steps: CLOUD_SITE_STEPS,
    stepIndex,
    values,
    errors: visibleErrors,
    estimatedCost,
    cloudAccountOptions,
    configuring,
    authCode,
    setField,
    touchField,
    configure,
  };
}
