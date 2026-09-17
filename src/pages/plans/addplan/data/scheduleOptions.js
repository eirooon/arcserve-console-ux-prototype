// Options for the "When to Protect" schedule builder (see Figma node
// 6478:6498) and the destination type select on "Where to Protect" (Figma
// node 6478:6168).
export const SCHEDULE_TYPES = ["Daily", "Weekly", "Monthly"];

export const BACKUP_TYPES = ["Full", "Incremental", "Differential"];

export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const START_HOURS = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, "0"));

export const START_MINUTES = ["00", "15", "30", "45"];

// Mirrors the Destinations page's four categories (see subRoutes.js) so the
// "Backup Destination Type" select uses the same vocabulary as the rest of
// the console, and each value maps to a `type` on the shared destinations
// resource (see mocks/data/destinations.js) used to filter the
// Recovery Point Server / Data Store selects below it.
export const DESTINATION_TYPES = [
  { value: "recovery_point_server", label: "Recovery Point Server" },
  { value: "data_store", label: "Data Store" },
  { value: "cloud_volume", label: "Cloud Volume" },
  { value: "shared_folder", label: "Shared Folder" },
];

export function createScheduleRow() {
  return {
    id: crypto.randomUUID(),
    scheduleType: SCHEDULE_TYPES[0],
    backupType: BACKUP_TYPES[1],
    days: [...WEEK_DAYS],
    startHour: "00",
    startMinute: "00",
  };
}

// The "Merge Schedule" section (Figma node 7567:9589) is the same
// days/start-time shape as a backup schedule row, just without the
// Schedule Type / Backup Type selects — merging always applies to whatever
// recovery points already exist.
export function createMergeScheduleRow() {
  return {
    id: crypto.randomUUID(),
    days: [...WEEK_DAYS],
    startHour: "00",
    startMinute: "00",
  };
}
