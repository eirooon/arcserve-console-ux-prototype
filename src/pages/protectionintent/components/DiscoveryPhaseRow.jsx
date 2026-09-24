import { CircularProgress, Stack, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function DiscoveryPhaseRow({ label, status, count, isLast }) {
  const done = status === "done";

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.75}
      component="li"
      sx={{
        py: 1.6,
        borderBottom: isLast ? 0 : "1px solid",
        borderColor: "divider",
        opacity: 0,
        transform: "translateY(6px)",
        animation: "discovery-row-in 0.4s cubic-bezier(.2,.7,.2,1) forwards",
        "@keyframes discovery-row-in": {
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {done ? (
        <CheckCircleRoundedIcon
          aria-label={`${label}, complete`}
          sx={{ color: "success.main", fontSize: 20, flexShrink: 0 }}
        />
      ) : (
        <CircularProgress size={20} thickness={4} sx={{ flexShrink: 0 }} aria-label={`${label}, in progress`} />
      )}

      <Typography
        variant="body2"
        fontSize={15}
        color={done ? "text.primary" : "text.secondary"}
        sx={{ flex: 1 }}
      >
        {label}
      </Typography>

      {done && count != null && (
        <Typography
          fontWeight={600}
          fontSize={17}
          color="primary.dark"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {count}
        </Typography>
      )}
    </Stack>
  );
}
