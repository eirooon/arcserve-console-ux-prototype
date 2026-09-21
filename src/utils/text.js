// Title-cases a snake_case API enum value for display, e.g.
// "backup_incremental" -> "Backup Incremental". Shared by any column that
// needs to turn a raw enum into a human-readable label (Sources' Type
// column, Jobs' Job Type column, etc.) instead of each page re-implementing
// its own copy.
export function humanize(value) {
  if (!value) return null;
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
