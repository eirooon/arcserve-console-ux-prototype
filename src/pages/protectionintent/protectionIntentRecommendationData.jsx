import { sources } from "../../mocks/data/sources";

// Reflects the live count from the sources mock dataset, instead of a static figure.
const totalSourceCount = sources.length;

export const RECOMMENDATION_BANNER_COPY = {
  chipLabel: "ArcGenie Recommends",
  tryAnotherOptionLabel: "Try Another Option",
  headline: [
    { text: "Protect your " },
    { text: String(totalSourceCount), bold: true },
    { text: " sources across " },
    { text: "three categories", bold: true },
    {
      text: ", with 15-minute backups and immutable storage reserved for mission-critical systems.",
    },
  ],
};

export const RECOMMENDATION_HERO_STATS = [
  { value: "15 mins", label: "Tightest interval" },
  { value: "12 months", label: "Longest retention" },
  { value: "3 of 3", label: "Extensions on Mission-Critical" },
  { value: "2 copies", label: "Offsite, one air-gapped" },
];

export const PROTECTION_CATEGORY_COLUMNS = [
  {
    id: "mission-critical",
    label: "Mission-Critical",
    description: "Core systems whose downtime halts the business",
  },
  {
    id: "business-essential",
    label: "Business-Essential",
    description: "Important systems that support daily operations",
  },
  {
    id: "standard",
    label: "Standard",
    description: "General-purpose systems with lower business impact",
  },
];

export const GENERAL_SETTINGS_ROWS = [
  {
    label: "Backup Frequency",
    values: {
      "mission-critical": "Every 15 minutes",
      "business-essential": "Every 4 hours",
      standard: "Daily",
    },
  },
  {
    label: "Daily Retention",
    values: {
      "mission-critical": "30 days",
      "business-essential": "14 days",
      standard: "7 days",
    },
  },
  {
    label: "Weekly Retention",
    values: {
      "mission-critical": "8 weeks",
      "business-essential": "4 weeks",
      standard: "2 weeks",
    },
  },
  {
    label: "Monthly Retention",
    values: {
      "mission-critical": "12 months",
      "business-essential": "6 months",
      standard: "3 months",
    },
  },
  {
    label: "Offsite Copy",
    values: {
      "mission-critical": "Near-continuous replication + nightly cloud copy",
      "business-essential": "Nightly cloud copy",
      standard: "Weekly cloud copy",
    },
  },
  {
    label: "Recovery Priority",
    values: {
      "mission-critical": "Highest",
      "business-essential": "Medium",
      standard: "Low",
    },
  },
  {
    label: "Recovery Validation",
    values: {
      "mission-critical": "Weekly",
      "business-essential": "Monthly",
      standard: "Quarterly",
    },
  },
  {
    label: "Default Storage Tier",
    values: {
      "mission-critical": "High-performance",
      "business-essential": "Standard",
      standard: "Archive",
    },
  },
];

export const EXTENSION_ROWS = [
  {
    label: "Compliance",
    values: {
      "mission-critical": { enabled: true, detail: "30-day lock, 3-7+ years" },
      "business-essential": { enabled: false },
      standard: { enabled: false },
    },
  },
  {
    label: "Cyber Resilient",
    values: {
      "mission-critical": { enabled: true, detail: "Isolated recovery" },
      "business-essential": { enabled: true, detail: "anomaly detection" },
      standard: { enabled: false },
    },
  },
  {
    label: "DR Enabled",
    values: {
      "mission-critical": { enabled: true, detail: "15-min RPO" },
      "business-essential": { enabled: false },
      standard: { enabled: false },
    },
  },
];

