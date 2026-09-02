import {
  AssignmentInd,
  Assignment,
  CorporateFare,
  EventNote,
  FmdGood,
  Gavel,
  LibraryBooks,
  Message,
  Monitor,
  NotificationAdd,
  PublishedWithChanges,
  SpaceDashboard,
  VerifiedUser,
  Settings,
  Help,
  BarChart,
} from "@mui/icons-material";

export const navSections = [
  {
    title: "ArcGenie",
    items: [
      { label: "Overview", to: "/arcgenie/overview", icon: SpaceDashboard },
      { label: "Protection Intent", to: "/arcgenie/protection-intent", icon: Gavel },
      { label: "Messaging", to: "/arcgenie/messaging", icon: Message },
    ],
  },
  {
    title: "Monitor",
    items: [
      // {
      //   label: "Resilience Center",
      //   to: "/resiliencecenter",
      //   icon: LocalPolice,
      // },
      { label: "Dashboard", to: "/dashboard", icon: BarChart },
    ],
  },
  {
    title: "Operate",
    items: [
      { label: "Jobs", to: "/jobs", icon: LibraryBooks },
      { label: "Logs", to: "/logs", icon: EventNote },
    ],
  },
  {
    title: "Manage Assets",
    items: [
      { label: "Sources", to: "/sources", icon: Monitor },
      { label: "Destinations", to: "/destinations", icon: FmdGood },
      {
        label: "Infrastructures",
        to: "/infrastructures",
        icon: CorporateFare,
      },
    ],
  },
  {
    title: "Configure Protection",
    items: [
      { label: "Plans", to: "/plans", icon: VerifiedUser },
      {
        label: "Disaster Recovery",
        to: "/disaster-recovery",
        icon: PublishedWithChanges,
      },
      {
        label: "Alert Rules",
        to: "/alert-rules",
        icon: NotificationAdd,
      },
    ],
  },
  {
    title: "Report & Audit",
    items: [
      { label: "Reports", to: "/reports", icon: Assignment },
      { label: "Audit Logs", to: "/audit-logs", icon: AssignmentInd },
    ],
  },
  {
    title: "Admin & Support",
    items: [
      { label: "Settings", to: "/settings", icon: Settings },
      { label: "Support", to: "/support", icon: Help },
    ],
  },
];

// Used by header for dynamic page titles
export const routeTitles = navSections
  .flatMap((s) => s.items)
  .reduce((acc, item) => {
    acc[item.to] = item.label;
    return acc;
  }, {});

export const routeMeta = navSections
  .flatMap((section) =>
    section.items.map((item) => ({
      path: item.to,
      label: item.label,
      section: section.title,
    })),
  )
  .reduce((acc, r) => {
    acc[r.path] = { label: r.label, section: r.section };
    return acc;
  }, {});

// Section titles are shown as breadcrumb labels via naive Title Case, which
// mangles brand names with internal capitals (e.g. "ArcGenie" -> "Arcgenie").
// Titles listed here are rendered exactly as written instead.
const SECTION_TITLE_OVERRIDES = new Set(["ArcGenie"]);

export function formatSectionTitle(title = "") {
  if (SECTION_TITLE_OVERRIDES.has(title)) return title;
  return title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
