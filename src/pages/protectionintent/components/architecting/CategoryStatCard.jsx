import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function CategoryStatCard({ label, count, target, done, accentColor }) {
  return (
    <Box
      sx={{
        flex: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body2" fontWeight={700} color="text.primary">
          {label}
        </Typography>
        {done ? (
          <CheckCircleRoundedIcon aria-label="Complete" sx={{ color: "success.main", fontSize: 18 }} />
        ) : (
          <CircularProgress aria-label="Assigning" size={14} thickness={6} sx={{ color: accentColor }} />
        )}
      </Stack>
      <Typography variant="h5" fontWeight={700} color="text.primary">
        {count}
        {!done && (
          <Typography component="span" variant="body2" color="text.secondary">
            {" "}
            / {target}
          </Typography>
        )}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {done ? "sources assigned" : "assigning..."}
      </Typography>
    </Box>
  );
}
