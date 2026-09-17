import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Close, Refresh } from "@mui/icons-material";
import ProtectionCategoriesList from "./ProtectionCategoriesList";
import {
  getCadenceSummaryForCategory,
  getCategoryCountWord,
  getExtensionSummaryLabel,
} from "../protectionIntentRecommendationData";

const HERO_GRADIENT = "linear-gradient(135deg, #00A7E1 0%, #8A2BFF 100%)";

const CATEGORIZATION_EXPLANATION = {
  title: "Why These Categories?",
  description:
    "ArcGenie analyzed your 150 VMs and 8 databases by analyzing the following factors:",
  factors: [
    "Business criticality tags/metadata",
    "Resource type and dependencies",
    "Current SLA requirements",
    "Existing backup coverage",
  ],
  note: "You can recategorize sources by editing each category or clicking 'Manage Sources in This Category' below.",
};

const EXTENSION_DETAILS = {
  Compliance: {
    description: "30 days minimum, 3-7 years retention",
    impact: "+$150/month",
  },
  "Cyber Resilient": {
    description: "Isolated recovery (prevents ransomware spread)",
    impact: "+2 additional copies, +$300/month",
  },
  "DR Enabled": {
    description: "15-minute RPO, failover ready",
    impact: "Enables live failover, +$200/month",
  },
};

export default function ProtectionIntentRecommendationPanelEnhanced({
  recommendationData = {},
  onTryAnotherOption,
  categories,
  onEditCategory,
  onAddCategory,
  expandedCategories,
  onToggleCategoryExpand,
  extensionState,
  onToggleExtension,
  categoryFormData,
}) {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState(null);

  const { chipLabel = "ArcGenie Recommends", sourcesCount = 31 } = recommendationData;

  const handleExtensionTooltip = (extension) => {
    setSelectedExtension(extension);
  };

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: HERO_GRADIENT,
          borderRadius: "16px",
          boxShadow:
            "0px 4px 12px 0px rgba(0,0,0,0.08), 0px 1px 2px 0px rgba(0,0,0,0.06)",
          p: "32px",
          color: "common.white",
        }}
      >
        <Stack spacing={3}>
          {/* Header with Try Another Option */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Chip
              label={chipLabel}
              icon={
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "100px",
                    bgcolor: "common.white",
                    ml: "12px !important",
                    mr: "0px !important",
                  }}
                />
              }
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "100px",
                height: "auto",
                py: "4px",
                pr: "12px",
                "& .MuiChip-label": {
                  color: "common.white",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: 1.43,
                  letterSpacing: "0.17px",
                  pl: "4px",
                  pr: 0,
                },
              }}
            />
            <Button
              variant="text"
              size="small"
              startIcon={<Refresh />}
              onClick={onTryAnotherOption}
              sx={{
                color: "common.white",
                px: "5px",
                py: "4px",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Refine Approach
            </Button>
          </Stack>

          {/* Main recommendation text */}
          <Typography variant="h5" component="p" sx={{ color: "common.white" }}>
            Sort your <strong>{sourcesCount}</strong> sources into these{" "}
            <strong>{getCategoryCountWord(categories.length)}</strong> categories. The harder a
            system is to lose, the more often ArcGenie backs it up.
          </Typography>

          {/* Per-category stat tiles */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {categories.map((category) => (
              <Box
                key={category.id}
                sx={{
                  minWidth: 0,
                  bgcolor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  p: "24px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <Typography variant="body2" fontWeight={700} noWrap>
                  {categoryFormData[category.id].categoryName}
                </Typography>
                <Stack direction="row" spacing="8px" alignItems="flex-end">
                  <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: "0.15px" }}>
                    {category.sourcesCount ?? 0}
                  </Typography>
                  <Typography variant="body2">sources</Typography>
                </Stack>
                <Box>
                  <Typography variant="body2" component="div">
                    {getCadenceSummaryForCategory(category.id, categoryFormData)}
                  </Typography>
                  <Typography variant="body2" component="div">
                    {getExtensionSummaryLabel(category.id, extensionState)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>

      {/* Protection Categories Header with Info */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Protection Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Open each category to review its settings
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            variant="text"
            color="secondary"
            onClick={() => setExplanationOpen(true)}
          >
            Why these categories?
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            startIcon={<Add fontSize="small" />}
            onClick={onAddCategory}
          >
            Add Protection Category
          </Button>
        </Stack>
      </Stack>

      {/* Explanation Dialog */}
      <Dialog
        open={explanationOpen}
        onClose={() => setExplanationOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ fontWeight: 700 }}>{CATEGORIZATION_EXPLANATION.title}</Box>
          <IconButton
            onClick={() => setExplanationOpen(false)}
            size="small"
            sx={{ ml: 2 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {CATEGORIZATION_EXPLANATION.description}
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {CATEGORIZATION_EXPLANATION.factors.map((factor, idx) => (
                <Typography
                  key={idx}
                  component="li"
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {factor}
                </Typography>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> {CATEGORIZATION_EXPLANATION.note}
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Extension Details Dialog */}
      <Dialog
        open={!!selectedExtension}
        onClose={() => setSelectedExtension(null)}
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ fontWeight: 700 }}>{selectedExtension}</Box>
          <IconButton
            onClick={() => setSelectedExtension(null)}
            size="small"
            sx={{ ml: 2 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedExtension && (
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="text.primary"
                >
                  Description
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {EXTENSION_DETAILS[selectedExtension].description}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="text.primary"
                >
                  Impact
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {EXTENSION_DETAILS[selectedExtension].impact}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Categories List */}
      <ProtectionCategoriesList
        categories={categories}
        onEditCategory={onEditCategory}
        expandedCategories={expandedCategories}
        onToggleCategoryExpand={onToggleCategoryExpand}
        extensionState={extensionState}
        onToggleExtension={onToggleExtension}
        categoryFormData={categoryFormData}
        onExtensionInfo={handleExtensionTooltip}
      />
    </Stack>
  );
}
