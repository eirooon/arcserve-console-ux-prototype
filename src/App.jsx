import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import AppShell from "./layout/AppShell";

const Dashboard = lazy(() => import("./pages/dashboard/DashboardLayout"));
const ProtectionIntentSetup = lazy(() =>
  import("./pages/protectionintent/ProtectionIntentSetup"),
);
const ArcGenieOverviewPage = lazy(() =>
  import("./pages/protectionintent/ArcGenieOverviewPage"),
);
const ArcGenieProtectionIntentPage = lazy(() =>
  import("./pages/protectionintent/ArcGenieProtectionIntentPage"),
);
const ArcGenieMessagingPage = lazy(() =>
  import("./pages/protectionintent/ArcGenieMessagingPage"),
);
const ArcGenieGoalDetailPage = lazy(() =>
  import("./pages/protectionintent/ArcGenieGoalDetailPage"),
);
const ArcGenieNeedsAttentionPage = lazy(() =>
  import("./pages/protectionintent/ArcGenieNeedsAttentionPage"),
);
const JobsLayout = lazy(() => import("./pages/jobs/JobsLayout"));
const Logs = lazy(() => import("./pages/logs/Logs"));
const AlertRulesLayout = lazy(() => import("./pages/alertrules/AlertRulesLayout"));
const AuditLogsLayout = lazy(() => import("./pages/auditlogs/AuditLogsLayout"));
const Help = lazy(() => import("./pages/help/Help"));

// Sources
const SourcesLayout = lazy(() => import("./pages/sources/SourcesLayout"));
const AllSources = lazy(() => import("./pages/sources/AllSources"));
const SourcesMachines = lazy(() => import("./pages/sources/Machines"));
const MachinesWithoutPlan = lazy(() => import("./pages/sources/MachinesWithoutPlan"));
const AgentlessVMs = lazy(() => import("./pages/sources/AgentlessVMs"));
const UNCNFSPaths = lazy(() => import("./pages/sources/UNCNFSPaths"));

// Destinations
const DestinationsLayout = lazy(() => import("./pages/destinations/DestinationsLayout"));
const RecoveryPointServers = lazy(() => import("./pages/destinations/RecoveryPointServers"));
const DataStore = lazy(() => import("./pages/destinations/DataStores"));
const ACRSAccount = lazy(() => import("./pages/destinations/ACRSAccount"));
const SharedFolders = lazy(() => import("./pages/destinations/SharedFolders"));

// Infrastructures
const InfrastructuresLayout = lazy(() => import("./pages/infrastructures/InfrastructuresLayout"));
const Hypervisors = lazy(() => import("./pages/infrastructures/Hypervisors"));
const Sites = lazy(() => import("./pages/infrastructures/Sites"));
const StorageArrays = lazy(() => import("./pages/infrastructures/StorageArrays"));
const Proxies = lazy(() => import("./pages/infrastructures/Proxies"));
const OracleHosts = lazy(() => import("./pages/infrastructures/OracleHosts"));
const CloudProtectionOrchestrator = lazy(() => import("./pages/infrastructures/CloudProtectionOrchestrator"));
const CloudAccounts = lazy(() => import("./pages/infrastructures/CloudAccounts"));

//Plans
const PlansLayout = lazy(() => import("./pages/plans/PlansLayout"));

// Disaster Recovery
const DisasterRecoveryLayout = lazy(() => import("./pages/disasterrecovery/DisasterRecoveryLayout"));
const DRRunbooks = lazy(() => import("./pages/disasterrecovery/subpages/drrunbooks/DRRunbooks"));
const DRRunbooksDetails = lazy(() => import("./pages/disasterrecovery/subpages/drrunbooks/DRRunbooksDetails"));
const InstantVMs = lazy(() => import("./pages/disasterrecovery/subpages/InstantVMs"));
const MountedRecoveryPoints = lazy(() => import("./pages/disasterrecovery/subpages/MountedRecoveryPoints"));
const VirtualStandby = lazy(() => import("./pages/disasterrecovery/subpages/VirtualStandby"));

//Reports
const ReportsLayout = lazy(() => import("./pages/reports/ReportsLayout"));
const BackupJobs = lazy(() => import("./pages/reports/BackupJobs"));
const DataTransfer = lazy(() => import("./pages/reports/DataTransfer"));
const ManageReportSchedules = lazy(() => import("./pages/reports/ManageReportSchedules"));
const RecoveryPoint = lazy(() => import("./pages/reports/RecoveryPoint"));
const SourceProtection = lazy(() => import("./pages/reports/SourceProtection"));
const StoredData = lazy(() => import("./pages/reports/StoredData"));

