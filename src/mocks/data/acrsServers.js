// Mock data for the Arcserve Cyber Resilient Servers (ACRS) infrastructure
// page — Figma "UXD-16 CRS Management" file, nodes 7290:18391 (list),
// 7283:9445 / 7284:17735 (device details tabs) and 7290:18992 / 7301:4927
// (network configuration dialogs).
function buildNetworkInterface({
  id,
  name,
  description,
  connected,
  managementSession,
  ipAddress,
  macAddress,
  unconfigured,
}) {
  return {
    id,
    name,
    description,
    connected,
    managementSession,
    hostname: "SampleHostname123456",
    macAddress,
    tcpIpType: "ipv4",
    ipv4: unconfigured
      ? { mode: "manual", ipAddress: "", networkMask: "", defaultGateway: "", primaryDnsServer: "", secondaryDnsServer: "" }
      : {
          mode: "manual",
          ipAddress,
          networkMask: "255.255.255.0",
          defaultGateway: "192.168.20.1",
          primaryDnsServer: "192.168.20.122",
          secondaryDnsServer: "192.168.20.21",
        },
    ipv6: {
      mode: "manual",
      ipAddress: "",
      networkMask: "",
      defaultGateway: "",
      primaryDnsServer: "",
      secondaryDnsServer: "",
    },
    // Empty (not undefined) so the modal shows its placeholder rather than
    // falling back to the first option.
    linkSpeed: unconfigured ? "" : "100 Mbps Full Duplex",
  };
}

// Every ACRS server gets this same set of example adapters (Figma "UXD-16
// CRS Management", node 7284:17767) — only the id/IP/MAC are per-server so
// each device's Networks tab has distinct, non-colliding identifiers.
const SAMPLE_NETWORK_INTERFACES = [
  {
    name: "Ethernet0",
    description: "Intel® 82574L Gigabit Network Connection",
    connected: true,
    // The adapter the admin's console session is routed through — disconnecting
    // it asks for confirmation first.
    managementSession: true,
  },
  { name: "Ethernet2", description: "Broadcom NetXtreme BCM5720 Gigabit Ethernet", connected: false },
  { name: "Ethernet3", description: "Realtek PCIe GbE Family Controller", connected: false },
  { name: "Ethernet4", description: "Intel® X550-T2 10GbE Network Adapter", connected: true },
  { name: "Ethernet5", description: "Intel® X710-DA2 10GbE SFP+ Adapter", connected: false },
  { name: "Ethernet6", description: "Mellanox ConnectX-5 25GbE Adapter", connected: false },
  { name: "Wi-Fi", description: "Intel® Wi-Fi 6E AX211 160MHz", connected: true },
  { name: "Wi-Fi 2", description: "Qualcomm Atheros QCA6174 802.11ac", connected: false },
  { name: "Wi-Fi 3", description: "Realtek RTL8822CE 802.11ac PCIe Adapter", connected: false },
  { name: "vEthernet (Default)", description: "Hyper-V Virtual Ethernet Adapter", connected: true },
  { name: "vEthernet (WSL)", description: "Hyper-V Virtual Ethernet Adapter #2", connected: true },
  { name: "VMware Network Adapter VMnet1", description: "VMware Virtual Ethernet Adapter", connected: false },
  {
    name: "VMware Network Adapter VMnet8",
    description: "VMware Virtual Ethernet Adapter (NAT)",
    connected: false,
  },
  { name: "VirtualBox Host-Only", description: "VirtualBox Host-Only Ethernet Adapter", connected: false },
  { name: "OpenVPN TAP", description: "TAP-Windows Adapter V9", connected: true },
  { name: "WireGuard Tunnel", description: "WireGuard Tunnel Interface", connected: false },
  { name: "Tailscale", description: "Tailscale Tunnel Interface", connected: true },
  { name: "Cisco AnyConnect", description: "Cisco AnyConnect Secure Mobility Client", connected: false },
  {
    name: "Bluetooth Network Connection",
    description: "Bluetooth Device (Personal Area Network)",
    connected: false,
  },
  { name: "Docker (veth0)", description: "Docker Virtual Ethernet Bridge", connected: true },
  { name: "Loopback Pseudo-Interface 1", description: "Software Loopback Interface 1", connected: true },
  { name: "Teredo Tunneling", description: "Microsoft Teredo Tunneling Adapter", connected: false },
];

export function buildSampleNetworkInterfaces(serverId, ipOctet3, { allDisconnected = false, unconfigured = false } = {}) {
  return SAMPLE_NETWORK_INTERFACES.map((nic, index) =>
    buildNetworkInterface({
      id: `${serverId}-nic-${index}`,
      name: nic.name,
      description: nic.description,
      connected: allDisconnected ? false : nic.connected,
      managementSession: !allDisconnected && Boolean(nic.managementSession),
      unconfigured,
      ipAddress: `192.168.${ipOctet3}.${101 + index}`,
      macAddress: `AA:BB:CC:DD:${ipOctet3.toString(16).toUpperCase().padStart(2, "0")}:${(index + 1)
        .toString(16)
        .toUpperCase()
        .padStart(2, "0")}`,
    }),
  );
}

export const acrsServers = [
  {
    id: "acrs-server-1",
    displayName: "sample-acrs-server-1",
    status: "Pending",
    hostnameIp: "192.169.2.3",
    site: "vcenter-hq-01",
    username: "admin",
    storageUsedGb: 1280,
    storageTotalGb: 2000,
    createdDate: "2024-12-26T09:20:00",
    fileSystems: [
      {
        id: "acrs-server-1-fs-0",
        name: "File System A",
        pool: "Pool 1",
        status: "Mounted",
        free: "280 GB",
        poolUsage: "53%",
        used: "320 GB",
        recoveryPointServer: "Sample RPS Name",
        dataStore: "Sample Data Store Name",
      },
      {
        id: "acrs-server-1-fs-1",
        name: "File System B",
        pool: "Pool 2",
        status: "Unmounted",
        free: "280 GB",
        poolUsage: "53%",
        used: "320 GB",
        recoveryPointServer: "Sample RPS Name",
        dataStore: "Sample Data Store Name",
      },
    ],
    networkInterfaces: buildSampleNetworkInterfaces("acrs-server-1", 20),
  },
  {
    id: "acrs-server-2",
    displayName: "sample-acrs-server-2",
    status: "Pending",
    hostnameIp: "192.169.2.3",
    site: "hyperv-east-01",
    username: "admin",
    storageUsedGb: 1280,
    storageTotalGb: 2000,
    createdDate: "2024-12-26T09:20:00",
    fileSystems: [],
    networkInterfaces: buildSampleNetworkInterfaces("acrs-server-2", 30),
  },
];
