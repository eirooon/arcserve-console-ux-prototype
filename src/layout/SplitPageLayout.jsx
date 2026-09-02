import { blueGrey } from "@mui/material/colors";
import { Box, List, ListItemButton, ListItemText, Chip } from "@mui/material";
export default function SplitPageLayout({
  items = [], // [{ id, label, count }]
  selectedId,
  onSelect,
  leftWidth = 240, // px
  rootLabel,
  children, // right panel content
}) {
  const formatCount = (count) => {
    if (typeof count !== "number") return null;
    return count > 99 ? "99+" : count;
  };

  return (
    <Box sx={{ width: "100%", background: "#fff" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          height: `calc(100vh - 64px)`,
          overflow: "hidden",
        }}
      >
        {/* Left sub-nav */}
        <Box
          component="nav"
          aria-label={rootLabel}
          sx={{
            width: leftWidth,
            flexShrink: 0,
            height: "100%",
            overflowY: "auto",
            borderRight: "1px solid rgba(0,0,0,0.12)",
            p: 0.75,
          }}
        >
          <List disablePadding sx={{ p: 0.5 }}>
            {items.map((item) => {
              const active = item.id === selectedId;

              return (
                <ListItemButton
                  key={item.id}
                  selected={active}
                  onClick={() => onSelect?.(item.id)}
                  sx={{
                    mb: 0.5,
                    "&.Mui-selected": { bgcolor: "rgba(111,83,255,0.10)" },
                    "&.Mui-selected:hover": {
                      bgcolor: "rgba(111,83,255,0.14)",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    p: 1,
                    borderRadius: 1.5,
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{ m: 0, flex: 1, minWidth: 0 }}
                    primaryTypographyProps={{
                      fontSize: 14,
                    }}
                  />

                  {typeof item.count === "number" && (
                    <Box sx={{ flexShrink: 0 }}>
                      <Chip
                        label={formatCount(item.count)}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: 12,
                          fontWeight: 600,
                          bgcolor: active ? blueGrey[700] : "rgba(0,0,0,0.08)",
                          color: active ? "#fff" : "inherit",
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </Box>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Right content */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            // Leaf pages render a fixed toolbar followed by a table/content
            // area (e.g. <Toolbar /><Table />); only the last one should
            // grow and own its scrolling, so the toolbar (and, inside a
            // DataTable, its pagination footer) stay pinned in place.
            "& > *:not(:last-child)": { flexShrink: 0 },
            "& > *:last-child": { flex: 1, minHeight: 0, overflow: "hidden" },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
