import { useMemo } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FormField from "../../../../../components/FormField";
import PasswordField from "../../../../../components/PasswordField";
import { useDestinationData } from "../../../../destinations/hooks/useDestinationData";
import { DESTINATION_TYPES } from "../../data/scheduleOptions";

const selectDestinationRows = (state) => ({ rows: state.rows });

/**
 * "2. Where to Protect" sub-tab (Figma node 6478:6168): the backup
 * destination — a Recovery Point Server and the Data Store within it — plus
 * optional session password protection.
 */
export default function WhereToProtectPanel({
  backupDestinationType,
  onBackupDestinationTypeChange,
  recoveryPointServerId,
  onRecoveryPointServerChange,
  dataStoreId,
  onDataStoreChange,
  passwordProtected,
  onPasswordProtectedChange,
  sessionPassword,
  onSessionPasswordChange,
  confirmSessionPassword,
  onConfirmSessionPasswordChange,
}) {
  const { rows: destinations } = useDestinationData(selectDestinationRows);

  const recoveryPointServers = useMemo(
    () => destinations.filter((destination) => destination.type === "recovery_point_server"),
    [destinations],
  );
  const dataStores = useMemo(
    () => destinations.filter((destination) => destination.type === "data_store"),
    [destinations],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
      <FormField label="Backup Destination Type" sx={{ maxWidth: 400 }}>
        <TextField
          select
          fullWidth
          size="small"
          value={backupDestinationType}
          onChange={(event) => onBackupDestinationTypeChange(event.target.value)}
        >
          {DESTINATION_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
      </FormField>

      <Box sx={{ display: "flex", gap: 3 }}>
        <FormField
          label="Recovery Point Server"
          sx={{ flex: 1 }}
          labelAdornment={
            <Tooltip title="The Recovery Point Server that will store this task's backups.">
              <InfoOutlinedIcon fontSize="small" sx={{ color: "action.active" }} />
            </Tooltip>
          }
        >
          <TextField
            select
            fullWidth
            size="small"
            value={recoveryPointServerId}
            onChange={(event) => onRecoveryPointServerChange(event.target.value)}
          >
            {recoveryPointServers.map((server) => (
              <MenuItem key={server.id} value={server.id}>
                {server.name}
              </MenuItem>
            ))}
          </TextField>
        </FormField>

        <FormField
          label="Data Store"
          sx={{ flex: 1 }}
          labelAdornment={
            <Tooltip title="The Data Store on the selected Recovery Point Server.">
              <InfoOutlinedIcon fontSize="small" sx={{ color: "action.active" }} />
            </Tooltip>
          }
        >
          <TextField
            select
            fullWidth
            size="small"
            value={dataStoreId}
            onChange={(event) => onDataStoreChange(event.target.value)}
          >
            {dataStores.map((store) => (
              <MenuItem key={store.id} value={store.id}>
                {store.name}
              </MenuItem>
            ))}
          </TextField>
        </FormField>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={passwordProtected}
            onChange={(event) => onPasswordProtectedChange(event.target.checked)}
          />
        }
        label="Password Protection"
      />

      {passwordProtected && (
        <Box sx={{ display: "flex", gap: 2 }}>
          <PasswordField
            label="Session Password"
            value={sessionPassword}
            onChange={onSessionPasswordChange}
            sx={{ flex: 1 }}
          />
          <PasswordField
            label="Confirm Session Password"
            value={confirmSessionPassword}
            onChange={onConfirmSessionPasswordChange}
            sx={{ flex: 1 }}
          />
        </Box>
      )}
    </Box>
  );
}

WhereToProtectPanel.propTypes = {
  backupDestinationType: PropTypes.string.isRequired,
  onBackupDestinationTypeChange: PropTypes.func.isRequired,
  recoveryPointServerId: PropTypes.string.isRequired,
  onRecoveryPointServerChange: PropTypes.func.isRequired,
  dataStoreId: PropTypes.string.isRequired,
  onDataStoreChange: PropTypes.func.isRequired,
  passwordProtected: PropTypes.bool.isRequired,
  onPasswordProtectedChange: PropTypes.func.isRequired,
  sessionPassword: PropTypes.string.isRequired,
  onSessionPasswordChange: PropTypes.func.isRequired,
  confirmSessionPassword: PropTypes.string.isRequired,
  onConfirmSessionPasswordChange: PropTypes.func.isRequired,
};
