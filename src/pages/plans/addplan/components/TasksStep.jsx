import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useSourceData } from "../../../sources/hooks/useSourceData";
import WhatToProtectPanel from "./task-tabs/WhatToProtectPanel";
import WhereToProtectPanel from "./task-tabs/WhereToProtectPanel";
import WhenToProtectPanel from "./task-tabs/WhenToProtectPanel";
import AdditionalSettingsPanel from "./task-tabs/AdditionalSettingsPanel";

const selectSourceRows = (state) => ({ rows: state.rows });

const SUB_TABS = [
  { label: "What to Protect" },
  { label: "Where to Protect" },
  { label: "When to Protect" },
  { label: "Additional Settings" },
];

/**
 * "Tasks" step content (Figma node 6239:8895): a summary of the sources
 * picked in the previous step, then a "What/Where/When to Protect" +
 * "Additional Settings" tab strip (Figma nodes 6239:9737, 6478:6168,
 * 6478:6498, 8327:27661).
 */
export default function TasksStep({
  selectedSourceIds,
  onRemoveSources,
  activityType,
  onActivityTypeChange,
  taskDetails,
}) {
  const { rows: allSources } = useSourceData(selectSourceRows);
  const [subTab, setSubTab] = useState(0);

  const selectedSources = useMemo(
    () => allSources.filter((source) => selectedSourceIds.includes(source.id)),
    [allSources, selectedSourceIds],
  );

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Sources (Optional)
          </Typography>
          <Typography variant="body2">
            {selectedSources.length} selected source{selectedSources.length === 1 ? "" : "s"}
          </Typography>
        </Box>
        {selectedSources.length > 0 && (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {selectedSources.map((source) => (
              <Chip
                key={source.id}
                label={source.source_name}
                onDelete={() => onRemoveSources([source.id])}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Tabs
        value={subTab}
        onChange={(_, value) => setSubTab(value)}
        sx={{ borderTop: "1px solid rgba(0,0,0,0.12)", borderBottom: "1px solid rgba(0,0,0,0.12)" }}
      >
        {SUB_TABS.map((tab) => (
          <Tab key={tab.label} label={tab.label} />
        ))}
      </Tabs>

      <Box sx={{ p: 4, width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        {subTab === 0 && (
          <WhatToProtectPanel activityType={activityType} onActivityTypeChange={onActivityTypeChange} />
        )}

        {subTab === 1 && (
          <WhereToProtectPanel
            backupDestinationType={taskDetails.backupDestinationType}
            onBackupDestinationTypeChange={taskDetails.setBackupDestinationType}
            recoveryPointServerId={taskDetails.recoveryPointServerId}
            onRecoveryPointServerChange={taskDetails.setRecoveryPointServerId}
            dataStoreId={taskDetails.dataStoreId}
            onDataStoreChange={taskDetails.setDataStoreId}
            passwordProtected={taskDetails.passwordProtected}
            onPasswordProtectedChange={taskDetails.setPasswordProtected}
            sessionPassword={taskDetails.sessionPassword}
            onSessionPasswordChange={taskDetails.setSessionPassword}
            confirmSessionPassword={taskDetails.confirmSessionPassword}
            onConfirmSessionPasswordChange={taskDetails.setConfirmSessionPassword}
          />
        )}

        {subTab === 2 && (
          <WhenToProtectPanel
            scheduleRows={taskDetails.scheduleRows}
            onAddScheduleRow={taskDetails.addScheduleRow}
            onUpdateScheduleRow={taskDetails.updateScheduleRow}
            onRemoveScheduleRow={taskDetails.removeScheduleRow}
            backupScheduleExpanded={taskDetails.backupScheduleExpanded}
            onToggleBackupScheduleExpanded={(_, expanded) =>
              taskDetails.setBackupScheduleExpanded(expanded)
            }
            mergeScheduleRows={taskDetails.mergeScheduleRows}
            onAddMergeScheduleRow={taskDetails.addMergeScheduleRow}
            onUpdateMergeScheduleRow={taskDetails.updateMergeScheduleRow}
            onRemoveMergeScheduleRow={taskDetails.removeMergeScheduleRow}
            mergeScheduleExpanded={taskDetails.mergeScheduleExpanded}
            onToggleMergeScheduleExpanded={(_, expanded) =>
              taskDetails.setMergeScheduleExpanded(expanded)
            }
          />
        )}

        {subTab === 3 && (
          <AdditionalSettingsPanel
            executeCopyJobsInParallel={taskDetails.executeCopyJobsInParallel}
            onChange={taskDetails.setExecuteCopyJobsInParallel}
          />
        )}
      </Box>
    </Box>
  );
}

TasksStep.propTypes = {
  selectedSourceIds: PropTypes.array.isRequired,
  onRemoveSources: PropTypes.func.isRequired,
  activityType: PropTypes.string.isRequired,
  onActivityTypeChange: PropTypes.func.isRequired,
  taskDetails: PropTypes.object.isRequired,
};
