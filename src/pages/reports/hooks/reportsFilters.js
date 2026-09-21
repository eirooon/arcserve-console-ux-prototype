import { createEntityFilterStore } from "../../../utils/createEntityFilterStore";

// Schedule options are derived from whatever values actually exist in the
// currently-selected sub-nav category's rows (see ReportsToolbar/ReportsTable,
// which compute `categoryRows` via filterReportsByCategory before calling
// useEntityFilterState), rather than a hardcoded list, so the Filters modal
// never offers a choice that would silently match nothing.
function getScheduleOptions(rows) {
  return [...new Set(rows.map((row) => row.schedule).filter(Boolean))].map((value) => ({
    value,
    label: value,
  }));
}

// Field descriptors for the Reports "Filters" modal — see
// src/utils/entityFilters.js for the shape and matching engine, and
// src/components/EntityFiltersDialog.jsx for the modal that renders these.
// No "Type" filter here — the left sub-nav category (see
// filterReportsByCategory in useReportsData.jsx) already fully covers Type.
export const REPORTS_FILTER_FIELDS = [
  { key: "schedule", label: "Schedule", type: "select", field: "schedule", options: getScheduleOptions },
  { key: "lastGenerated", label: "Last Generated", type: "dateRange", field: "last_generated" },
];

// Free-text "Search reports" box matches against the column most likely to
// identify a report at a glance.
export const REPORTS_SEARCH_FIELDS = ["report_name"];

export const reportsFilterStore = createEntityFilterStore({
  fields: REPORTS_FILTER_FIELDS,
  searchFields: REPORTS_SEARCH_FIELDS,
});