export const DESTINATION_ROWS = [
  {
    label: "Backup Destination",
    values: {
      "mission-critical": "Recovery Point Server",
      "business-essential": "Recovery Point Server",
      standard: "Recovery Point Server",
    },
  },
  {
    label: "Recovery Point Server",
    values: {
      "mission-critical": "10.1.1.2.3",
      "business-essential": "10.1.1.2.4",
      standard: "10.1.1.2.5",
    },
  },
  {
    label: "Data Store",
    values: {
      "mission-critical": "Critical Datastore",
      "business-essential": "Business Datastore",
      standard: "Standard Datastore",
    },
  },
];

export function getInitialGeneralSettingsForCategory(categoryId) {
  return GENERAL_SETTINGS_ROWS.map((row) => ({
    label: row.label,
    value: row.values[categoryId],
  }));
}

export function getInitialDestinationSettingsForCategory(categoryId) {
  return DESTINATION_ROWS.map((row) => ({
    label: row.label,
    value: row.values[categoryId],
  }));
}

export function buildInitialExtensionState() {
  return PROTECTION_CATEGORY_COLUMNS.reduce((categoryAcc, category) => {
    categoryAcc[category.id] = EXTENSION_ROWS.reduce((extensionAcc, row) => {
      extensionAcc[row.label] = row.values[category.id].enabled;
      return extensionAcc;
    }, {});
    return categoryAcc;
  }, {});
}

// Reads live, user-edited values (falls back to the seeded static detail for
// extensions that have no editable sub-fields in the edit dialog).
export function getExtensionsForCategory(categoryId, extensionState, categoryFormData) {
  const data = categoryFormData[categoryId];
  return EXTENSION_ROWS.map((row) => ({
    label: row.label,
    detail:
      row.label === "Compliance"
        ? `${data.lockPeriod}, ${data.extendedRetention}`
        : row.values[categoryId].detail,
    enabled: extensionState[categoryId][row.label],
  }));
}

export function getExtensionCountLabel(categoryId, extensionState) {
  const enabledCount = Object.values(extensionState[categoryId]).filter(Boolean).length;
  if (enabledCount === 0) return "No extensions";
  return enabledCount === 1 ? "1 extension" : `${enabledCount} extensions`;
}

function abbreviateRetention(dailyValue, weeklyValue, monthlyValue) {
  const leadingNumber = (value) => value.match(/\d+/)?.[0] ?? "";
  return `${leadingNumber(dailyValue)}d ${leadingNumber(weeklyValue)}w ${leadingNumber(monthlyValue)}m`;
}

// Reads live, user-edited values so the accordion reflects saved edits.
export function getGeneralSettingsForCategory(categoryId, categoryFormData) {
  const data = categoryFormData[categoryId];
  return [
    { label: "Backup Frequency", value: data.backupFrequency },
    { label: "Daily Retention", value: data.dailyRetention },
    { label: "Weekly Retention", value: data.weeklyRetention },
    { label: "Monthly Retention", value: data.monthlyRetention },
    { label: "Offsite Copy", value: data.offsiteCopy },
    { label: "Recovery Priority", value: data.recoveryPriority },
    { label: "Recovery Validation", value: data.recoveryValidation },
    { label: "Default Storage Tier", value: data.storageTier },
  ];
}

// Reads live, user-edited values so the accordion reflects saved edits.
export function getDestinationSettingsForCategory(categoryId, categoryFormData) {
  const data = categoryFormData[categoryId];
  return [
    { label: "Backup Destination", value: data.backupDestination },
    { label: "Recovery Point Server", value: data.recoveryPointServer },
    { label: "Data Store", value: data.dataStore },
  ];
}

export function getQuickStatsForCategory(categoryId, categoryFormData) {
  const settings = getGeneralSettingsForCategory(categoryId, categoryFormData);
  const findValue = (label) => settings.find((row) => row.label === label)?.value ?? "";

  return [
    findValue("Backup Frequency").replace("minutes", "mins"),
    abbreviateRetention(
      findValue("Daily Retention"),
      findValue("Weekly Retention"),
      findValue("Monthly Retention"),
    ),
    findValue("Default Storage Tier"),
  ];
}
