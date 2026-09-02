import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function DetailRow({ label, value }) {
  return (
    <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 200, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary" noWrap>
        {value}
      </Typography>
    </Stack>
  );
}

export default function ProtectionCategoryAccordion({
  category,
  quickStats,
  extensionCountLabel,
  generalSettings,
  destinationSettings,
  extensions,
  expanded,
  onToggleExpand,
  onToggleExtension,
  onEdit,
  readOnly = false,
}) {
  const visibleExtensions = readOnly
    ? extensions.filter((extension) => extension.enabled)
    : extensions;
  return (
    <Accordion
      expanded={expanded}
      onChange={onToggleExpand}
      disableGutters
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderTopLeftRadius: "8px !important",
        borderTopRightRadius: "8px !important",
        borderBottomLeftRadius: "8px !important",
        borderBottomRightRadius: "8px !important",
        overflow: "hidden",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          px: 3,
          py: 1,
          borderBottom: expanded ? 1 : 0,
          borderColor: "divider",
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            my: 2,
            minWidth: 0,
          },
          "& .MuiAccordionSummary-expandIconWrapper": {
            marginLeft: "16px",
            marginRight: 0,
          },
        }}
      >
        <Stack sx={{ width: 400, flexShrink: 0 }}>
          <Typography variant="body1" fontWeight={700} color="text.primary">
            {category.label}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {category.description}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={3} sx={{ flex: 1, minWidth: 0 }}>
          {quickStats.map((stat) => (
            <Typography key={stat} variant="body2" color="text.secondary" noWrap>
              {stat}
            </Typography>
          ))}
        </Stack>
        <Chip label={extensionCountLabel} size="small" sx={{ flexShrink: 0 }} />
      </AccordionSummary>
      <AccordionDetails sx={{ p: 3 }}>
        <Stack direction="row" spacing={4}>
          <Stack spacing={4} sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight={500} color="text.primary">
                General Settings
              </Typography>
              <Stack spacing={0.5}>
                {generalSettings.map((row) => (
                  <DetailRow key={row.label} label={row.label} value={row.value} />
                ))}
              </Stack>
            </Stack>
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight={500} color="text.primary">
                Default Destination Settings
              </Typography>
              <Stack spacing={0.5}>
                {destinationSettings.map((row) => (
                  <DetailRow key={row.label} label={row.label} value={row.value} />
                ))}
              </Stack>
            </Stack>
            {!readOnly && (
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                sx={{ width: "fit-content" }}
                onClick={onEdit}
              >
                Edit This Category
              </Button>
            )}
          </Stack>
          <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={500} color="text.primary">
              Extensions
            </Typography>
            {readOnly ? (
              visibleExtensions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No extensions selected.
                </Typography>
              ) : (
                <Box>
                  {visibleExtensions.map((extension, index) => (
                    <Stack
                      key={extension.label}
                      spacing={0.5}
                      sx={{
                        py: 2,
                        borderBottom: index === visibleExtensions.length - 1 ? 0 : 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="body2" fontWeight={700} color="text.primary">
                        {extension.label}
                      </Typography>
                      {extension.detail && (
                        <Typography variant="caption" color="text.secondary">
                          {extension.detail}
                        </Typography>
                      )}
                    </Stack>
                  ))}
                </Box>
              )
            ) : (
              <Box>
                {extensions.map((extension) => (
                  <Stack
                    key={extension.label}
                    direction="row"
                    spacing={2}
                    sx={{ py: 2, borderBottom: 1, borderColor: "divider" }}
                  >
                    <Switch
                      size="small"
                      checked={extension.enabled}
                      onChange={() => onToggleExtension(extension.label)}
                      aria-label={`Toggle ${extension.label}`}
                    />
                    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                      <Typography variant="body2" color="text.primary">
                        {extension.label}
                      </Typography>
                      {extension.detail && (
                        <Typography variant="caption" color="text.secondary">
                          {extension.detail}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                ))}
              </Box>
            )}
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
