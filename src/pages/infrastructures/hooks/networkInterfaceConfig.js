// Pure rules for the ACRS Networks tab's "Configure Network" flow. Kept free
// of React so the label/action matrix can be unit-tested on its own.

// Where the Configure Network modal was opened from. The modal needs this
// (alongside the interface's connection state) to pick its primary button.
export const ENTRY_POINT = Object.freeze({
  CONNECT: "connect",
  CONFIGURE: "configure",
});

export const SUBMIT_ACTION = Object.freeze({
  SAVE: "save",
  SAVE_AND_CONNECT: "save-and-connect",
  SAVE_AND_RECONNECT: "save-and-reconnect",
});

export const SUBMIT_LABEL = Object.freeze({
  [SUBMIT_ACTION.SAVE]: "Save",
  [SUBMIT_ACTION.SAVE_AND_CONNECT]: "Save & Connect",
  [SUBMIT_ACTION.SAVE_AND_RECONNECT]: "Save & Reconnect",
});

export const RECONNECT_WARNING = "Applying these changes will briefly disconnect this interface.";

export const DISCONNECT_SESSION_WARNING = "Disconnecting this interface may end your current session. Continue?";
const DISCONNECT_CONFIRMATION = "This interface will go offline until it is connected again. Continue?";

// Every disconnect is confirmed; the interface the admin's session is routed
// through gets the stronger "may end your session" wording.
export function getDisconnectDescription(nic) {
  return nic?.managementSession ? DISCONNECT_SESSION_WARNING : DISCONNECT_CONFIRMATION;
}

/**
 * Whether a NIC has usable network settings: the selected protocol is on
 * DHCP, or is manual with an IP address. A newly added device has neither,
 * so Connect has to collect a config first instead of bringing the link up.
 */
export function hasNetworkConfig(nic) {
  const active = nic[nic.tcpIpType ?? "ipv4"];
  return active?.mode === "dhcp" || Boolean(active?.ipAddress);
}

// Per-protocol fields that only take effect after the link cycles: IP
// address, network mask, default gateway, DNS servers and the DHCP/manual
// toggle. Link speed/duplex is deliberately absent — it applies live.
const RECONNECT_PROTOCOL_FIELDS = [
  "mode",
  "ipAddress",
  "networkMask",
  "defaultGateway",
  "primaryDnsServer",
  "secondaryDnsServer",
];

const PROTOCOLS = ["ipv4", "ipv6"];

/**
 * Whether saving `next` over `previous` needs the link to cycle. Covers the
 * IPv4/IPv6 toggle plus every reconnect-requiring field of both protocol
 * blocks (an edit to the inactive protocol still changes saved config, so
 * it errs on the side of applying it).
 */
export function requiresReconnect(previous, next) {
  if ((previous.tcpIpType ?? "ipv4") !== (next.tcpIpType ?? "ipv4")) return true;

  return PROTOCOLS.some((protocol) =>
    RECONNECT_PROTOCOL_FIELDS.some(
      (field) => (previous[protocol]?.[field] ?? "") !== (next[protocol]?.[field] ?? ""),
    ),
  );
}

/**
 * The modal's primary action for a given entry point, connection state and
 * whether the pending edits are reconnect-requiring.
 */
export function resolveSubmitAction({ entryPoint, connected, reconnectRequired }) {
  if (connected) {
    return reconnectRequired ? SUBMIT_ACTION.SAVE_AND_RECONNECT : SUBMIT_ACTION.SAVE;
  }
  return entryPoint === ENTRY_POINT.CONNECT ? SUBMIT_ACTION.SAVE_AND_CONNECT : SUBMIT_ACTION.SAVE;
}
