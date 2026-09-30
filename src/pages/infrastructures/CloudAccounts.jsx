import { Suspense, lazy, useMemo, useState } from "react";
import InfrastructuresToolbar from "./components/InfrastructuresToolbar";
import InfrastructuresTable from "./components/InfrastructuresTable";
import { infrastructureStore } from "./hooks/useInfrastructureData";
import { CLOUD_SERVICES } from "./hooks/cloudServices";

// Only loaded once someone actually picks Microsoft Azure.
const AzureCloudAccountWizard = lazy(() => import("./components/azure/AzureCloudAccountWizard"));

// Services with a dedicated guided setup; the rest use the generic add form.
const GUIDED_SERVICE = "Microsoft Azure";

export default function CloudAccounts() {
  const [azureWizardOpen, setAzureWizardOpen] = useState(false);

  // "Add Cloud Account" opens a menu of cloud services; Microsoft Azure
  // starts the sign-in wizard, every other service opens the add form with
  // that service preselected.
  const addMenuItems = useMemo(
    () =>
      CLOUD_SERVICES.map((cloudService) => ({
        label: cloudService,
        onClick:
          cloudService === GUIDED_SERVICE
            ? () => setAzureWizardOpen(true)
            : () => infrastructureStore.openAdd({ cloudService }),
      })),
    [],
  );

  return (
    <>
      <InfrastructuresToolbar
        searchPlaceholder="Search cloud account"
        addMenuItems={addMenuItems}
        addMenuAlign="right"
        showAddMenuIcon={false}
      />
      <InfrastructuresTable />
      {azureWizardOpen && (
        <Suspense fallback={null}>
          <AzureCloudAccountWizard open={azureWizardOpen} onClose={() => setAzureWizardOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
