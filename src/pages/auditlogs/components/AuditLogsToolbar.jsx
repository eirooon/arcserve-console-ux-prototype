import { FileDownload } from "@mui/icons-material";
import ListToolbar from "../../../components/ListToolbar";
import { useAuditLogsData } from "../hooks/useAuditLogsData";

const selectApiRef = (state) => state.apiRef;

export default function AuditLogsToolbar() {
  const apiRef = useAuditLogsData(selectApiRef);
  return (
    <ListToolbar
      showSearch
      searchPlaceholder="Search audit logs"
      secondaryAction={{ label: "Export", icon: <FileDownload /> }}
      apiRef={apiRef}
      sx={{ backgroundColor: "background.paper" }}
    />
  );
}
