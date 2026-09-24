import {
  PROTECTION_CATEGORY_COLUMNS,
  getInitialDestinationSettingsForCategory,
  getInitialGeneralSettingsForCategory,
} from "./protectionIntentRecommendationData";

export const BACKUP_FREQUENCY_OPTIONS = [
  "Every 15 minutes",
  "Every 1 hour",
  "Every 4 hours",
  "Daily",
];

export const DAILY_RETENTION_OPTIONS = ["7 days", "14 days", "30 days"];

export const WEEKLY_RETENTION_OPTIONS = ["2 weeks", "4 weeks", "8 weeks"];

export const MONTHLY_RETENTION_OPTIONS = ["3 months", "6 months", "12 months"];

export const OFFSITE_COPY_OPTIONS = [
  "Weekly cloud copy",
  "Nightly cloud copy",
  "Near-continuous replication + nightly cloud copy",
];

export const RECOVERY_PRIORITY_OPTIONS = ["Highest", "Medium", "Low"];

export const RECOVERY_VALIDATION_OPTIONS = ["Weekly", "Monthly", "Quarterly"];

export const STORAGE_TIER_OPTIONS = ["High-performance", "Standard", "Archive"];

export const LOCK_PERIOD_OPTIONS = ["7 days minimum", "30 days minimum"];

export const BACKUP_DESTINATION_OPTIONS = [
  "Recovery Point Server",
  "Cloud Object Storage",
];

export const RECOVERY_POINT_SERVER_OPTIONS = [
  "10.1.1.2.3",
  "10.1.1.2.4",
  "10.1.1.2.5",
];

export const DATA_STORE_OPTIONS = [
  "Critical Datastore",
  "Business Datastore",
  "Standard Datastore",
];

export const GENERAL_SETTINGS_FIELDS = [
  { field: "backupFrequency", label: "Backup Frequency", options: BACKUP_FREQUENCY_OPTIONS },
  { field: "dailyRetention", label: "Daily Retention", options: DAILY_RETENTION_OPTIONS },
  { field: "weeklyRetention", label: "Weekly Retention", options: WEEKLY_RETENTION_OPTIONS },
  { field: "monthlyRetention", label: "Monthly Retention", options: MONTHLY_RETENTION_OPTIONS },
  { field: "offsiteCopy", label: "Offsite Copy", options: OFFSITE_COPY_OPTIONS },
  { field: "recoveryPriority", label: "Recovery Priority", options: RECOVERY_PRIORITY_OPTIONS },
  { field: "recoveryValidation", label: "Recovery Validation", options: RECOVERY_VALIDATION_OPTIONS },
  { field: "storageTier", label: "Default Storage Tier", options: STORAGE_TIER_OPTIONS },
];

export const DESTINATION_SETTINGS_FIELDS = {
  backupDestination: { field: "backupDestination", label: "Backup Destination", options: BACKUP_DESTINATION_OPTIONS },
  recoveryPointServer: { field: "recoveryPointServer", label: "Recovery Point Server", options: RECOVERY_POINT_SERVER_OPTIONS },
  dataStore: { field: "dataStore", label: "Data Store", options: DATA_STORE_OPTIONS },
};

export const COMPLIANCE_SELECT_FIELDS = [
  { field: "lockPeriod", label: "Lock Period", options: LOCK_PERIOD_OPTIONS },
];

// Capabilities that show up under more than one extension in the ArcGenie
// protection-category spec (see the "Cyber Resilient"/"Compliance" overlap
// in the source design doc) share the same field here instead of each
// extension tracking its own copy, so checking one from either panel is
// reflected in the other.
export const IMMUTABLE_SNAPSHOTS_FIELD = { field: "immutability", label: "Immutable Snapshots" };
export const OFFSITE_REPLICATION_FIELD = {
  field: "offsiteReplication",
  label: "Offsite Replication (3-2-1-1-0)",
};

export const COMPLIANCE_CHECKBOX_FIELDS = [
  IMMUTABLE_SNAPSHOTS_FIELD,
  OFFSITE_REPLICATION_FIELD,
  { field: "auditLogging", label: "Audit Logging" },
];

