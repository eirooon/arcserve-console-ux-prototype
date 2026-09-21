import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";

export const columns = [
  { field: "name", headerName: "Name", flex: 1.5 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "host", headerName: "Host", flex: 1.5 },
  { field: "status", headerName: "Status", flex: 1 },
  { field: "version", headerName: "Version", flex: 1 },
];

export const fields = [
  { field: "name", label: "Name", type: "text" },
  { field: "type", label: "Type", type: "text" },
  { field: "host", label: "Host", type: "text" },
  { field: "status", label: "Status", type: "text" },
  { field: "version", label: "Version", type: "text" },
];

export const infrastructureStore = createResourceStore(ENDPOINTS.INFRASTRUCTURE);

export function useInfrastructureData(selector) {
  return useResourceStore(infrastructureStore, selector);
}

// Types that make up the "Hypervisors" sub-nav category — every hypervisor
// platform this list supports.
const HYPERVISOR_TYPES = new Set(["vmware_vcenter", "hyper_v", "nutanix_ahv"]);

// Mirrors the left sub-navigation items in subRoutes.js (id -> predicate) so
// selecting "Hypervisors", "Sites", etc. filters the shared Infrastructures
// table down to just that category.
export function filterInfrastructureByCategory(rows, categoryId) {
  switch (categoryId) {
    case "hypervisors":
      return rows.filter((row) => HYPERVISOR_TYPES.has(row.type));
    case "sites":
      return rows.filter((row) => row.type === "site");
    case "storage-arrays":
      return rows.filter((row) => row.type === "storage_array");
    case "proxies":
      return rows.filter((row) => row.type === "backup_proxy");
    case "oracle-hosts":
      return rows.filter((row) => row.type === "oracle_host");
    case "cloud-accounts":
      return rows.filter((row) => row.type === "cloud_account");
    default:
      return rows;
  }
}
