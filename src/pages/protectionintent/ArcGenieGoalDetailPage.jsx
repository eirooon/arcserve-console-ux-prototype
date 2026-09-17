import { useCallback } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Box, Button, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import DataTable, { ACTIONS_COLUMN_FIELD } from "../../components/DataTable";
import { useAutoProtectSources } from "./hooks/useAutoProtectSources";
import {
  useAutoProtectSourceRowActions,
  useAutoProtectSourcesColumns,
} from "./hooks/useAutoProtectSourcesColumns";
import AutoProtectStatTile from "./components/AutoProtectStatTile";
import { INITIAL_AGENTIC_GOALS } from "./configureGoalsAutonomyData";
import { AUTO_PROTECT_STAT_FIELDS, SOURCE_STATUS_OPTIONS, getGoalStats } from "./arcGenieOverviewData";

export default function ArcGenieGoalDetailPage() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const goal = INITIAL_AGENTIC_GOALS.find((candidate) => candidate.id === goalId);

  const {
    sources,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handlePrimaryAction,
    handleDismissSource,
    handleViewDetails,
    handleRunNow,
  } = useAutoProtectSources();

  const columns = useAutoProtectSourcesColumns();
  const rowActions = useAutoProtectSourceRowActions({
    onPrimaryAction: handlePrimaryAction,
    onViewDetails: handleViewDetails,
    onDismissSource: handleDismissSource,
  });
  const rowActionsAriaLabel = useCallback((row) => `Actions for ${row.sourceName}`, []);

  if (!goal) {
    return <Navigate to="/arcgenie/overview" replace />;
  }

  const stats = getGoalStats(goal.id);

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "calc(100vh - 64px)", py: 6 }}>
      <Stack spacing={4} sx={{ width: "100%", px: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Typography variant="h6" color="text.primary" sx={{ maxWidth: 900 }}>
            {goal.title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/arcgenie/overview")}
            >
              Back
            </Button>
            <Tooltip title="Goal configuration coming soon">
              <span>
                <Button variant="outlined" color="secondary" disabled>
                  Configure
                </Button>
              </span>
            </Tooltip>
            <Button variant="contained" onClick={handleRunNow}>
              Run Now
            </Button>
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {goal.description}
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {AUTO_PROTECT_STAT_FIELDS.map((field) => (
            <Box key={field.key} sx={{ flex: "1 1 220px", minWidth: 220 }}>
              <AutoProtectStatTile field={field} value={stats[field.key]} />
            </Box>
          ))}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search source name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            sx={{ flex: 1, maxWidth: 420 }}
          />
          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            sx={{ width: 220 }}
          >
            {SOURCE_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Box sx={{ border: 1, borderColor: "divider", borderRadius: "8px", overflow: "hidden" }}>
          <DataTable
            ariaLabel="Auto-Protect sources"
            columns={columns}
            rows={sources}
            getRowId={(row) => row.id}
            checkboxSelection={false}
            autoHeight
            rowActions={rowActions}
            rowActionsAriaLabel={rowActionsAriaLabel}
            initialState={{ pinnedColumns: { left: [ACTIONS_COLUMN_FIELD] } }}
            slots={{
              noRowsOverlay: () => (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  No sources match your search or filter.
                </Typography>
              ),
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
