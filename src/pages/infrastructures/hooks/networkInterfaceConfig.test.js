import { describe, expect, it } from "vitest";
import {
  ENTRY_POINT,
  SUBMIT_ACTION,
  hasNetworkConfig,
  requiresReconnect,
  resolveSubmitAction,
} from "./networkInterfaceConfig";

const baseNic = {
  tcpIpType: "ipv4",
  linkSpeed: "Auto Negotiation",
  ipv4: {
    mode: "manual",
    ipAddress: "192.168.20.101",
    networkMask: "255.255.255.0",
    defaultGateway: "192.168.20.1",
    primaryDnsServer: "192.168.20.122",
    secondaryDnsServer: "192.168.20.21",
  },
  ipv6: { mode: "manual", ipAddress: "" },
};

describe("requiresReconnect", () => {
  it("is false when nothing changed", () => {
    expect(requiresReconnect(baseNic, { ...baseNic })).toBe(false);
  });

  it("is false when only link speed/duplex changed", () => {
    expect(requiresReconnect(baseNic, { ...baseNic, linkSpeed: "1.0 Gbps Full Duplex" })).toBe(false);
  });

  it.each([
    ["ipAddress", "10.0.0.5"],
    ["networkMask", "255.255.0.0"],
    ["defaultGateway", "10.0.0.1"],
    ["primaryDnsServer", "8.8.8.8"],
    ["secondaryDnsServer", "8.8.4.4"],
    ["mode", "dhcp"],
  ])("is true when %s changed", (field, value) => {
    expect(requiresReconnect(baseNic, { ...baseNic, ipv4: { ...baseNic.ipv4, [field]: value } })).toBe(true);
  });

  it("is true when the IPv4/IPv6 toggle changed", () => {
    expect(requiresReconnect(baseNic, { ...baseNic, tcpIpType: "ipv6" })).toBe(true);
  });
});

describe("resolveSubmitAction", () => {
  it.each([
    [ENTRY_POINT.CONNECT, false, false, SUBMIT_ACTION.SAVE_AND_CONNECT],
    [ENTRY_POINT.CONNECT, false, true, SUBMIT_ACTION.SAVE_AND_CONNECT],
    [ENTRY_POINT.CONFIGURE, false, false, SUBMIT_ACTION.SAVE],
    [ENTRY_POINT.CONFIGURE, false, true, SUBMIT_ACTION.SAVE],
    [ENTRY_POINT.CONFIGURE, true, false, SUBMIT_ACTION.SAVE],
    [ENTRY_POINT.CONFIGURE, true, true, SUBMIT_ACTION.SAVE_AND_RECONNECT],
  ])("entry=%s connected=%s reconnectRequired=%s -> %s", (entryPoint, connected, reconnectRequired, expected) => {
    expect(resolveSubmitAction({ entryPoint, connected, reconnectRequired })).toBe(expected);
  });
});

describe("hasNetworkConfig", () => {
  it("is true for a manual config with an IP address", () => {
    expect(hasNetworkConfig(baseNic)).toBe(true);
  });

  it("is true when the selected protocol uses DHCP", () => {
    expect(hasNetworkConfig({ ...baseNic, ipv4: { mode: "dhcp", ipAddress: "" } })).toBe(true);
  });

  it("is false for a manual config with no IP address (newly added device)", () => {
    expect(hasNetworkConfig({ ...baseNic, ipv4: { mode: "manual", ipAddress: "" } })).toBe(false);
  });

  it("looks at the selected protocol only", () => {
    expect(hasNetworkConfig({ ...baseNic, tcpIpType: "ipv6" })).toBe(false);
  });
});
