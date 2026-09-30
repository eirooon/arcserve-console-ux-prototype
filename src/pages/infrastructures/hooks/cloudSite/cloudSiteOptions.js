// Mock choices for the "Add Cloud Site" form (Figma "UXD-17 Skyline", node
// 7321:8644). Nothing here talks to a cloud provider; it only gives the
// prototype believable, internally consistent values. Regions and resource
// groups reuse the Azure wizard's mock tenant so the two flows agree.
import { EXISTING_RESOURCE_GROUPS, REGIONS } from "../azure/azureMockData";

const toOptions = (values) => values.map((value) => ({ value, label: value }));

const vmCountFormatter = new Intl.NumberFormat("en-US");

// Deployment sizes from the "Deployment Size & Storage Size Dropdown
// Behavior" design (Figma node 7320:7547). `storageGb` is the size's default
// storage, filled into Storage Size when the size is picked. `monthlyCost` is
// a mock estimate of the VM's own USD/month, before storage — tuned so Small
// with its 340 GB default comes to the design's ~USD 9.60/month.
const SIZES = [
  { value: "tiny", name: "Tiny", vcpus: 2, memoryGb: 10, storageGb: 300, maxVms: 100, monthlyCost: 3.1 },
  { value: "small", name: "Small", vcpus: 4, memoryGb: 16, storageGb: 340, maxVms: 1000, monthlyCost: 6.2 },
  { value: "medium", name: "Medium", vcpus: 8, memoryGb: 24, storageGb: 525, maxVms: 4000, monthlyCost: 12.4 },
  { value: "large", name: "Large", vcpus: 16, memoryGb: 32, storageGb: 740, maxVms: 10000, monthlyCost: 24.8 },
  { value: "xlarge", name: "X-Large", vcpus: 24, memoryGb: 48, storageGb: 1180, maxVms: 35000, monthlyCost: 37.2 },
];

export const DEPLOYMENT_SIZES = SIZES.map((size) => ({
  ...size,
  maxVmsLabel: `Up to ${vmCountFormatter.format(size.maxVms)}`,
  // What the closed select shows, e.g. "Small (4 vCPUs, 16 GB Memory, Up to 1,000 VMs)".
  label: `${size.name} (${size.vcpus} vCPUs, ${size.memoryGb} GB Memory, Up to ${vmCountFormatter.format(size.maxVms)} VMs)`,
}));

export function getDeploymentSize(value) {
  return DEPLOYMENT_SIZES.find((size) => size.value === value) ?? null;
}

// Estimated USD per GB per month for the site's managed disk.
export const STORAGE_COST_PER_GB = 0.01;

// Largest managed disk a cloud provider typically allows (32 TiB).
export const MAX_STORAGE_GB = 32767;

export const REGION_OPTIONS = toOptions(REGIONS);

export const RESOURCE_GROUP_OPTIONS = toOptions(EXISTING_RESOURCE_GROUPS);

// Subnets belong to a network, so the Subnet select lists only the chosen
// network's subnets.
export const SUBNETS_BY_NETWORK = {
  "contoso-prod-vnet": ["default", "backup-subnet", "app-subnet"],
  "contoso-dev-vnet": ["default", "dev-subnet"],
};

export const NETWORK_OPTIONS = toOptions(Object.keys(SUBNETS_BY_NETWORK));

export const SECURITY_GROUP_OPTIONS = toOptions(["arcserve-site-nsg", "contoso-default-nsg"]);

/** Subnet options for `network`, or none until a network is chosen. */
export function getSubnetOptions(network) {
  return toOptions(SUBNETS_BY_NETWORK[network] ?? []);
}
