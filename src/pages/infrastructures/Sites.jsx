import { Suspense, lazy, useMemo, useState } from "react";
import { FileDownload } from "@mui/icons-material";
import InfrastructuresToolbar from "./components/InfrastructuresToolbar";
import InfrastructuresTable from "./components/InfrastructuresTable";
import { infrastructureStore } from "./hooks/useInfrastructureData";
import { SITE_TYPE_ON_PREM } from "./hooks/siteStatus";

// Only loaded once someone actually starts adding a cloud site.
const AddCloudSiteDialog = lazy(() => import("./components/cloudSite/AddCloudSiteDialog"));

const SECONDARY_ACTION = { label: "Download Gateway", icon: <FileDownload /> };

export default function Sites() {
  const [cloudSiteOpen, setCloudSiteOpen] = useState(false);

  // "Add Site" opens a menu: an on-prem site uses the add form with its type
  // preselected; a cloud site starts the guided "Add Cloud Site" wizard.
  const addMenuItems = useMemo(
    () => [
      { label: "Add Site", onClick: () => infrastructureStore.openAdd({ siteType: SITE_TYPE_ON_PREM }) },
      { label: "Add Cloud Site", onClick: () => setCloudSiteOpen(true) },
    ],
    [],
  );

  return (
    <>
      <InfrastructuresToolbar
        addLabel="Add Site"
        searchPlaceholder="Search site"
        secondaryAction={SECONDARY_ACTION}
        showColumnsButton={false}
        addMenuItems={addMenuItems}
        addMenuAlign="right"
        showAddMenuIcon={false}
      />
      <InfrastructuresTable />
      {cloudSiteOpen && (
        <Suspense fallback={null}>
          <AddCloudSiteDialog open={cloudSiteOpen} onClose={() => setCloudSiteOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
