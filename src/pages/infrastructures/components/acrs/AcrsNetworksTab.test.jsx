import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apiClient } from "../../../../api/client";
import AcrsNetworksTab from "./AcrsNetworksTab";
import ConfigureNetworkDialog from "./ConfigureNetworkDialog";

vi.mock("../../../../api/client", () => ({ apiClient: { put: vi.fn() } }));
vi.mock("../../hooks/useAcrsServersData", () => ({ acrsServersStore: { refetch: vi.fn() } }));

const buildNic = (overrides) => ({
  hostname: "host",
  macAddress: "AA:BB:CC:DD:EE:01",
  tcpIpType: "ipv4",
  ipv4: {
    mode: "manual",
    ipAddress: "192.168.20.101",
    networkMask: "255.255.255.0",
    defaultGateway: "192.168.20.1",
    primaryDnsServer: "192.168.20.122",
    secondaryDnsServer: "192.168.20.21",
  },
  ipv6: { mode: "manual", ipAddress: "" },
  linkSpeed: "Auto Negotiation",
  ...overrides,
});

const server = {
  id: "acrs-server-1",
  networkInterfaces: [
    buildNic({ id: "nic-0", name: "Ethernet0", connected: true, managementSession: true }),
    buildNic({ id: "nic-1", name: "Ethernet2", connected: false }),
    buildNic({ id: "nic-2", name: "Ethernet4", connected: true }),
    // A newly added device's interface: nothing configured yet.
    buildNic({
      id: "nic-3",
      name: "Ethernet5",
      connected: false,
      ipv4: { mode: "manual", ipAddress: "", networkMask: "", defaultGateway: "", primaryDnsServer: "", secondaryDnsServer: "" },
      linkSpeed: "",
    }),
  ],
};

const putNics = (callIndex = 0) => apiClient.put.mock.calls[callIndex][1].networkInterfaces;
const nicByName = (nics, name) => nics.find((nic) => nic.name === name);
const setup = () => {
  const user = userEvent.setup();
  render(<AcrsNetworksTab server={server} />);
  return user;
};

beforeEach(() => {
  vi.clearAllMocks();
  apiClient.put.mockResolvedValue({});
});

describe("Networks tab interface controls", () => {
  it("shows an enabled Configure button in both connection states", () => {
    setup();
    expect(screen.getByRole("button", { name: "Configure Ethernet0" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Configure Ethernet2" })).toBeEnabled();
  });

  it("connects a disconnected interface immediately with no modal", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Connect Ethernet2" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(apiClient.put).toHaveBeenCalledTimes(1));
    expect(nicByName(putNics(), "Ethernet2").connected).toBe(true);
  });

  it("confirms before disconnecting a non-session interface, without the session warning", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Disconnect Ethernet4" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).queryByText(/end your current session/)).not.toBeInTheDocument();
    expect(apiClient.put).not.toHaveBeenCalled();

    await user.click(within(dialog).getByRole("button", { name: "Disconnect" }));
    await waitFor(() => expect(apiClient.put).toHaveBeenCalledTimes(1));
    expect(nicByName(putNics(), "Ethernet4").connected).toBe(false);
  });

  it("asks for confirmation before disconnecting the session's interface", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Disconnect Ethernet0" }));

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText("Disconnecting this interface may end your current session. Continue?"),
    ).toBeInTheDocument();
    expect(apiClient.put).not.toHaveBeenCalled();

    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(apiClient.put).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Disconnect Ethernet0" }));
    await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Disconnect" }));

    await waitFor(() => expect(apiClient.put).toHaveBeenCalledTimes(1));
    expect(nicByName(putNics(), "Ethernet0").connected).toBe(false);
  });
});

