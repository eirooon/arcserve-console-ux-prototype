import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Alert, Box, Divider, MenuItem, Stack } from "@mui/material";
import FormField from "../../../../components/FormField";
import PlaceholderSelect from "../../../../components/PlaceholderSelect";
import { EXISTING_RESOURCE_GROUPS, EXISTING_STORAGE_ACCOUNTS, REGIONS } from "../../hooks/azure/azureMockData";
import NewOrExistingField from "./NewOrExistingField";
import StepCreationStatus from "./StepCreationStatus";
import SubscriptionField from "./SubscriptionField";
import { StepHeading } from "./AzureWizardParts";
import { SMALL_SELECT_PROPS } from "./azureStyles";

/**
 * Storage step (was "Location", Figma 10301:15296). Only shown when a goal
 * stores backup data; creates or connects the storage account from its own
 * button.
 */
const AzureStorageStep = forwardRef(function AzureStorageStep(
  {
    location,
    errors,
    appWritesToStorage,
    onFieldChange,
    showSubscription,
    subscriptionId,
    onSubscriptionChange,
    creation,
    locked,
  },
  headingRef,
) {
  return (
    <Stack spacing={3}>
      <StepHeading
        ref={headingRef}
        title="Where should backups be stored?"
        subtitle="A storage account for backup data, in its own resource group. We've picked sensible defaults. Change anything you need."
      />
      <StepCreationStatus creation={creation} />
      <Box inert={locked} sx={{ opacity: locked ? 0.6 : 1 }}>
        <Stack spacing={3}>
          {/* With no app (RPS storage only) there's no Permissions step, so the
          subscription is chosen here. */}
          {showSubscription && (
            <SubscriptionField
              value={subscriptionId}
              onChange={onSubscriptionChange}
              helperText="Where the storage account is created or found"
            />
          )}
          <FormField label="Region">
            <PlaceholderSelect
              size="small"
              fullWidth
              placeholder="Select region"
              value={location.region}
              onChange={(event) => onFieldChange("region", event.target.value)}
              helperText="Where a new resource group and storage account are created"
              selectProps={SMALL_SELECT_PROPS}
            >
              {REGIONS.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </PlaceholderSelect>
          </FormField>
          <Divider />
          <NewOrExistingField
            label="Resource Group for Storage"
            existingLabel="Existing Resource Group"
            existingPlaceholder="Select resource group"
            mode={location.resourceGroupMode}
            onModeChange={(value) => onFieldChange("resourceGroupMode", value)}
            newLabel="New Resource Group Name"
            newPlaceholder="Enter resource group name"
            newValue={location.resourceGroupName}
            onNewChange={(value) => onFieldChange("resourceGroupName", value)}
            newError={errors.resourceGroupName}
            existingOptions={EXISTING_RESOURCE_GROUPS}
            existingValue={location.existingResourceGroup}
            onExistingChange={(value) => onFieldChange("existingResourceGroup", value)}
            existingError={errors.existingResourceGroup}
          />
          <Divider />
          <NewOrExistingField
            label="Storage Account for Backup Data"
            existingLabel="Existing Storage Account"
            existingPlaceholder="Select storage account"
            mode={location.storageMode}
            onModeChange={(value) => onFieldChange("storageMode", value)}
            newLabel="New Storage Account Name"
            newPlaceholder="Enter storage account name"
            newValue={location.storageAccountName}
            onNewChange={(value) => onFieldChange("storageAccountName", value)}
            newError={errors.storageAccountName}
            existingOptions={EXISTING_STORAGE_ACCOUNTS}
            existingValue={location.existingStorageAccount}
            onExistingChange={(value) => onFieldChange("existingStorageAccount", value)}
            existingError={errors.existingStorageAccount}
          />
          <Alert severity="info">
            {appWritesToStorage
              ? "The app gets read and write access to this storage account only."
              : "No app is needed: your Recovery Point Server uses this storage account’s access key, which Arcserve stores encrypted."}
          </Alert>
        </Stack>
      </Box>
    </Stack>
  );
});

AzureStorageStep.propTypes = {
  location: PropTypes.object.isRequired,
  errors: PropTypes.objectOf(PropTypes.string).isRequired,
  appWritesToStorage: PropTypes.bool.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  showSubscription: PropTypes.bool.isRequired,
  subscriptionId: PropTypes.string.isRequired,
  onSubscriptionChange: PropTypes.func.isRequired,
  creation: PropTypes.object.isRequired,
  locked: PropTypes.bool.isRequired,
};

export default AzureStorageStep;
