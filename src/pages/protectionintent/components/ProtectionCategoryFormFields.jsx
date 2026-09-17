import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormField from "../../../components/FormField";
import {
  COMPLIANCE_CHECKBOX_FIELDS,
  COMPLIANCE_LEGAL_HOLD_FIELD,
  COMPLIANCE_SELECT_FIELDS,
  DESTINATION_SETTINGS_FIELDS,
  GENERAL_SETTINGS_FIELDS,
} from "../protectionCategoryEditOptions";
import { EXTENSION_ROWS } from "../protectionIntentRecommendationData";

function FieldSelect({ field, label, options, value, onChange }) {
  return (
    <FormField label={label} sx={{ flex: 1 }}>
      <TextField
        select
        size="small"
        fullWidth
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </FormField>
  );
}

function ExtensionEditRow({ label, expanded, onToggle, children }) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={onToggle}
        sx={{ px: 2, py: 1.25, cursor: "pointer" }}
      >
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {label}
        </Typography>
        <IconButton
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          aria-label={`Toggle ${label} settings`}
        >
          <ExpandMoreIcon
            fontSize="small"
            sx={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          />
        </IconButton>
      </Stack>
      {expanded && <Box sx={{ px: 3, pb: 3, pt: 1 }}>{children}</Box>}
    </Box>
  );
}

// Shared body for both the "Edit Protection Category" and "Add Protection
// Category" dialogs — everything except the category name field reads and
// writes generically by field name, so a brand-new custom category (no
// `categoryId` yet) renders identically to an existing one.
export default function ProtectionCategoryFormFields({
  categoryId = null,
  categoryNameLabel = "Category Name",
  formValues,
  setField,
  expandedExtension,
  onToggleExtensionExpanded,
}) {
  return (
    <>
      <FormField label={categoryNameLabel}>
        <TextField
          size="small"
          fullWidth
          value={formValues.categoryName}
          onChange={(event) => setField("categoryName", event.target.value)}
        />
      </FormField>

      <Stack spacing={2}>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          General settings
        </Typography>
        <Stack spacing={1.5}>
          {Array.from({ length: Math.ceil(GENERAL_SETTINGS_FIELDS.length / 2) }, (_, rowIndex) => (
            <Stack key={rowIndex} direction="row" spacing={1.5}>
              {GENERAL_SETTINGS_FIELDS.slice(rowIndex * 2, rowIndex * 2 + 2).map((fieldSpec) => (
                <FieldSelect
                  key={fieldSpec.field}
                  field={fieldSpec.field}
                  label={fieldSpec.label}
                  options={fieldSpec.options}
                  value={formValues[fieldSpec.field]}
                  onChange={setField}
                />
              ))}
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Divider />

      <Stack spacing={2}>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Extensions
        </Typography>
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: "8px", overflow: "hidden" }}>
          {EXTENSION_ROWS.map((extension) => (
            <ExtensionEditRow
              key={extension.label}
              label={extension.label}
              expanded={expandedExtension === extension.label}
              onToggle={() => onToggleExtensionExpanded(extension.label)}
            >
              {extension.label === "Compliance" ? (
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5}>
                    {COMPLIANCE_SELECT_FIELDS.map((fieldSpec) => (
                      <FieldSelect
                        key={fieldSpec.field}
                        field={fieldSpec.field}
                        label={fieldSpec.label}
                        options={fieldSpec.options}
                        value={formValues[fieldSpec.field]}
                        onChange={setField}
                      />
                    ))}
                  </Stack>
                  <FieldSelect
                    field={COMPLIANCE_LEGAL_HOLD_FIELD.field}
                    label={COMPLIANCE_LEGAL_HOLD_FIELD.label}
                    options={COMPLIANCE_LEGAL_HOLD_FIELD.options}
                    value={formValues[COMPLIANCE_LEGAL_HOLD_FIELD.field]}
                    onChange={setField}
                  />
                  <Stack direction="row" spacing={2}>
                    {COMPLIANCE_CHECKBOX_FIELDS.map((checkboxSpec) => (
                      <FormControlLabel
                        key={checkboxSpec.field}
                        control={
                          <Checkbox
                            size="small"
                            checked={formValues[checkboxSpec.field]}
                            onChange={(event) =>
                              setField(checkboxSpec.field, event.target.checked)
                            }
                          />
                        }
                        label={
                          <Typography variant="body2" color="text.primary">
                            {checkboxSpec.label}
                          </Typography>
                        }
                      />
                    ))}
                  </Stack>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {extension.values[categoryId]?.detail ??
                    "No additional configuration for this extension."}
                </Typography>
              )}
            </ExtensionEditRow>
          ))}
        </Box>
      </Stack>

      <Divider />

      <Stack spacing={2}>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Default Destination Settings
        </Typography>
        <FieldSelect
          field={DESTINATION_SETTINGS_FIELDS.backupDestination.field}
          label={DESTINATION_SETTINGS_FIELDS.backupDestination.label}
          options={DESTINATION_SETTINGS_FIELDS.backupDestination.options}
          value={formValues.backupDestination}
          onChange={setField}
        />
        <Stack direction="row" spacing={1.5}>
          <FieldSelect
            field={DESTINATION_SETTINGS_FIELDS.recoveryPointServer.field}
            label={DESTINATION_SETTINGS_FIELDS.recoveryPointServer.label}
            options={DESTINATION_SETTINGS_FIELDS.recoveryPointServer.options}
            value={formValues.recoveryPointServer}
            onChange={setField}
          />
          <FieldSelect
            field={DESTINATION_SETTINGS_FIELDS.dataStore.field}
            label={DESTINATION_SETTINGS_FIELDS.dataStore.label}
            options={DESTINATION_SETTINGS_FIELDS.dataStore.options}
            value={formValues.dataStore}
            onChange={setField}
          />
        </Stack>
      </Stack>
    </>
  );
}
