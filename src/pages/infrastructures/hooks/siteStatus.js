import CancelIcon from "@mui/icons-material/Cancel";
import SignalWifiStatusbar4BarIcon from "@mui/icons-material/SignalWifiStatusbar4Bar";

// Single source for Sites' type/status values, shared by the table columns,
// the status cell, the add/edit form and the Filters modal.

export const SITE_TYPE_CLOUD = "cloud_site";
export const SITE_TYPE_ON_PREM = "site";

export const SITE_TYPE_OPTIONS = [
  { value: SITE_TYPE_ON_PREM, label: "Site" },
  { value: SITE_TYPE_CLOUD, label: "Cloud Site" },
];

export const SITE_STATUS_DEPLOYING = "deploying";

// Icon + label for every non-deploying status (deploying renders a progress
// bar instead — see SiteStatusCell).
export const SITE_STATUS_META = {
  online: { icon: SignalWifiStatusbar4BarIcon, label: "Online", color: "success.main" },
  failed: { icon: CancelIcon, label: "Failed", color: "error.main" },
};

export const SITE_STATUS_OPTIONS = [
  { value: SITE_STATUS_DEPLOYING, label: "Deploying" },
  ...Object.entries(SITE_STATUS_META).map(([value, { label }]) => ({ value, label })),
];

/** Only cloud sites can be redeployed — an on-prem site's gateway is installed by hand. */
export function canRedeploySite(row) {
  return row.siteType === SITE_TYPE_CLOUD;
}
