import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import WaitingOnYouCard from "./components/WaitingOnYouCard";
import FilterTabs from "../../components/FilterTabs";
import { useWaitingOnYou } from "./hooks/useWaitingOnYou";
import { useWaitingOnYouFilter } from "./hooks/useWaitingOnYouFilter";
import { useExclusiveDisclosure } from "../../hooks/useExclusiveDisclosure";

export default function ArcGenieWaitingOnYouPage() {
  const navigate = useNavigate();
  const { items, handleAction, handleDismiss, dismissSuggestion } = useWaitingOnYou();
  const { activeType, setActiveType, visibleItems, filterOptions } = useWaitingOnYouFilter(items);
  const dismissPanel = useExclusiveDisclosure();

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "calc(100vh - 64px)", py: { xs: 3, sm: 4, md: 6 } }}>
      <Stack spacing={3} sx={{ width: "100%", px: { xs: 2, sm: 4, md: 6 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={{ xs: 1.5, sm: 0 }}
        >
          <Typography variant="h6" color="text.primary">
            Waiting On You
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/arcgenie/overview")}
          >
            Back
          </Button>
        </Stack>

        {items.length > 0 && (
          <FilterTabs
            value={activeType}
            onChange={setActiveType}
            options={filterOptions}
            ariaLabel="Filter Waiting on You by request type"
          />
        )}

        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Currently, there are no activities to report. ArcGenie will automatically record
            policy checks and optimizations in this section as they happen.
          </Typography>
        ) : visibleItems.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No items match this filter.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {visibleItems.map((item) => (
              <WaitingOnYouCard
                key={item.id}
                item={item}
                onAction={handleAction}
                onDismiss={handleDismiss}
                isDismissPanelOpen={dismissPanel.isOpen(item.id)}
                onOpenDismissPanel={() => dismissPanel.open(item.id)}
                onCloseDismissPanel={dismissPanel.close}
                onConfirmDismiss={(dismissedItem, { reason, note }) => {
                  dismissPanel.close();
                  dismissSuggestion(dismissedItem, { reason, note });
                }}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
