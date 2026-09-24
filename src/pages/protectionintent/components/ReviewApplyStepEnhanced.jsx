import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccordionShell from "../../../components/AccordionShell";
import ProtectionCategoryAccordion from "./ProtectionCategoryAccordion";
import ReviewGoalSummaryCard from "./ReviewGoalSummaryCard";
import { useReviewApply } from "../hooks/useReviewApply";
import {
  getDestinationSettingsForCategory,
  getExtensionCountLabel,
  getExtensionsForCategory,
  getGeneralSettingsForCategory,
  getQuickStatsForCategory,
} from "../protectionIntentRecommendationData";

export default function ReviewApplyStepEnhanced({
  categories,
  categoryFormData,
  extensionState,
  goals,
  onCancel,
  onPrevious,
  onActivate,
  onEditProtection,
  onEditGoals,
  onEditNotifications,
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [costBreakdownOpen, setCostBreakdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    protection: true,
    automation: true,
    notifications: true,
    impact: true,
  });
  const { expandedCategories, toggleCategoryExpanded } = useReviewApply(categories);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Estimated impact isn't tracked as wizard state yet, so it stays mocked.
  const impactData = {
    assets: 31,
    dailyVolume: "~2.4 TB",
    monthlyCost: "~$8,500",
    storageTargets: [
      { type: "Recovery Point Server", value: "10.11.2.3 (Critical Datastore)" },
      { type: "Offsite location", value: "Cloud (AWS S3, us-east-1)" },
      { type: "Immutable vault", value: "On-prem (Tape, vault-01)" },
    ],
  };

  const canActivate = isChecked;

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Review your protection intent before activation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Once activated, ArcGenie will begin applying policies and monitoring your
          infrastructure.
        </Typography>
      </Box>

      {/* Comprehensive Review Sections */}
      <Stack spacing={2}>
        {/* Protection Summary */}
        <AccordionShell
          expanded={expandedSections.protection}
          onToggleExpand={() => toggleSection("protection")}
          summary={
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              Protection Summary
            </Typography>
          }
        >
          <Stack spacing={2}>
            {categories.map((category) => (
              <ProtectionCategoryAccordion
                key={category.id}
                readOnly
                category={{
                  ...category,
                  label: categoryFormData[category.id].categoryName,
                }}
                quickStats={getQuickStatsForCategory(category.id, categoryFormData)}
                extensionCountLabel={getExtensionCountLabel(category.id, extensionState)}
                generalSettings={getGeneralSettingsForCategory(category.id, categoryFormData)}
                destinationSettings={getDestinationSettingsForCategory(category.id, categoryFormData)}
                extensions={getExtensionsForCategory(category.id, extensionState, categoryFormData)}
                expanded={Boolean(expandedCategories[category.id])}
                onToggleExpand={() => toggleCategoryExpanded(category.id)}
              />
            ))}
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={onEditProtection}
              sx={{ justifyContent: "flex-start", alignSelf: "flex-start" }}
            >
              Edit Protection Settings
            </Button>
          </Stack>
        </AccordionShell>

        {/* Automation Goals */}
        <AccordionShell
          expanded={expandedSections.automation}
          onToggleExpand={() => toggleSection("automation")}
          summary={
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              Automation Goals
            </Typography>
          }
        >
          <Stack spacing={2}>
            {goals.map((goal) => (
              <ReviewGoalSummaryCard key={goal.id} goal={goal} />
            ))}
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={onEditGoals}
              sx={{ justifyContent: "flex-start", alignSelf: "flex-start" }}
            >
              Edit Automation Goals
            </Button>
          </Stack>
        </AccordionShell>

        {/* Notification Channels */}
        <AccordionShell
          expanded={expandedSections.notifications}
          onToggleExpand={() => toggleSection("notifications")}
          summary={
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              Notification Channels
            </Typography>
          }
        >
          <Stack spacing={2}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <CheckCircleRoundedIcon sx={{ color: "success.main", fontSize: 18 }} />
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  Email
                </Typography>
              </Stack>
              <Box sx={{ pl: 2, mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Receive: Critical alerts, daily digest, weekly report
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  Recipient: erron.sevilla@arcserve.com
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <CheckCircleRoundedIcon sx={{ color: "success.main", fontSize: 18 }} />
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  Slack
                </Typography>
              </Stack>
              <Box sx={{ pl: 2, mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Receive: Daily digest, approval requests
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  Workspace: Connected to your-workspace.slack.com
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  Channels: #arcgenie-daily, @arcgenie bot
                </Typography>
              </Box>
            </Box>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={onEditNotifications}
              sx={{ justifyContent: "flex-start", alignSelf: "flex-start" }}
            >
              Edit Notification Settings
            </Button>
          </Stack>
        </AccordionShell>

        {/* Estimated Impact */}
        <AccordionShell
          expanded={expandedSections.impact}
          onToggleExpand={() => toggleSection("impact")}
          summary={
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              Estimated Impact
            </Typography>
          }
        >
          <Stack spacing={2}>
            <Box>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Resources to protect:
                </Typography>
                <Typography variant="caption" fontWeight={600} color="text.primary">
                  {impactData.assets} assets
                </Typography>
              </Stack>
            </Box>
            <Box>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Estimated daily backup volume:
                </Typography>
                <Typography variant="caption" fontWeight={600} color="text.primary">
                  {impactData.dailyVolume}
                </Typography>
              </Stack>
            </Box>
            <Box>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Estimated monthly cost:
                </Typography>
                <Typography variant="caption" fontWeight={600} color="text.primary">
                  {impactData.monthlyCost}
                </Typography>
              </Stack>
            </Box>
            <Divider />
            <Box>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Storage targets:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, mt: 1 }}>
                {impactData.storageTargets.map((target) => (
                  <Typography
                    key={target.type}
                    component="li"
                    variant="caption"
                    color="text.secondary"
                  >
                    <strong>{target.type}:</strong> {target.value}
                  </Typography>
                ))}
              </Box>
            </Box>
            <Alert severity="info">
              These estimates are based on your current inventory. Actual costs may vary based on
              growth or policy changes.
            </Alert>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => setCostBreakdownOpen(true)}
              sx={{ justifyContent: "flex-start", alignSelf: "flex-start" }}
            >
              View Cost Breakdown
            </Button>
          </Stack>
        </AccordionShell>
      </Stack>

      {/* Apply Scope */}
      <Alert severity="info">
        This protection intent will be applied to all sources, existing and new.
      </Alert>

      {/* Confirmation Checkbox */}
      <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", border: "1px solid", borderColor: "divider" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2" color="text.primary">
              I have reviewed the protection intent and approve activation with the settings
              above.
            </Typography>
          }
        />
      </Paper>

      {/* Cost Breakdown Dialog */}
      <Dialog open={costBreakdownOpen} onClose={() => setCostBreakdownOpen(false)} maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ fontWeight: 700 }}>Cost Breakdown</Box>
          <IconButton
            onClick={() => setCostBreakdownOpen(false)}
            size="small"
            sx={{ ml: 2 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Base Backup (Daily backups, 12-month retention)
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  $5,200/mo
                </Typography>
              </Stack>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                Extensions:
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Compliance (3-7yr retention)
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    +$1,500/mo
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Cyber Resilient (isolated copies)
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    +$1,200/mo
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    DR Enabled (failover ready)
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    +$600/mo
                  </Typography>
                </Stack>
              </Stack>
            </Box>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                Total Estimated Cost
              </Typography>
              <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                ~$8,500/mo
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Action Buttons */}
      <Stack direction="row" justifyContent="space-between">
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="secondary" onClick={onPrevious}>
            Previous
          </Button>
          <Button variant="contained" onClick={onActivate} disabled={!canActivate}>
            Activate Protection Intent
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
