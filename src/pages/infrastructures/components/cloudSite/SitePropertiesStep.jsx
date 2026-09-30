import PropTypes from "prop-types";
import { Box, Checkbox, Collapse, Divider, FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import FormField from "../../../../components/FormField";
import InfoTip from "../../../../components/InfoTip";
import PasswordField from "../../../../components/PasswordField";
import SelectField from "../../../../components/SelectField";
import { SMALL_SELECT_PROPS } from "../azure/azureStyles";
import DeploymentSizeField from "./DeploymentSizeField";
import {
  NETWORK_OPTIONS,
  REGION_OPTIONS,
  RESOURCE_GROUP_OPTIONS,
  SECURITY_GROUP_OPTIONS,
  getSubnetOptions,
} from "../../hooks/cloudSite/cloudSiteOptions";
import { CONTAINER_NAME_RULES, formatMonthlyCost } from "../../hooks/cloudSite/cloudSiteForm";

const TWO_COLUMNS = { display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, columnGap: 2, rowGap: 2 };

// The encryption fields sit under their checkbox, lined up with its label.
const CHECKBOX_INDENT = "42px";

function SectionHeading({ title, info }) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
      <Typography component="h3" variant="body2" sx={{ color: "text.secondary" }}>
        {title}
      </Typography>
      {info && <InfoTip title={info} label={`About ${title}`} />}
    </Stack>
  );
}

SectionHeading.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.node,
};

/**
 * "Add Cloud Site" step 1 — Site Properties (Figma node 7321:8644).
 * Presentational: every value, error and change goes through props (see
 * useAddCloudSite).
 */
