import { humanize } from "../../utils/text";
import { createEntityFilterStore } from "../../utils/createEntityFilterStore";

// Job Type/Organization/Protection Policy options are derived from whatever
// values actually exist in the loaded rows, rather than a hardcoded list, so
// the Filters modal never offers a choice that would silently match nothing.
function getJobTypeOptions(rows) {
  return [...new Set(rows.map((row) => row.job_type).filter(Boolean))].map((value) => ({
    value,
    label: humanize(value),
  }));
}

function getOrganizationOptions(rows) {
  return [...new Set(rows.map((row) => row.organization_name).filter(Boolean))].map((value) => ({
    value,
    label: value,
  }));
}

function getProtectionPolicyOptions(rows) {
  return [...new Set(rows.map((row) => row.policy_name).filter(Boolean))].map((value) => ({
    value,
    label: value,
  }));
}

// Field descriptors for the Jobs "Filters" modal — see
// src/utils/entityFilters.js for the shape and matching engine, and
// src/components/EntityFiltersDialog.jsx for the modal that renders these.
export const JOBS_FILTER_FIELDS = [
  {
    key: "status",
    label: "Status",
    type: "select",
    field: "job_status",
    // job_status values mirror LatestJobCell's JOB_STATUS_DISPLAY (see
    // ../plans/components/LatestJobCell.jsx) so a job's status reads
    // consistently wherever it appears in the app.
    options: [
      { value: "completed", label: "Completed" },
      { value: "in_progress", label: "In Progress" },
      { value: "failed", label: "Failed" },
      { value: "skipped", label: "Skipped" },
    ],
  },
  { key: "jobTypes", label: "Job Type", type: "multiselect", field: "job_type", options: getJobTypeOptions },
  { key: "dateRange", label: "Date Range", type: "dateRange", field: "start_time_ts", timestampUnit: "seconds" },
  {
    key: "organization",
    label: "Organization",
    type: "select",
    field: "organization_name",
    options: getOrganizationOptions,
  },
  {
    key: "protectionPolicy",
    label: "Protection Policy",
    type: "select",
    field: "policy_name",
    options: getProtectionPolicyOptions,
  },
];

// Free-text "Search jobs" box matches against the two columns most likely to
// identify a job at a glance.
export const JOBS_SEARCH_FIELDS = ["job_name", "source_name"];

export const jobsFilterStore = createEntityFilterStore({
  fields: JOBS_FILTER_FIELDS,
  searchFields: JOBS_SEARCH_FIELDS,
});
