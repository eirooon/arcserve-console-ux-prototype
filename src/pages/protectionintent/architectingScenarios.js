import { sources } from "../../mocks/data/sources";

// Reflects the live count from the sources mock dataset, instead of a static figure.
const totalSourceCount = sources.length;

export const ARCHITECTING_SCENARIOS = {
  "arcgenie-suggest": {
    durationMs: 25000,
    heading: "Analysing your environment",
    subheading: "No policy given, so ArcGenie is inferring one from workload signals.",
    steps: [
      {
        id: "inventory",
        label: "Read source inventory and tags",
        target: totalSourceCount,
        unit: "sources",
      },
      { id: "workload-types", label: "Detected workload types and change rates", target: 6, unit: "types" },
      { id: "criticality", label: "Inferring criticality per source", target: totalSourceCount, showFraction: true },
      { id: "schedules", label: "Deriving schedules and retention" },
      { id: "destinations", label: "Selecting storage destinations" },
    ],
    evidenceTicker: [
      "SQL-PROD-04 · high change rate → Mission-Critical",
      "WEB-APP-12 · low change rate → Standard",
      "FILE-SHARE-07 · medium change rate → Business-Essential",
      "BACKUP-DB-19 · high change rate → Mission-Critical",
    ],
  },
  "category-based": {
    durationMs: 12000,
    heading: "Applying standard categories",
    subheading: "Mapping every source onto Mission-Critical, Business-Essential or Standard.",
    categoryTargets: {
      "mission-critical": { label: "Mission-Critical", target: 12 },
      "business-essential": { label: "Business-Essential", target: 38 },
      standard: { label: "Standard", target: 104 },
    },
    steps: [
      {
        id: "definitions",
        label: "Loaded Mission-Critical / Business-Essential / Standard SLA definitions",
        target: 3,
        unit: "categories",
      },
      { id: "assigning", label: "Assigning sources by tag and workload type", target: 154, showFraction: true },
      { id: "capacity", label: "Checking capacity at each destination" },
    ],
    footerNote: "36 sources have no category tag — they will default to Standard.",
  },
  "custom-prompt": {
    durationMs: 30000,
    heading: "Interpreting your policy",
    subheading: "Turning your description into schedules, retention and extensions.",
    steps: [
      { id: "prod-db", label: "Production databases → 15-minute frequency, 12 monthly copies", target: 12, unit: "sources" },
      { id: "hipaa", label: "HIPAA scope → Compliance extension, immutable storage", target: 41, unit: "sources" },
      { id: "baseline", label: "“Everything else” → daily baseline tier", target: 104, showFraction: true },
    ],
    footerNote: "You'll be able to correct anything ArcGenie misread on the next screen.",
  },
};
