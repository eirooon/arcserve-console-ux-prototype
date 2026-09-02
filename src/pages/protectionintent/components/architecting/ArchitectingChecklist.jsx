import { CircularProgress, Stack, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";

function getStepDetail(step) {
  if (step.status === "pending") return "Pending";
  if (step.showFraction) return `${step.count ?? 0} / ${step.target}`;
  if (step.status === "done" && step.target != null) {
    return step.unit ? `${step.target} ${step.unit}` : `${step.target}`;
  }
  return "";
}

export default function ArchitectingChecklist({ steps, accentColor, accentBg }) {
  return (
    <Stack component="ul" spacing={0} sx={{ width: "100%", m: 0, p: 0, listStyle: "none" }}>
      {steps.map((step) => (
        <Stack
          key={step.id}
          component="li"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 1.5,
            py: 1.25,
            borderRadius: 1.5,
            bgcolor: step.status === "active" ? accentBg : "transparent",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
            {step.status === "done" && (
              <CheckCircleRoundedIcon
                aria-label="Complete"
                sx={{ color: "success.main", fontSize: 20, flexShrink: 0 }}
              />
            )}
            {step.status === "active" && (
              <CircularProgress
                aria-label="In progress"
                size={16}
                thickness={6}
                sx={{ color: accentColor, flexShrink: 0 }}
              />
            )}
            {step.status === "pending" && (
              <RadioButtonUncheckedRoundedIcon
                aria-label="Pending"
                sx={{ color: "action.disabled", fontSize: 20, flexShrink: 0 }}
              />
            )}
            <Typography
              variant="body2"
              fontWeight={step.status === "pending" ? 400 : 600}
              color={step.status === "pending" ? "text.disabled" : "text.primary"}
            >
              {step.label}
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            color={step.status === "active" ? accentColor : "text.secondary"}
            fontWeight={step.status === "active" ? 700 : 500}
            sx={{ flexShrink: 0, pl: 2 }}
          >
            {getStepDetail(step)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
