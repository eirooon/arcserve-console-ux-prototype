import { FormControlLabel, Paper, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { APPLY_SCOPE_OPTIONS } from "../protectionIntentData";

export default function ApplyScopeSelector({ value, onChange }) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: "8px" }}>
      <Stack spacing={1.5}>
        <Typography variant="subtitle2" fontWeight={700} color="text.primary">
          Apply protection intent to
        </Typography>
        <RadioGroup
          aria-label="Apply protection intent to"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {APPLY_SCOPE_OPTIONS.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio size="small" />}
              sx={{ alignItems: "flex-start", py: 0.5 }}
              label={
                <Stack sx={{ pt: "9px" }}>
                  <Typography variant="body2" color="text.primary">
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Stack>
              }
            />
          ))}
        </RadioGroup>
      </Stack>
    </Paper>
  );
}
