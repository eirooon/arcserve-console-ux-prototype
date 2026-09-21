import { useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormField from "../../../../components/FormField";
import PlaceholderSelect from "../../../../components/PlaceholderSelect";
import { useDirtyState } from "../../../../hooks/useDirtyState";
import {
  ENTRY_POINT,
  RECONNECT_WARNING,
  SUBMIT_ACTION,
  SUBMIT_LABEL,
  hasNetworkConfig,
  requiresReconnect,
  resolveSubmitAction,
} from "../../hooks/networkInterfaceConfig";

const LINK_SPEED_OPTIONS = [
  "Auto Negotiation",
  "10 Mbps Half Duplex",
  "10 Mbps Full Duplex",
  "100 Mbps Half Duplex",
  "100 Mbps Full Duplex",
  "1.0 Gbps Full Duplex",
];

// Example values shown in empty address fields (until the admin types). Mask
// is a prefix length for IPv6.
const FIELD_PLACEHOLDERS = {
  ipv4: {
    ipAddress: "e.g. 192.168.1.10",
    networkMask: "e.g. 255.255.255.0",
    defaultGateway: "e.g. 192.168.1.1",
    primaryDnsServer: "e.g. 8.8.8.8",
    secondaryDnsServer: "e.g. 8.8.4.4",
  },
  ipv6: {
    ipAddress: "e.g. 2001:db8::10",
    networkMask: "e.g. 64",
    defaultGateway: "e.g. 2001:db8::1",
    primaryDnsServer: "e.g. 2001:4860:4860::8888",
    secondaryDnsServer: "e.g. 2001:4860:4860::8844",
  },
};

// Placeholder text in a muted secondary color at full opacity (MUI's default
// 0.42 opacity falls short of WCAG AA contrast).
const PLACEHOLDER_SX = { "& input::placeholder": { color: "text.secondary", opacity: 1 } };

const EMPTY_PROTOCOL_CONFIG = {
  mode: "manual",
  ipAddress: "",
  networkMask: "",
  defaultGateway: "",
  primaryDnsServer: "",
  secondaryDnsServer: "",
};

// Holds the form state. Rendered only while a NIC is being configured (see
// the `nic &&` guard below), so it mounts fresh — seeded straight from that
// NIC's current settings — every time "Configure" is clicked, the same
// reasoning as EntityFormDialog's inner form body.
function ConfigureNetworkForm({ nic, entryPoint, onClose, onSave, saving }) {
  const { dirty, track } = useDirtyState();
  const [tcpIpType, setTcpIpType] = useState(nic.tcpIpType ?? "ipv4");
  const [protocolConfig, setProtocolConfig] = useState({
    ipv4: { ...EMPTY_PROTOCOL_CONFIG, ...nic.ipv4 },
    ipv6: { ...EMPTY_PROTOCOL_CONFIG, ...nic.ipv6 },
  });
  const [linkSpeed, setLinkSpeed] = useState(nic.linkSpeed ?? LINK_SPEED_OPTIONS[0]);
  const changeTcpIpType = track(setTcpIpType);
  const changeProtocolConfig = track(setProtocolConfig);
  const changeLinkSpeed = track(setLinkSpeed);

  const activeConfig = protocolConfig[tcpIpType];
  const isManual = activeConfig.mode === "manual";

  const draftNic = { ...nic, tcpIpType, ipv4: protocolConfig.ipv4, ipv6: protocolConfig.ipv6, linkSpeed };
  const submitAction = resolveSubmitAction({
    entryPoint,
    connected: Boolean(nic.connected),
    reconnectRequired: requiresReconnect(nic, draftNic),
  });
  // Plain "Save" waits for an edit; the connect/reconnect variants do real
  // work on the link, so they stay available even before anything changes.
  // Connecting additionally needs usable settings (DHCP, or an IP address).
  const canSubmit =
    !saving &&
    (dirty || submitAction !== SUBMIT_ACTION.SAVE) &&
    (submitAction !== SUBMIT_ACTION.SAVE_AND_CONNECT || hasNetworkConfig(draftNic));

  // Shared props for the five address/DNS inputs. Placeholders only show
  // while the field is editable — under DHCP the values are assigned.
  const addressFieldProps = (field) => ({
    size: "small",
    fullWidth: true,
    disabled: !isManual,
    value: activeConfig[field],
    placeholder: isManual ? FIELD_PLACEHOLDERS[tcpIpType][field] : undefined,
    onChange: (event) => setActiveField(field, event.target.value),
    sx: PLACEHOLDER_SX,
  });

  const setActiveField = (field, value) => {
    changeProtocolConfig((current) => ({
      ...current,
      [tcpIpType]: { ...current[tcpIpType], [field]: value },
    }));
  };

  const handleClear = () => {
    changeProtocolConfig((current) => ({
      ...current,
      [tcpIpType]: {
        ...current[tcpIpType],
        ipAddress: "",
        networkMask: "",
        defaultGateway: "",
        primaryDnsServer: "",
        secondaryDnsServer: "",
      },
    }));
  };

  const handleSave = () => {
    if (!canSubmit) return;
    onSave(draftNic, submitAction);
  };

  return (
    <>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2 }}>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Configure Network - {nic.name}
        </Typography>
        <IconButton onClick={onClose} aria-label="Close dialog" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Stack direction="row" spacing={2}>
          <FormField label="TCP/IP Type">
            <RadioGroup row value={tcpIpType} onChange={(event) => changeTcpIpType(event.target.value)}>
              <FormControlLabel value="ipv4" control={<Radio />} label="IPV4" />
              <FormControlLabel value="ipv6" control={<Radio />} label="IPV6" />
            </RadioGroup>
          </FormField>
          <FormField label={`Configure ${tcpIpType === "ipv4" ? "IPv4" : "IPv6"}`}>
            <RadioGroup
              row
              value={activeConfig.mode}
              onChange={(event) => setActiveField("mode", event.target.value)}
            >
              <FormControlLabel value="manual" control={<Radio />} label="Manually" />
              <FormControlLabel value="dhcp" control={<Radio />} label="Using DHCP" />
            </RadioGroup>
          </FormField>
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormField label="Hostname" sx={{ flex: 1 }}>
            <TextField size="small" fullWidth disabled value={nic.hostname ?? ""} />
          </FormField>
          <FormField label="MAC Address" sx={{ flex: 1 }}>
            <TextField size="small" fullWidth disabled value={nic.macAddress ?? ""} />
          </FormField>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <FormField label="IP Address">
            <TextField {...addressFieldProps("ipAddress")} />
          </FormField>
          <FormField label="Network Mask">
            <TextField {...addressFieldProps("networkMask")} />
          </FormField>
          <FormField label="Default Gateway">
            <TextField {...addressFieldProps("defaultGateway")} />
          </FormField>
        </Stack>

        <Divider />

        <Stack direction="row" spacing={2}>
          <FormField label="Primary DNS Server" sx={{ flex: 1 }}>
            <TextField {...addressFieldProps("primaryDnsServer")} />
          </FormField>
          <FormField label="Secondary DNS Server" sx={{ flex: 1 }}>
            <TextField {...addressFieldProps("secondaryDnsServer")} />
          </FormField>
        </Stack>

        <Divider />

        <FormField label="Link Speed and Duplex Settings">
          <PlaceholderSelect
            size="small"
            fullWidth
            placeholder="Select link speed"
            value={linkSpeed}
            onChange={(event) => changeLinkSpeed(event.target.value)}
          >
            {LINK_SPEED_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </PlaceholderSelect>
        </FormField>

        {submitAction === SUBMIT_ACTION.SAVE_AND_RECONNECT && (
          <Alert severity="warning">{RECONNECT_WARNING}</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1, justifyContent: "space-between" }}>
        <Button color="secondary" disabled>
          Help
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClear}
            disabled={saving || !isManual}
          >
            Clear
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={!canSubmit}>
            {SUBMIT_LABEL[submitAction]}
          </Button>
        </Stack>
      </DialogActions>
    </>
  );
}

const nicPropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  hostname: PropTypes.string,
  macAddress: PropTypes.string,
  tcpIpType: PropTypes.oneOf(["ipv4", "ipv6"]),
  ipv4: PropTypes.object,
  ipv6: PropTypes.object,
  linkSpeed: PropTypes.string,
  connected: PropTypes.bool,
});

ConfigureNetworkForm.propTypes = {
  nic: nicPropType.isRequired,
  entryPoint: PropTypes.oneOf(Object.values(ENTRY_POINT)).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

/**
 * "Configure Network" modal (Figma nodes 7290:18992 / 7301:4927): one dialog
 * covers both IPv4 and IPv6 for a NIC — the "TCP/IP Type" radio switches
 * which protocol's fields are shown, each with its own Manually/Using DHCP
 * mode that enables or disables the address fields below it.
 *
 * The primary button adapts to `entryPoint` (Connect vs Configure), the NIC's
 * `connected` state and whether the edits need the link to cycle — see
 * `resolveSubmitAction`. `onSave(updatedNic, action)` receives the resolved
 * `SUBMIT_ACTION` so the caller knows whether to connect or reconnect.
 */
export default function ConfigureNetworkDialog({ nic, entryPoint = ENTRY_POINT.CONFIGURE, onClose, onSave, saving }) {
  return (
    <Dialog open={Boolean(nic)} onClose={onClose} maxWidth="sm" fullWidth>
      {nic && (
        <ConfigureNetworkForm
          nic={nic}
          entryPoint={entryPoint}
          onClose={onClose}
          onSave={onSave}
          saving={saving}
        />
      )}
    </Dialog>
  );
}

ConfigureNetworkDialog.propTypes = {
  nic: nicPropType,
  entryPoint: PropTypes.oneOf(Object.values(ENTRY_POINT)),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};
