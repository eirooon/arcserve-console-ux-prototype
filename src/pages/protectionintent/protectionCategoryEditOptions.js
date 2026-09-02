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

export const EXTENDED_RETENTION_OPTIONS = ["1-3 years", "3-7+ years"];

export const LEGAL_HOLD_OPTIONS = ["Optional", "Required", "Not applicable"];

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
  { field: "extendedRetention", label: "Extended Retention", options: EXTENDED_RETENTION_OPTIONS },
];

export const COMPLIANCE_LEGAL_HOLD_FIELD = {
  field: "legalHold",
  label: "Legal Hold Support",
  options: LEGAL_HOLD_OPTIONS,
};

export const COMPLIANCE_CHECKBOX_FIELDS = [
  { field: "immutability", label: "Immutability" },
  { field: "auditLogging", label: "Audit Logging" },
  { field: "chainOfCustody", label: "Chain-of-Custody Tracking" },
];

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
    extendedRetention: EXTENDED_RETENTION_OPTIONS[1],
    legalHold: LEGAL_HOLD_OPTIONS[0],
    immutability: false,
    auditLogging: false,
    chainOfCustody: false,
    backupDestination: findDestination("Backup Destination"),
    recoveryPointServer: findDestination("Recovery Point Server"),
    dataStore: findDestination("Data Store"),
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
