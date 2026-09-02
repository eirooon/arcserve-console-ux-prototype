import { Button, Stack, TextField, Typography } from "@mui/material";
import { CUSTOM_PROMPT_COPY } from "../protectionIntentData";

export default function ProtectionIntentCustomPromptPanel({
  value,
  onChange,
  onGenerate,
}) {
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Stack spacing={1}>
        <Typography variant="body2" color="text.primary">
          {CUSTOM_PROMPT_COPY.instructions}
        </Typography>
        <TextField
          fullWidth
          multiline
          placeholder={CUSTOM_PROMPT_COPY.placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { height: 200, alignItems: "flex-start" },
            "& .MuiOutlinedInput-input": {
              height: "100% !important",
              overflow: "auto !important",
            },
          }}
        />
      </Stack>
      <Button
        variant="outlined"
        color="secondary"
        onClick={onGenerate}
        sx={{ alignSelf: "flex-start" }}
      >
        {CUSTOM_PROMPT_COPY.generateLabel}
      </Button>
    </Stack>
  );
}
