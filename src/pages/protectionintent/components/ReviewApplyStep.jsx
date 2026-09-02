import { Box, Button, Stack, Typography } from "@mui/material";
import ProtectionIntentSummaryPanel from "./ProtectionIntentSummaryPanel";
import { REVIEW_STEP_COPY } from "../protectionIntentData";

export default function ReviewApplyStep({
  categoryFormData,
  extensionState,
  goals,
  globalSettings,
  onCancel,
  onPrevious,
  onActivate,
}) {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          {REVIEW_STEP_COPY.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {REVIEW_STEP_COPY.description}
        </Typography>
      </Box>

      <ProtectionIntentSummaryPanel
        categoryFormData={categoryFormData}
        extensionState={extensionState}
        goals={goals}
        globalSettings={globalSettings}
      />

      <Stack direction="row" justifyContent="space-between">
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="secondary" onClick={onPrevious}>
            Previous
          </Button>
          <Button variant="contained" onClick={onActivate}>
            Activate ArcGenie Protection Intent
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
