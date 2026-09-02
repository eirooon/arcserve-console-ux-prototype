import { FileDownload } from "@mui/icons-material";
import InfrastructuresToolbar from "./components/InfrastructuresToolbar";
import InfrastructuresTable from "./components/InfrastructuresTable";

export default function Hypervisors() {
  return (
    <>
      <InfrastructuresToolbar
        secondaryAction={{
          label: "Download VMware Appliance (.OVA)",
          icon: <FileDownload />,
        }}
      />
      <InfrastructuresTable />
    </>
  );
}