// Generic capability labels rather than internal product feature names
// (e.g. "Anomaly Scanning" instead of "Assured Security Tests - Anomaly
// Scanning") per the design review's note to keep this screen product-agnostic.
export const CYBER_RESILIENT_CHECKBOX_FIELDS = [
  IMMUTABLE_SNAPSHOTS_FIELD,
  OFFSITE_REPLICATION_FIELD,
  { field: "anomalyScanning", label: "Anomaly Scanning" },
  { field: "malwareScanning", label: "Malware Scanning" },
];

export const DR_ENABLED_CHECKBOX_FIELDS = [
  { field: "failoverTesting", label: "Failover Testing" },
  { field: "recoveryVerificationAgent", label: "Recovery Verification (Agent-Based & Agentless)" },
  { field: "recoveryVerificationShares", label: "Recovery Verification (Network Shares)" },
  { field: "drRunbooks", label: "DR Runbooks (Cloud Workloads)" },
];

// Every extension's checkbox fields default to unchecked — same reasoning as
// the pre-existing Compliance fields below, kept in one place so adding a
// checkbox to any extension can't drift out of sync with its default value.
function buildCheckboxDefaults(...fieldGroups) {
  return Object.fromEntries(fieldGroups.flat().map((fieldSpec) => [fieldSpec.field, false]));
}

export function buildCategoryEditFormDefaults(category, generalSettings, destinationSettings) {
  const findGeneral = (label) => generalSettings.find((row) => row.label === label)?.value ?? "";
  const findDestination = (label) => destinationSettings.find((row) => row.label === label)?.value ?? "";

  return {
    categoryName: category.label,
    backupFrequency: findGeneral("Backup Frequency"),
    dailyRetention: findGeneral("Daily Retention"),
    weeklyRetention: findGeneral("Weekly Retention"),
    monthlyRetention: findGeneral("Monthly Retention"),
    offsiteCopy: findGeneral("Offsite Copy"),
    recoveryPriority: findGeneral("Recovery Priority"),
    recoveryValidation: findGeneral("Recovery Validation"),
    storageTier: findGeneral("Default Storage Tier"),
    lockPeriod: LOCK_PERIOD_OPTIONS[1],
    ...buildCheckboxDefaults(
      COMPLIANCE_CHECKBOX_FIELDS,
      CYBER_RESILIENT_CHECKBOX_FIELDS,
      DR_ENABLED_CHECKBOX_FIELDS,
    ),
    backupDestination: findDestination("Backup Destination"),
    recoveryPointServer: findDestination("Recovery Point Server"),
    dataStore: findDestination("Data Store"),
  };
}

// Seed values for a brand-new custom category, before the user has tuned
// anything — deliberately the lightest tier (mirrors "Standard") since a
// custom category's actual criticality is unknown until configured.
export function buildDefaultCategoryFormValues(categoryName) {
  return {
    categoryName,
    backupFrequency: BACKUP_FREQUENCY_OPTIONS[3],
    dailyRetention: DAILY_RETENTION_OPTIONS[0],
    weeklyRetention: WEEKLY_RETENTION_OPTIONS[0],
    monthlyRetention: MONTHLY_RETENTION_OPTIONS[0],
    offsiteCopy: OFFSITE_COPY_OPTIONS[0],
    recoveryPriority: RECOVERY_PRIORITY_OPTIONS[2],
    recoveryValidation: RECOVERY_VALIDATION_OPTIONS[2],
    storageTier: STORAGE_TIER_OPTIONS[2],
    lockPeriod: LOCK_PERIOD_OPTIONS[0],
    ...buildCheckboxDefaults(
      COMPLIANCE_CHECKBOX_FIELDS,
      CYBER_RESILIENT_CHECKBOX_FIELDS,
      DR_ENABLED_CHECKBOX_FIELDS,
    ),
    backupDestination: BACKUP_DESTINATION_OPTIONS[0],
    recoveryPointServer: RECOVERY_POINT_SERVER_OPTIONS[0],
    dataStore: DATA_STORE_OPTIONS[0],
  };
}

export function buildInitialCategoryFormData() {
  return PROTECTION_CATEGORY_COLUMNS.reduce((acc, category) => {
    acc[category.id] = buildCategoryEditFormDefaults(
      category,
      getInitialGeneralSettingsForCategory(category.id),
      getInitialDestinationSettingsForCategory(category.id),
    );
    return acc;
  }, {});
}
