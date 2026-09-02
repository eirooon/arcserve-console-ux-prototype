import { Box, Stack, Typography } from "@mui/material";

export default function AutoProtectStatTile({ field, value }) {
  const Icon = field.icon;

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        flex: 1,
        minWidth: 0,
        border: 1,
        borderColor: "divider",
        borderRadius: "8px",
        p: 2,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "8px",
          bgcolor: field.bgColor,
          color: field.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 22 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" fontWeight={500} sx={{ color: field.color }} noWrap>
          {field.label}
        </Typography>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}
