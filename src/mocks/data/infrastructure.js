// Field names loosely mirror the legacy app's hypervisorListData /
// proxies / storage-arrays datasets (arcservedev-cloudconsole_frontend/
// src/mockResponses/mockData.js), collapsed into one generic infrastructure
// list since this app's Infrastructures page is a single grid.
export const infrastructure = [
  {
    id: "hv-001",
    name: "vcenter-hq-01",
    type: "vmware_vcenter",
    host: "vcenter-hq-01.corp.local",
    status: "online",
    version: "8.0.2",
  },
  {
    id: "hv-002",
    name: "hyperv-east-01",
    type: "hyper_v",
    host: "hyperv-east-01.corp.local",
    status: "online",
    version: "2022",
  },
  {
    id: "proxy-001",
    name: "backup-proxy-01",
    type: "backup_proxy",
    host: "10.20.1.15",
    status: "online",
    version: "9.1.0",
  },
  {
    id: "sa-001",
    name: "storage-array-west",
    type: "storage_array",
    host: "10.20.4.30",
    status: "degraded",
    version: "5.4.1",
  },
  {
    id: "hv-003",
    name: "nutanix-cluster-01",
    type: "nutanix_ahv",
    host: "nutanix-01.corp.local",
    status: "offline",
    version: "6.8",
  },
];
