import { FileDownload } from "@mui/icons-material";
import InfrastructuresToolbar from "./components/InfrastructuresToolbar";
import InfrastructuresTable from "./components/InfrastructuresTable";

export default function Sites() {
  return (
    <>
      <InfrastructuresToolbar
        secondaryAction={{ label: "Download Gateway", icon: <FileDownload /> }}
        showColumnsButton={false}
      />
      <InfrastructuresTable />
    </>
  );
}
