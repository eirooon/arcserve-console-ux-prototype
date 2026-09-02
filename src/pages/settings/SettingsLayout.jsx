import { createSplitLayout } from "../../layout/createSplitLayout";

const SettingsLayout = createSplitLayout({
  parentPath: "/settings",
  rootLabel: "Settings",
  defaultId: "all",
});

export default SettingsLayout;
