import { ENDPOINTS } from "../../../api/endpoints";
import { createResourceStore, useResourceStore } from "../../../api/createResourceStore";

export const columns = [
  { field: "setting_name", headerName: "Setting", flex: 1.5 },
  { field: "category", headerName: "Category", flex: 1 },
  { field: "value", headerName: "Value", flex: 1 },
  {
    field: "updated_at",
    headerName: "Updated",
    flex: 1,
    valueGetter: (value) => (value ? new Date(value) : null),
    type: "dateTime",
  },
];

export const fields = [
  { field: "setting_name", label: "Setting", type: "text" },
  { field: "category", label: "Category", type: "text" },
  { field: "value", label: "Value", type: "text" },
  { field: "updated_at", label: "Updated", type: "datetime" },
];

export const settingsStore = createResourceStore(ENDPOINTS.SETTINGS);

export function useSettingsData(selector) {
  return useResourceStore(settingsStore, selector);
}
