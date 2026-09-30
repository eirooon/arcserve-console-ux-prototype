import { createSplitLayout } from "../../layout/createSplitLayout";
import { useInfrastructureCounts } from "./hooks/useInfrastructureData";

const InfrastructuresLayout = createSplitLayout({
  parentPath: "/infrastructures",
  rootLabel: "Infrastructures",
  defaultId: "all",
  useCounts: useInfrastructureCounts,
});

export default InfrastructuresLayout;
