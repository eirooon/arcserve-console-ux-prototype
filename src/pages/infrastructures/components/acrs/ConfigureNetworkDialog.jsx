import { useState } from "react";
import PropTypes from "prop-types";
import {
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

const LINK_SPEED_OPTIONS = [
  "Auto Negotiation",
  "10 Mbps Half Duplex",
  "10 Mbps Full Duplex",
  "100 Mbps Half Duplex",
  "100 Mbps Full Duplex",
  "1.0 Gbps Full Duplex",
];

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
function ConfigureNetworkForm({ nic, onClose, onSave, saving }) {
  const [tcpIpType, setTcpIpType] = useState(nic.tcpIpType ?? "ipv4");
  const [protocolConfig, setProtocolConfig] = useState({
    ipv4: { ...EMPTY_PROTOCOL_CONFIG, ...nic.ipv4 },
    ipv6: { ...EMPTY_PROTOCOL_CONFIG, ...nic.ipv6 },
  });
  const [linkSpeed, setLinkSpeed] = useState(nic.linkSpeed ?? LINK_SPEED_OPTIONS[0]);

  const activeConfig = protocolConfig[tcpIpType];
  const isManual = activeConfig.mode === "manual";

  const setActiveField = (field, value) => {
    setProtocolConfig((current) => ({
      ...current,
      [tcpIpType]: { ...current[tcpIpType], [field]: value },
    }));
  };

  const handleClear = () => {
    setProtocolConfig((current) => ({
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
    onSave({ ...nic, tcpIpType, ipv4: protocolConfig.ipv4, ipv6: protocolConfig.ipv6, linkSpeed });
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
            <RadioGroup row value={tcpIpType} onChange={(event) => setTcpIpType(event.target.value)}>
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
            <TextField
              size="small"
              fullWidth
              disabled={!isManual}
              value={activeConfig.ipAddress}
              onChange={(event) => setActiveField("ipAddress", event.target.value)}
            />
          </FormField>
          <FormField label="Network Mask">
            <TextField
              size="small"
              fullWidth
              disabled={!isManual}
              value={activeConfig.networkMask}
              onChange={(event) => setActiveField("networkMask", event.target.value)}
            />
          </FormField>
          <FormField label="Default Gateway">
            <TextField
              size="small"
              fullWidth
              disabled={!isManual}
              value={activeConfig.defaultGateway}
              onChange={(event) => setActiveField("defaultGateway", event.target.value)}
            />
          </FormField>
        </Stack>

        <Divider />

        <Stack direction="row" spacing={2}>
          <FormField label="Primary DNS Server" sx={{ flex: 1 }}>
            <TextField
              size="small"
              fullWidth
              disabled={!isManual}
              value={activeConfig.primaryDnsServer}
              onChange={(event) => setActiveField("primaryDnsServer", event.target.value)}
            />
          </FormField>
          <FormField label="Secondary DNS Server" sx={{ flex: 1 }}>
            <TextField
              size="small"
              fullWidth
              disabled={!isManual}
              value={activeConfig.secondaryDnsServer}
              onChange={(event) => setActiveField("secondaryDnsServer", event.target.value)}
            />
          </FormField>
        </Stack>

        <Divider />

        <FormField label="Link Speed and Duplex Settings">
          <TextField
            select
            size="small"
            fullWidth
            value={linkSpeed}
            onChange={(event) => setLinkSpeed(event.target.value)}
          >
            {LINK_SPEED_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </FormField>
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
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            Save
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
});

ConfigureNetworkForm.propTypes = {
  nic: nicPropType.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

/**
 * "Configure Network" modal (Figma nodes 7290:18992 / 7301:4927): one dialog
 * covers both IPv4 and IPv6 for a NIC — the "TCP/IP Type" radio switches
 * which protocol's fields are shown, each with its own Manually/Using DHCP
 * mode that enables or disables the address fields below it.
 */
export default function ConfigureNetworkDialog({ nic, onClose, onSave, saving }) {
  return (
    <Dialog open={Boolean(nic)} onClose={onClose} maxWidth="sm" fullWidth>
      {nic && <ConfigureNetworkForm nic={nic} onClose={onClose} onSave={onSave} saving={saving} />}
    </Dialog>
  );
}

ConfigureNetworkDialog.propTypes = {
  nic: nicPropType,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};
