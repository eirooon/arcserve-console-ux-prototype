import { Box } from "@mui/material";

// MuiDataGrid-cell is display:block, not flex, so custom renderCell content
// doesn't get vertically centered for free — center it explicitly here.
export default function DataGridCellContent({ justifyContent = "flex-start", children }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent, height: "100%", width: "100%" }}>
      {children}
    </Box>
  );
}
