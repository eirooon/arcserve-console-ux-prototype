export function getLatestJobForPlan(jobs, planId) {
  return jobs
    .filter((job) => job.plan_id === planId)
    .reduce(
      (latest, job) =>
        !latest || new Date(job.start_time_ts) > new Date(latest.start_time_ts) ? job : latest,
      null,
    );
}