//Settings
const SettingsLayout = lazy(() => import("./pages/settings/SettingsLayout"));
const SourceGroups = lazy(() => import("./pages/settings/SourceGroups"));

function RouteFallback() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
      <CircularProgress size={28} aria-label="Loading page" />
    </Box>
  );
}

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Top-level pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard/protection-intent-setup"
            element={<ProtectionIntentSetup />}
          />
          <Route path="/arcgenie/overview" element={<ArcGenieOverviewPage />} />
          <Route
            path="/arcgenie/protection-intent"
            element={<ArcGenieProtectionIntentPage />}
          />
          <Route path="/arcgenie/messaging" element={<ArcGenieMessagingPage />} />
          <Route
            path="/arcgenie/overview/needs-attention"
            element={<ArcGenieNeedsAttentionPage />}
          />
          <Route path="/arcgenie/overview/:goalId" element={<ArcGenieGoalDetailPage />} />
          <Route path="/jobs" element={<JobsLayout />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/alert-rules" element={<AlertRulesLayout />} />
          <Route path="/audit-logs" element={<AuditLogsLayout />} />
          <Route path="/support" element={<Help />} />

          {/* SOURCES (Split layout) */}
          <Route path="/sources" element={<SourcesLayout />}>
            <Route index element={<Navigate to="all-sources" replace />} />
            <Route path="all-sources" element={<AllSources />} />
            <Route path="machines" element={<SourcesMachines />} />
            <Route
              path="machines-without-plan"
              element={<MachinesWithoutPlan />}
            />
            <Route path="agentless-vms" element={<AgentlessVMs />} />
            <Route path="unc-nfs-paths" element={<UNCNFSPaths />} />
          </Route>

          {/* DESTINATIONS (Split layout) */}
          <Route path="/destinations" element={<DestinationsLayout />}>
            <Route
              index
              element={<Navigate to="recovery-point-servers" replace />}
            />
            <Route
              path="recovery-point-servers"
              element={<RecoveryPointServers />}
            />
            <Route path="data-stores" element={<DataStore />} />
            <Route
              path="arcserve-cyber-resilient-storage-accounts"
              element={<ACRSAccount />}
            />
            <Route path="shared-folders" element={<SharedFolders />} />
          </Route>

          {/* INFRASTRUCTURES (Split layout) */}
          <Route path="/infrastructures" element={<InfrastructuresLayout />}>
            <Route index element={<Navigate to="hypervisors" replace />} />
            <Route path="hypervisors" element={<Hypervisors />} />
            <Route path="sites" element={<Sites />} />
            <Route path="storage-arrays" element={<StorageArrays />} />
            <Route path="proxies" element={<Proxies />} />
            <Route path="oracle-hosts" element={<OracleHosts />} />
            <Route
              path="cloud-protection-orchestrators"
              element={<CloudProtectionOrchestrator />}
            />
            <Route path="cloud-accounts" element={<CloudAccounts />} />
          </Route>

          {/* PLANS (single page) */}
          <Route path="/plans" element={<PlansLayout />} />

          {/* DISASTER RECOVERY (mixed: split layout + full page) */}
          <Route path="/disaster-recovery" element={<Outlet />}>
            {/* Full page route(s) under same base */}
            <Route path="dr-runbooks/new" element={<DRRunbooksDetails />} />

            {/* Split layout group */}
            <Route element={<DisasterRecoveryLayout />}>
              <Route index element={<Navigate to="dr-runbooks" replace />} />
              <Route path="dr-runbooks" element={<DRRunbooks />} />
              <Route path="instant-vms" element={<InstantVMs />} />
              <Route
                path="mounted-recovery-points"
                element={<MountedRecoveryPoints />}
              />
              <Route path="virtual-standby" element={<VirtualStandby />} />
            </Route>
          </Route>

          {/* REPORTS (Split layout) */}
          <Route path="/reports" element={<ReportsLayout />}>
            <Route index element={<Navigate to="backup-jobs" replace />} />
            <Route path="backup-jobs" element={<BackupJobs />} />
            <Route path="data-transfer" element={<DataTransfer />} />
            <Route
              path="managed-report-schedules"
              element={<ManageReportSchedules />}
            />
            <Route path="recovery-point" element={<RecoveryPoint />} />
            <Route path="source-protection" element={<SourceProtection />} />
            <Route path="stored-data" element={<StoredData />} />
          </Route>

          {/* Settings (Split layout) */}
          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="source-groups" replace />} />
            <Route path="source-groups" element={<SourceGroups />} />
            {/* Add more settings sub-routes here */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
