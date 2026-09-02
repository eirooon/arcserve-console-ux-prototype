import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Stack, Link, SvgIcon } from "@mui/material";
import AnnouncementBanner from "../../components/AnnouncementBanner";
import SourceProtectionStatusWidget from "./components/widgets/SourceProtectionStatusWidget";
import RPOComplianceWidget from "./components/widgets/RPOComplianceWidget";
import AIAnomalyDetectionJobsSummaryWidget from "./components/widgets/AIAnomalyDetectionJobsSummaryWidget";
import JobHealthStatusWidget from "./components/widgets/JobHealthStatusWidget";
import PlanStatusWidget from "./components/widgets/PlanStatusWidget";
import RecentJobsWidget from "./components/widgets/RecentJobsWidget";
import RecoveryPointsEachMonthWidget from "./components/widgets/RecoveryPointsEachMonthWidget";
import BarChartWidget from "./components/widgets/BarChartWidget";
import StorageCapacityWatchWidget from "./components/widgets/StorageCapacityWatchWidget";
import { jobs } from "../../mocks/data/jobs";
import { formatRelativeTime } from "../../utils/time";

import AcrsIcon from "../../assets/acrs-encrypted.svg?react";
import AccrsIcon from "../../assets/accrs-encrypted.svg?react";
import AcsIcon from "../../assets/acs-encrypted.svg?react";
import LdsIcon from "../../assets/lds-encrypted.svg?react";

const ACCRS = (props) => {
  return <SvgIcon component={AccrsIcon} inheritViewBox {...props} />;
};
const ACRS = (props) => {
  return <SvgIcon component={AcrsIcon} inheritViewBox {...props} />;
};
const ACS = (props) => {
  return <SvgIcon component={AcsIcon} inheritViewBox {...props} />;
};
const LDS = (props) => {
  return <SvgIcon component={LdsIcon} inheritViewBox {...props} />;
};

// Mock widget data — static for this build, so it's hoisted to module scope
// rather than recreated (and handed to memoized widgets as new object/array
// references) on every DashboardLayout render.
const sourceProtectionData = {
  success: 30,
  failed: 10,
  cancelled: 23,
  noPlan: 4,
  missed: 10,
};
const rpoComplianceData = {
  compliant: 60,
  notCompliant: 47,
};
const anomalyStatusData = [
  {
    label: "Anomaly Detected",
    value: 8,
    color: "#b71c1c",
    bgColor: "#fff1f2",
  },
  { label: "Clean", value: 48, color: "#1b5e20", bgColor: "#f0fdf4" },
  { label: "Scan Failed", value: 2, color: "#e65100", bgColor: "#fff7ed" },
  { label: "In Progress", value: 20, color: "#0d47a1", bgColor: "#eff6ff" },
];

const storageData = [
  {
    key: "acrs",
    title: "Arcserve Cyber Resilient Storage (ACRS)",
    usedText: "500 GB",
    totalText: "1 TB",
    asOfText: "Feb-2-2025 8:37 PM",
    availableText: "949.79 GB Available",
    percent: 50,
    barColor: "#00C853",
    icon: <ACRS sx={{ color: "grey.700" }} />,
  },
  {
    key: "acs",
    title: "Arcserve Cloud Storage (ACS)",
    usedText: "900 GB",
    totalText: "1 TB",
    asOfText: "Feb-2-2025 8:37 PM",
    availableText: "100 GB Available",
    percent: 90,
    barColor: "#FFAB00",
    icon: <ACS sx={{ color: "grey.700" }} />,
  },
  {
    key: "accrs",
    title: "Arcserve Cloud Cyber Resilient Storage (ACCRS)",
    usedText: "17 TB",
    totalText: "17 TB",
    asOfText: "April 15, 2025, 7:00PM",
    excessText: "1.78 TB Excess Storage",
    percent: 100,
    barColor: "#D50000",
    icon: <ACCRS sx={{ color: "grey.700" }} />,
  },
];

const jobHealthData = {
  success: 30,
  failed: 10,
  missed: 10,
  warning: 23,
};
const planStatusData = {
  deployed: 76,
  deploying: 30,
  failed: 62,
  disabled: 20,
};

