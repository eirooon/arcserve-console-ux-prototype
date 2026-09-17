import PropTypes from "prop-types";
import { Box, TextField, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FormField from "../../../../components/FormField";
import ProtectionTypeCard from "./ProtectionTypeCard";
import { PROTECTION_TYPES } from "../data/protectionTypes";

/**
 * "Basic" step content (Figma node 6218:11486): plan name, a single-select
 * grid of protection types, and an optional description.
 */
export default function BasicStep({
  planName,
  onPlanNameChange,
  protectionTypeId,
  onProtectionTypeChange,
  description,
  onDescriptionChange,
}) {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
          maxWidth: 900,
        }}
      >
        <FormField label="Plan Name" required>
          <TextField
            fullWidth
            size="small"
            value={planName}
            onChange={(event) => onPlanNameChange(event.target.value)}
            placeholder="Enter plan name"
            inputProps={{ "aria-required": true }}
          />
        </FormField>

        <FormField
          label="Protection Type"
          labelAdornment={
            <Tooltip title="Choose the type of protection this plan will use for its sources.">
              <InfoOutlinedIcon fontSize="small" sx={{ color: "action.active" }} />
            </Tooltip>
          }
        >
          <Box
            role="radiogroup"
            aria-label="Protection Type"
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            {PROTECTION_TYPES.map((type) => (
              <ProtectionTypeCard
                key={type.id}
                label={type.label}
                description={type.description}
                selected={protectionTypeId === type.id}
                onSelect={() => onProtectionTypeChange(type.id)}
              />
            ))}
          </Box>
        </FormField>

        <FormField label="Description (Optional)">
          <TextField
            fullWidth
            size="small"
            multiline
            minRows={2}
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Enter description"
          />
        </FormField>
      </Box>
    </Box>
  );
}

BasicStep.propTypes = {
  planName: PropTypes.string.isRequired,
  onPlanNameChange: PropTypes.func.isRequired,
  protectionTypeId: PropTypes.string,
  onProtectionTypeChange: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
};
