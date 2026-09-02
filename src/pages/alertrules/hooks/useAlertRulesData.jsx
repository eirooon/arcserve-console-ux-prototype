import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";

export const columns = [
  { field: "rule_name", headerName: "Rule Name", flex: 1.5 },
  { field: "condition", headerName: "Condition", flex: 1.5 },
  { field: "severity", headerName: "Severity", flex: 1 },
  { field: "notify_via", headerName: "Notify Via", flex: 1 },
  { field: "enabled", headerName: "Enabled", type: "boolean", flex: 0.6 },
];

export const fields = [
  { field: "rule_name", label: "Rule Name", type: "text" },
  { field: "condition", label: "Condition", type: "text" },
  { field: "severity", label: "Severity", type: "text" },
  { field: "notify_via", label: "Notify Via", type: "text" },
  { field: "enabled", label: "Enabled", type: "boolean" },
];

export const alertRulesStore = createResourceStore(ENDPOINTS.ALERT_RULES);

export function useAlertRulesData(selector) {
  return useResourceStore(alertRulesStore, selector);
}
