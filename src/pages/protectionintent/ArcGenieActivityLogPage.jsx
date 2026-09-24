import { useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import ActivityLogList from "./components/ActivityLogList";
import FilterTabs from "../../components/FilterTabs";
import { useActivityLogRestore } from "./hooks/useActivityLogRestore";
import { useApiResource } from "../../api/useApiResource";
import { ENDPOINTS } from "../../api/endpoints";

const ALL_ACTORS = "all";

const ACTOR_FILTERS = [
  { value: "all", label: "All" },
  { value: "agent", label: "By ArcGenie" },
  { value: "person", label: "By people" },
];

const isAgentEntry = (item) => item.actor === "agent";

export default function ArcGenieActivityLogPage() {
  const { rows: fetchedItems } = useApiResource(ENDPOINTS.ARCGENIE_ACTIVITY_LOG);
  const [activeActor, setActiveActor] = useState(ALL_ACTORS);
  const { withOverlay, restoreSuggestion, isRestored } = useActivityLogRestore();

  const activityLogItems = withOverlay(fetchedItems);

  const visibleItems = useMemo(() => {
    if (activeActor === ALL_ACTORS) return activityLogItems;
    return activityLogItems.filter((item) =>
      activeActor === "agent" ? isAgentEntry(item) : !isAgentEntry(item),
    );
  }, [activityLogItems, activeActor]);

  const filterOptions = useMemo(
    () =>
      ACTOR_FILTERS.map((option) => ({
        ...option,
        count:
          option.value === ALL_ACTORS
            ? activityLogItems.length
            : activityLogItems.filter((item) =>
                option.value === "agent" ? isAgentEntry(item) : !isAgentEntry(item),
              ).length,
      })),
    [activityLogItems],
  );

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "calc(100vh - 64px)", py: 6 }}>
      <Stack spacing={4} sx={{ width: "100%", px: 6 }}>
        <Box>
          <Typography variant="h6" color="text.primary">
            Activity Log
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Every action ArcGenie has taken or you&apos;ve approved, most recent first.
          </Typography>
        </Box>

        {activityLogItems.length > 0 && (
          <FilterTabs
            value={activeActor}
            onChange={setActiveActor}
            options={filterOptions}
            ariaLabel="Filter activity by who acted"
          />
        )}

        <ActivityLogList items={visibleItems} onRestoreSuggestion={restoreSuggestion} isRestored={isRestored} />
      </Stack>
    </Box>
  );
}
