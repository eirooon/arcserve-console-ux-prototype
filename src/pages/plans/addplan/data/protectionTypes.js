// Protection type options for the Add Plan "Basic" step (see Figma node
// 6218:11486). Each id is also used as the new plan's `policy_type` label
// once selected, so it must stay a human-readable string.
export const PROTECTION_TYPES = [
  {
    id: "agent_windows",
    label: "Agent-based Windows Backup",
    description: "Volume-level snapshot backup of Windows source.",
  },
  {
    id: "agent_linux",
    label: "Agent-based Linux Backup",
    description: "Volume-level snapshot backup of Linux source.",
  },
  {
    id: "unc_nfs",
    label: "UNC/NFS Backup",
    description: "File and Folder backup",
  },
  {
    id: "agentless_vm",
    label: "Agentless VM Backup",
    description: "Hypervisor-based backup of VMs",
  },
  {
    id: "agentless_cloud",
    label: "Agentless Cloud Backup",
    description: "Backup cloud resources such as Cloud VM.",
  },
  {
    id: "oracle_database",
    label: "Oracle Database Backup",
    description:
      "Backup of all data-files and the control file that constitute an Oracle database.",
  },
  {
    id: "remote_rps_copy",
    label: "Copy from remotely-managed RPS",
    description: "Receive copies of backups from a remote Recovery Point Server.",
  },
  {
    id: "agent_cloud_direct",
    label: "Agent-based Backup Directly to Arcserve Cloud",
    description: "Backup of Windows and Linux sources to the Arcserve Cloud",
  },
  {
    id: "agent_cloud_dr",
    label: "Agent-based Backup to Arcserve Cloud for Disaster Recovery",
    description:
      "Backup of Windows sources directly to the Arcserve Cloud for cloud disaster recovery.",
  },
];
