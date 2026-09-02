import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";
import LatestJobCell from "../components/LatestJobCell";

export const columns = [
  { field: "plan_name", headerName: "Plan Name", flex: 1.5 },
  { field: "plan_type", headerName: "Type", flex: 1 },
  { field: "plan_status", headerName: "Status", flex: 1 },
  {
    field: "protected_sources",
    headerName: "Protected Sources",
    type: "number",
    flex: 1,
  },
  {
    field: "unprotected_sources",
    headerName: "Unprotected Sources",
    type: "number",
    flex: 1,
  },
  {
    field: "source_group",
    headerName: "Source Group",
    flex: 1,
    valueGetter: (value) => value || "-",
  },
  {
    field: "latest_job",
    headerName: "Latest Job",
    flex: 1.5,
    sortable: false,
    renderCell: (params) => <LatestJobCell job={params.value} />,
  },
  { field: "policy_type", headerName: "Plan Type", flex: 1.2 },
];

export const fields = [
  { field: "plan_name", label: "Plan Name", type: "text" },
  { field: "plan_type", label: "Type", type: "text" },
  { field: "plan_status", label: "Status", type: "text" },
  { field: "protected_sources", label: "Protected Sources", type: "number" },
  { field: "unprotected_sources", label: "Unprotected Sources", type: "number" },
  { field: "source_group", label: "Source Group", type: "text" },
  { field: "policy_type", label: "Plan Type", type: "text" },
];

export const plansStore = createResourceStore(ENDPOINTS.PLANS);

export function usePlansData(selector) {
  return useResourceStore(plansStore, selector);
}
