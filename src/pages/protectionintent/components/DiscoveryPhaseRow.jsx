import { Box, CircularProgress, Stack, Typography } from "@mui/material";

function CheckRingIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 20 20"
      width={20}
      height={20}
      sx={{ flexShrink: 0 }}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="none" stroke="#E6E3EE" strokeWidth="1.5" />
      <path
        d="M6 10.4 L8.8 13.2 L14 7.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

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
        <Box sx={{ color: "success.main", display: "flex" }}>
          <CheckRingIcon />
        </Box>
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
