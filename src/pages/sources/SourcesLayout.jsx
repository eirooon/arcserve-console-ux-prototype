import { createSplitLayout } from "../../layout/createSplitLayout";
import { useSourceCounts } from "./hooks/useSourceData";

const SourcesLayout = createSplitLayout({
  parentPath: "/sources",
  rootLabel: "Sources",
  defaultId: "all",
  useCounts: useSourceCounts,
});

export default SourcesLayout;
