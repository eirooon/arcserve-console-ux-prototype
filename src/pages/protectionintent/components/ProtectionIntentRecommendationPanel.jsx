import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import ProtectionCategoriesList from "./ProtectionCategoriesList";
import { RECOMMENDATION_BANNER_COPY, RECOMMENDATION_HERO_STATS } from "../protectionIntentRecommendationData";

const HERO_GRADIENT = "linear-gradient(135deg, #00A7E1 0%, #8A2BFF 100%)";

export default function ProtectionIntentRecommendationPanel({
  onTryAnotherOption,
  onEditCategory,
  expandedCategories,
  onToggleCategoryExpand,
  extensionState,
  onToggleExtension,
  categoryFormData,
}) {
  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Chip
              label={RECOMMENDATION_BANNER_COPY.chipLabel}
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
              onClick={onTryAnotherOption}
              sx={{ color: "common.white", px: "5px", py: "4px" }}
            >
              {RECOMMENDATION_BANNER_COPY.tryAnotherOptionLabel}
            </Button>
          </Stack>

          <Typography variant="h5" component="p">
            {RECOMMENDATION_BANNER_COPY.headline.map((segment, index) => (
              <Box
                key={index}
                component="span"
                sx={{ fontWeight: segment.bold ? 700 : 400 }}
              >
                {segment.text}
              </Box>
            ))}
          </Typography>

          <Stack direction="row" spacing="16px" sx={{ minHeight: "100px" }}>
            {RECOMMENDATION_HERO_STATS.map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  bgcolor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  p: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ letterSpacing: "0.15px" }}
                  noWrap
                >
                  {stat.value}
                </Typography>
                <Typography variant="caption">{stat.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>

      <Stack
        direction="row"
        alignItems="baseline"
        justifyContent="space-between"
      >
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Protection Categories
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Open a each category to review its settings
        </Typography>
      </Stack>

      <ProtectionCategoriesList
        categoryFormData={categoryFormData}
        extensionState={extensionState}
        expandedCategories={expandedCategories}
        onToggleCategoryExpand={onToggleCategoryExpand}
        onToggleExtension={onToggleExtension}
        onEditCategory={onEditCategory}
      />
    </Stack>
  );
}
