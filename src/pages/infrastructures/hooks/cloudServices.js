// Cloud services a Cloud Account can connect to. Single source for the
// "Add Cloud Account" menu, the add/edit form's select, and the "Cloud
// Service" filter, so the three can never drift apart. Rows store the label
// itself (e.g. "Microsoft Azure"), hence value === label.
export const CLOUD_SERVICES = [
  "Arcserve Cloud Storage",
  "AWS",
  "Google Cloud Platform",
  "Microsoft Azure",
  "Wasabi",
];

export const CLOUD_SERVICE_OPTIONS = CLOUD_SERVICES.map((service) => ({
  value: service,
  label: service,
}));

// A cloud account whose setup was handed to an Azure admin and isn't
// finished yet (see azureAdminHandoff.js).
export const PENDING_ADMIN_STATUS = "pending_admin";