// Sourced from the same job history as the Jobs page and the Plans table's
// Latest Job column (src/mocks/data/jobs.js), so all three views agree.
const recentJobsData = [...jobs]
  .sort((a, b) => new Date(b.start_time_ts) - new Date(a.start_time_ts))
  .map((job) => ({
    id: job.id,
    jobName: job.job_name,
    jobType: job.job_type,
    time: formatRelativeTime(job.job_status === "in_progress" ? job.start_time_ts : job.end_time_ts),
    progressValue: job.job_status === "in_progress" ? (job.progress ?? 50) : 100,
  }));

const recoveryPointsEachMonthData = [
  {
    label: "Recovery Points",
    data: [3, 7, 6, 3, 12, 8, 15, 16, 18, 17, 11, 19],
    color: "#6A00FF",
  },
];

const oldestRecoveryPointsData = [
  {
    label: "Very Old",
    color: "#DC2626",
    data: [3, 7, 6, 3, 12, 8, 15, 16, 18, 17, 11, 19],
  },
];

const latestRecoveryPointsData = [
  {
    label: "Recent",
    color: "#2563EB",
    data: [3, 7, 6, 3, 12, 8, 15, 16, 18, 17, 11, 19],
  },
];

function handleAnomalyViewAll() {
  console.log("Navigating...");
}
function handleAnomalyLinkClick() {
  console.log("Navigating...");
}
function handleAnomalyTimeRangeChange(e) {
  console.log("Time range changed:", e.target.value);
}
function handleRecoveryPointsTimeRangeChange(e) {
  console.log("Time range changed:", e.target.value);
}

const rpoDescription = (
  <Stack direction="row" spacing={0.5}>
    <Typography variant="body2">
      Shows sources with a successful backup in the last
    </Typography>
    <Link href="#" variant="body2" color="secondary" fontWeight={600}>
      3 days
    </Link>
  </Stack>
);

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  const handleAnnouncementAction = useCallback(
    () => navigate("/dashboard/protection-intent-setup"),
    [navigate],
  );
  const handleAnnouncementClose = useCallback(
    () => setAnnouncementDismissed(true),
    [],
  );

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{
          // maxWidth: { l: "100%", xl: "90%" },
          m: { xl: "auto" },
          p: { xs: 2, md: 3 },
        }}
      >
        {!announcementDismissed && (
          <Grid size={12}>
            <AnnouncementBanner
              title="ArcGenie Agentic Management is now available!"
              description="Introduce autonomous backup automation to your environment with ArcGenie Agentic Management."
              actionLabel="Let’s Get Started"
              onAction={handleAnnouncementAction}
              onClose={handleAnnouncementClose}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <SourceProtectionStatusWidget
            title="Source Protection Status"
            description="Overview of the last backup status for all sources"
            data={sourceProtectionData}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <RPOComplianceWidget
            title="Recovery Point Objective (RPO) Compliance"
            description={rpoDescription}
            data={rpoComplianceData}
          />
        </Grid>
        <Grid size={12}>
          <AIAnomalyDetectionJobsSummaryWidget
            title="AI Anomaly Detection Jobs Summary"
            description="Summary of AI scan job outcomes"
            data={anomalyStatusData}
            onViewAll={handleAnomalyViewAll}
            onLinkClick={handleAnomalyLinkClick}
            onTimeRangeChange={handleAnomalyTimeRangeChange}
            linkText="View all AI anomaly detection jobs"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <JobHealthStatusWidget
            title="Job Health Status"
            description="Overview of job success rates in the last 24 hours"
            data={jobHealthData}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <PlanStatusWidget
            title="Plan Status"
            description="Overview of protection plan deployment states."
            data={planStatusData}
          />
        </Grid>
        <Grid size={12}>
          <StorageCapacityWatchWidget
            title="Storage Capacity Watch"
            description="Current used vs available storage across each storage destination/pool"
            data={storageData}
            udpValueText="761.42 GB"
            ldsIcon={<LDS sx={{ color: "grey.700" }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <RecentJobsWidget title="Recent Jobs" data={recentJobsData} />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <RecoveryPointsEachMonthWidget
            title="Recovery Points Each Month"
            data={recoveryPointsEachMonthData}
            onTimeRangeChange={handleRecoveryPointsTimeRangeChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <BarChartWidget
            title="Latest Recovery Points"
            data={latestRecoveryPointsData}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <BarChartWidget
            title="Oldest Recovery Points"
            data={oldestRecoveryPointsData}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