describe("Connect on a newly added (unconfigured) interface", () => {
  it("opens the modal with Save & Connect instead of connecting, and connects on save", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Connect Ethernet5" }));

    const dialog = await screen.findByRole("dialog");
    expect(apiClient.put).not.toHaveBeenCalled();

    const saveAndConnect = within(dialog).getByRole("button", { name: "Save & Connect" });
    expect(saveAndConnect).toBeDisabled();

    await user.type(within(dialog).getByLabelText("IP Address"), "10.0.0.7");
    expect(saveAndConnect).toBeEnabled();
    await user.click(saveAndConnect);

    await waitFor(() => expect(apiClient.put).toHaveBeenCalledTimes(1));
    const saved = nicByName(putNics(), "Ethernet5");
    expect(saved).toMatchObject({ connected: true, ipv4: expect.objectContaining({ ipAddress: "10.0.0.7" }) });
  });

  it("does not connect when the modal is cancelled", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Connect Ethernet5" }));
    await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(apiClient.put).not.toHaveBeenCalled();
  });

  it("still shows plain Save when the same interface is opened via Configure", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Configure Ethernet5" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: "Save & Connect" })).not.toBeInTheDocument();
  });
});

describe("Configure Network modal", () => {
  it("saves a link-speed-only change on a connected interface without reconnecting", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Configure Ethernet4" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Save" })).toBeDisabled();

    await user.click(within(dialog).getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "1.0 Gbps Full Duplex" }));

    expect(within(dialog).queryByText(/briefly disconnect/)).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => expect(apiClient.put).toHaveBeenCalledTimes(1));
    const saved = nicByName(putNics(), "Ethernet4");
    expect(saved.linkSpeed).toBe("1.0 Gbps Full Duplex");
    expect(saved.connected).toBe(true);
  });

  it("warns and cycles the link when a reconnect-requiring field changes on a connected interface", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Configure Ethernet4" }));

    const dialog = await screen.findByRole("dialog");
    const ip = within(dialog).getByLabelText("IP Address");
    await user.clear(ip);
    await user.type(ip, "10.0.0.5");

    expect(within(dialog).getByText("Applying these changes will briefly disconnect this interface.")).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Save & Reconnect" }));

    await waitFor(() => expect(apiClient.put).toHaveBeenCalledTimes(2), { timeout: 3000 });
    const down = nicByName(putNics(0), "Ethernet4");
    const up = nicByName(putNics(1), "Ethernet4");
    expect(down).toMatchObject({ connected: false, ipv4: expect.objectContaining({ ipAddress: "10.0.0.5" }) });
    expect(up).toMatchObject({ connected: true, ipv4: expect.objectContaining({ ipAddress: "10.0.0.5" }) });
  });

  it("only saves — without connecting — when configuring a disconnected interface", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Configure Ethernet2" }));

    const dialog = await screen.findByRole("dialog");
    const ip = within(dialog).getByLabelText("IP Address");
    await user.clear(ip);
    await user.type(ip, "10.0.0.9");

    expect(within(dialog).queryByRole("button", { name: /Connect|Reconnect/ })).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => expect(apiClient.put).toHaveBeenCalledTimes(1));
    const saved = nicByName(putNics(), "Ethernet2");
    expect(saved.ipv4.ipAddress).toBe("10.0.0.9");
    expect(saved.connected).toBe(false);
  });
});

describe("ConfigureNetworkDialog entry point", () => {
  it("offers Save & Connect when opened from Connect on a disconnected interface", async () => {
    const onSave = vi.fn();
    render(
      <ConfigureNetworkDialog
        nic={buildNic({ id: "nic-1", name: "Ethernet2", connected: false })}
        entryPoint="connect"
        onClose={vi.fn()}
        onSave={onSave}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Save & Connect" }));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: "Ethernet2" }), "save-and-connect");
  });

  it("leaves editable fields empty with placeholders for a newly added device, keeping the read-only ones filled", () => {
    const blank = { mode: "manual", ipAddress: "", networkMask: "", defaultGateway: "", primaryDnsServer: "", secondaryDnsServer: "" };
    render(
      <ConfigureNetworkDialog
        nic={buildNic({ id: "nic-1", name: "Ethernet2", connected: false, ipv4: blank, linkSpeed: "" })}
        entryPoint="configure"
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Hostname")).toHaveValue("host");
    expect(screen.getByLabelText("MAC Address")).toHaveValue("AA:BB:CC:DD:EE:01");
    for (const label of ["IP Address", "Network Mask", "Default Gateway", "Primary DNS Server", "Secondary DNS Server"]) {
      const field = screen.getByLabelText(label);
      expect(field).toHaveValue("");
      expect(field).toHaveAttribute("placeholder", expect.stringMatching(/^e\.g\. /));
    }
    expect(screen.getByText("Select link speed")).toBeInTheDocument();
  });
});
