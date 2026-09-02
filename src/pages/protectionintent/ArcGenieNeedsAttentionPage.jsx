import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Snackbar, Stack, Tab, Tabs, Typography } from "@mui/material";
import NeedsAttentionCard from "./components/NeedsAttentionCard";
import { useNeedsAttention } from "./hooks/useNeedsAttention";
import { NEEDS_ATTENTION_ITEMS } from "./arcGenieOverviewData";

const ALL_CATEGORIES_TAB = "all";

const CATEGORY_TABS = [
  ALL_CATEGORIES_TAB,
  ...new Set(NEEDS_ATTENTION_ITEMS.map((item) => item.category)),
];

export default function ArcGenieNeedsAttentionPage() {
  const navigate = useNavigate();
  const { items, handleAction, handleDismiss, snackbarMessage, closeSnackbar } =
    useNeedsAttention();
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES_TAB);

  const visibleItems = useMemo(
    () =>
      activeCategory === ALL_CATEGORIES_TAB
        ? items
        : items.filter((item) => item.category === activeCategory),
    [items, activeCategory],
  );

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "calc(100vh - 64px)", py: 6 }}>
      <Stack spacing={3} sx={{ width: "100%", px: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Needs Attention
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/arcgenie/overview")}
          >
            Back
          </Button>
        </Stack>

        <Tabs
          value={activeCategory}
          onChange={(event, value) => setActiveCategory(value)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          {CATEGORY_TABS.map((category) => (
            <Tab
              key={category}
              value={category}
              label={category === ALL_CATEGORIES_TAB ? "All Categories" : category}
            />
          ))}
        </Tabs>

        {visibleItems.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Currently, there are no activities to report. ArcGenie will automatically record
            policy checks and optimizations in this section as they happen.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {visibleItems.map((item) => (
              <NeedsAttentionCard
                key={item.id}
                item={item}
                onAction={handleAction}
                onDismiss={handleDismiss}
              />
            ))}
          </Stack>
        )}
      </Stack>

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={closeSnackbar}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
