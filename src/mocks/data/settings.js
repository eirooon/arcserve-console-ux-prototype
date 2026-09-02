// NOTE: In the legacy app, "settings" is several distinct screens
// (branding, source discovery, default deployment, ArcGenie linking) rather
// than one grid — see /configure/settings/* in
// arcservedev-cloudconsole_frontend/src/routes/router.config.js. This
// generic list is a placeholder until the redesign settles on a layout for
// this page; it may not remain a DataGrid at all.
export const settings = [
  {
    id: "set-001",
    setting_name: "Source Discovery",
    category: "Configuration",
    value: "Active Directory",
    updated_at: "2026-08-10T09:00:00.000Z",
  },
  {
    id: "set-002",
    setting_name: "Default Deployment Region",
    category: "Configuration",
    value: "US East",
    updated_at: "2026-07-22T11:30:00.000Z",
  },
  {
    id: "set-003",
    setting_name: "Branding",
    category: "Appearance",
    value: "Arcserve Default",
    updated_at: "2026-06-01T15:00:00.000Z",
  },
];
