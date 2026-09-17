import { Box, Button, Chip, IconButton, Stack, Switch, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccordionShell from "../../../components/AccordionShell";

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
  onExtensionInfo,
  readOnly = false,
}) {
  const visibleExtensions = readOnly
    ? extensions.filter((extension) => extension.enabled)
    : extensions;
  return (
    <AccordionShell
      expanded={expanded}
      onToggleExpand={onToggleExpand}
      summaryContentSx={{ justifyContent: "space-between", gap: 3 }}
      summarySx={{
        "& .MuiAccordionSummary-expandIconWrapper": {
          marginLeft: "16px",
          marginRight: 0,
        },
      }}
      summary={
        <>
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
        </>
      }
    >
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
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="body2" fontWeight={700} color="text.primary">
                        {extension.label}
                      </Typography>
                      {onExtensionInfo && (
                        <Tooltip title={`${extension.label} details & impact`}>
                          <IconButton
                            size="small"
                            onClick={() => onExtensionInfo(extension.label)}
                            aria-label={`${extension.label} details & impact`}
                          >
                            <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
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
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="body2" color="text.primary">
                        {extension.label}
                      </Typography>
                      {onExtensionInfo && (
                        <Tooltip title={`${extension.label} details & impact`}>
                          <IconButton
                            size="small"
                            onClick={() => onExtensionInfo(extension.label)}
                            aria-label={`${extension.label} details & impact`}
                          >
                            <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
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
    </AccordionShell>
  );
}
