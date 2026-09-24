// Generic filtering engine shared by every list page's "Filters" modal +
// filter-chips bar (see useEntityFilterState, EntityFiltersDialog,
// EntityFilterBar). A page describes its filterable columns as a small array
// of field descriptors instead of hand-writing match/chip-label logic per
// entity — first extracted from the Jobs page, which was the reference
// implementation before this became shared.
//
// A field descriptor is one of:
//   { key, label, type: "select" | "multiselect", field, options: [{value,label}] | (rows) => [...] }
//   { key, label, type: "dateRange", field, timestampUnit?: "seconds" | "ms" }
// `key` is the property name inside the filters object; `field` is the row
// property matched against (for dateRange, a timestamp in `timestampUnit`,
// default "ms"). Every field except dateRange is multi-valued in the Filters
// modal — its value in the filters object is an array of option values, and a
// row matches when it satisfies ANY selected value (so "select" and
// "multiselect" behave identically; "select" is kept only so existing
// descriptors needn't change). A dateRange's value is a single preset string
// ("" when unset), since its presets are nested windows and picking several
// would just mean the widest one.

export const DATE_RANGE_FILTER_OPTIONS = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const DATE_RANGE_MS = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

export function getEmptyFilterValue(field) {
  return field.type === "dateRange" ? "" : [];
}

export function buildEmptyFilters(fields) {
  return Object.fromEntries(fields.map((field) => [field.key, getEmptyFilterValue(field)]));
}

// Options are either a static list or derived from the currently loaded rows
// (e.g. "only offer organizations that actually appear"), except dateRange,
// whose options are always the fixed presets above.
export function resolveFieldOptions(field, rows) {
  if (field.type === "dateRange") return DATE_RANGE_FILTER_OPTIONS;
  return typeof field.options === "function" ? field.options(rows) : (field.options ?? []);
}

export function hasActiveEntityFilters(filters, fields) {
  return fields.some((field) => filters[field.key]?.length > 0);
}

// Option values are always strings (that's all an HTML select can produce),
// but the row property being matched isn't necessarily one (e.g. a boolean
// `enabled` field) — comparing as strings on both sides keeps a field
// descriptor's `options` free to describe any row value type without every
// page having to stringify its own data first.
function matchesField(row, field, value) {
  if (!value?.length) return true;
  if (field.type === "dateRange") {
    const raw = row[field.field];
    if (raw == null) return false;
    const ms = field.timestampUnit === "seconds" ? raw * 1000 : new Date(raw).getTime();
    return ms >= Date.now() - DATE_RANGE_MS[value];
  }
  return value.includes(String(row[field.field]));
}

export function applyEntityFilters(rows, filters, fields) {
  if (!hasActiveEntityFilters(filters, fields)) return rows;
  return rows.filter((row) => fields.every((field) => matchesField(row, field, filters[field.key])));
}

// Free-text search applied on top of whichever structured filters/saved
// search are already active (see useEntityFilterState) — `searchFields` are
// the row properties checked for a case-insensitive substring match.
export function applySearchText(rows, searchText, searchFields) {
  const query = searchText.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter((row) =>
    searchFields.some((field) => String(row[field] ?? "").toLowerCase().includes(query)),
  );
}

// Builds the removable-chip descriptors for the toolbar's "Showing N results
// for:" row (see EntityFilterBar) from the currently applied filters.
export function getEntityFilterChips(filters, fields, rows) {
  const chips = [];
  fields.forEach((field) => {
    const value = filters[field.key];
    if (!value?.length) return;
    const options = resolveFieldOptions(field, rows);
    const display =
      field.type === "dateRange"
        ? (options.find((option) => option.value === value)?.label ?? value)
        : value.length === 1
          ? (options.find((option) => option.value === value[0])?.label ?? value[0])
          : `${value.length} selected`;
    chips.push({ key: field.key, label: `${field.label}: ${display}` });
  });
  return chips;
}