export default function SitePropertiesStep({
  values,
  errors,
  estimatedCost,
  cloudAccountOptions,
  onFieldChange,
  onFieldBlur,
  registerField,
}) {
  // Wiring shared by every control: value, change, blur-to-show-errors,
  // error text and a focusable ref.
  const bind = (field) => ({
    value: values[field],
    onBlur: () => onFieldBlur(field),
    error: Boolean(errors[field]),
    helperText: errors[field],
    inputRef: registerField(field),
  });
  const bindText = (field) => ({
    ...bind(field),
    fullWidth: true,
    size: "small",
    onChange: (event) => onFieldChange(field, event.target.value),
  });
  const bindSelect = (field) => ({
    ...bind(field),
    onChange: (value) => onFieldChange(field, value),
    selectProps: SMALL_SELECT_PROPS,
  });
  const bindPassword = (field) => ({
    ...bind(field),
    required: true,
    autoComplete: "new-password",
    onChange: (value) => onFieldChange(field, value),
  });
  const required = { "aria-required": true };

  return (
    <Stack spacing={3} divider={<Divider flexItem />}>
      <Stack spacing={2}>
        <SectionHeading
          title="Virtual Machine Details"
          info="A virtual machine containing the required Cloud Data Protection components will be deployed in your cloud account."
        />
        <Box sx={TWO_COLUMNS}>
          <FormField
            label="Name"
            required
            labelAdornment={
              <InfoTip
                title="The site name will be used as the Virtual Instance Name in the cloud."
                label="About the site name"
              />
            }
          >
            <TextField placeholder="Enter name" slotProps={{ htmlInput: required }} {...bindText("name")} />
          </FormField>
          <SelectField
            label="Cloud Account"
            required
            placeholder="Select cloud account"
            options={cloudAccountOptions}
            {...bindSelect("cloudAccount")}
          />
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Box sx={TWO_COLUMNS}>
          <DeploymentSizeField
            {...bind("deploymentSize")}
            onChange={(value) => onFieldChange("deploymentSize", value)}
          />
          <FormField label="Storage Size (GB)">
            <TextField
              placeholder="Enter storage size"
              slotProps={{ htmlInput: { inputMode: "numeric" } }}
              {...bindText("storageSize")}
            />
          </FormField>
        </Box>
        <Typography variant="body2" aria-live="polite" sx={{ color: "text.secondary" }}>
          Estimated Cost:{" "}
          <Box component="span" sx={{ fontWeight: 600 }}>
            {formatMonthlyCost(estimatedCost)}
          </Box>
        </Typography>
      </Stack>

      <Box sx={TWO_COLUMNS}>
        <SelectField
          label="Region"
          required
          placeholder="Select region"
          options={REGION_OPTIONS}
          {...bindSelect("region")}
        />
        <SelectField
          label="Resource Group"
          required
          placeholder="Select resource group"
          options={RESOURCE_GROUP_OPTIONS}
          {...bindSelect("resourceGroup")}
        />
      </Box>

      <Stack spacing={2}>
        <Box sx={TWO_COLUMNS}>
          <FormField label="Host Name" required>
            <TextField placeholder="Enter host name" slotProps={{ htmlInput: required }} {...bindText("hostName")} />
          </FormField>
          <SelectField
            label="Network"
            required
            placeholder="Select network"
            options={NETWORK_OPTIONS}
            {...bindSelect("network")}
          />
          <SelectField
            label="Subnet"
            required
            placeholder={values.network ? "Select subnet" : "Select a network first"}
            options={getSubnetOptions(values.network)}
            disabled={!values.network}
            {...bindSelect("subnet")}
          />
          <SelectField
            label="Security Group"
            required
            placeholder="Select security group"
            options={SECURITY_GROUP_OPTIONS}
            {...bindSelect("securityGroup")}
          />
        </Box>
        <FormControlLabel
          sx={{ ml: 0 }}
          control={
            <Checkbox
              size="small"
              checked={values.autoAssignPublicIp}
              onChange={(event) => onFieldChange("autoAssignPublicIp", event.target.checked)}
            />
          }
          label="Enable auto-assign Public IP"
        />
      </Stack>

      <Stack spacing={2}>
        <SectionHeading
          title="Administrator Credentials for the Virtual Machine"
          info='The default administrator username for this virtual machine is "admin".'
        />
        <Box sx={TWO_COLUMNS}>
          <PasswordField label="Password" placeholder="Enter password" {...bindPassword("password")} />
          <PasswordField
            label="Confirm Password"
            placeholder="Enter confirm password"
            {...bindPassword("confirmPassword")}
          />
        </Box>
      </Stack>

      <Stack spacing={2}>
        <SectionHeading
          title="Cloud Data Store Settings"
          info={`A Cloud Data Store is created automatically when the cloud site deploys. Container/bucket names: ${CONTAINER_NAME_RULES}`}
        />
        <FormField label="Container/Bucket Name" required>
          <TextField
            placeholder="Enter container/bucket name"
            slotProps={{ htmlInput: required }}
            {...bindText("containerName")}
          />
        </FormField>
        <FormControlLabel
          sx={{ ml: 0 }}
          control={
            <Checkbox
              size="small"
              checked={values.encryptData}
              onChange={(event) => onFieldChange("encryptData", event.target.checked)}
            />
          }
          label="Enable data store encryption."
        />
        <Collapse in={values.encryptData} unmountOnExit>
          <Box sx={{ ...TWO_COLUMNS, pl: CHECKBOX_INDENT }}>
            <PasswordField
              label="Encryption Password"
              placeholder="Enter encryption password"
              {...bindPassword("encryptionPassword")}
            />
            <PasswordField
              label="Encryption Confirm Password"
              placeholder="Enter encryption confirm password"
              {...bindPassword("confirmEncryptionPassword")}
            />
          </Box>
        </Collapse>
      </Stack>
    </Stack>
  );
}

SitePropertiesStep.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.objectOf(PropTypes.string).isRequired,
  estimatedCost: PropTypes.number.isRequired,
  cloudAccountOptions: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired }),
  ).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onFieldBlur: PropTypes.func.isRequired,
  registerField: PropTypes.func.isRequired,
};
