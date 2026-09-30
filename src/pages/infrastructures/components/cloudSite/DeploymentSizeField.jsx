import { useId } from "react";
import PropTypes from "prop-types";
import { Box, ListSubheader, MenuItem } from "@mui/material";
import FormField from "../../../../components/FormField";
import PlaceholderSelect from "../../../../components/PlaceholderSelect";
import { DEPLOYMENT_SIZES, getDeploymentSize } from "../../hooks/cloudSite/cloudSiteOptions";

const storageFormatter = new Intl.NumberFormat("en-US");

const COLUMNS = [
  { header: "Deployment Size", cell: (size) => size.name },
  { header: "vCPUs", cell: (size) => size.vcpus },
  { header: "Memory (GB)", cell: (size) => size.memoryGb },
  { header: "Storage (GB)", cell: (size) => storageFormatter.format(size.storageGb) },
  { header: "VMs Supported", cell: (size) => size.maxVmsLabel },
];

// One grid shared by the header and every option row so columns line up.
const rowSx = {
  display: "grid",
  gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(0, 1fr))`,
  width: "100%",
  fontSize: 14,
  lineHeight: 1.43,
  borderBottom: 1,
  borderColor: "divider",
  "& > *": { px: 2, py: 0.75 },
};

const MENU_PROPS = {
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  slotProps: {
    paper: { sx: { width: 760, p: 2, overflowX: "auto" } },
    list: {
      sx: { py: 0, minWidth: 560, border: 1, borderColor: "divider", "& > :last-child": { borderBottom: 0 } },
    },
  },
};

// Screen readers get each option as one sentence rather than bare numbers
// with no column headers.
const describeSize = (size) =>
  `${size.name}: ${size.vcpus} vCPUs, ${size.memoryGb} GB memory, ${storageFormatter.format(size.storageGb)} GB storage, ${size.maxVmsLabel} VMs`;

const getOptionLabel = (value) => getDeploymentSize(value)?.label ?? value;

/**
 * Deployment Size select whose menu is a comparison table of sizes (Figma
 * node 7320:7547); the closed select shows the chosen size's one-line
 * summary, e.g. "Small (4 vCPUs, 16 GB Memory, Up to 1,000 VMs)".
 */
export default function DeploymentSizeField({ value, onChange, onBlur, error, helperText, inputRef }) {
  const labelId = useId();
  const id = useId();

  return (
    <FormField label="Deployment Size" labelId={labelId}>
      <PlaceholderSelect
        id={id}
        fullWidth
        size="small"
        placeholder="Select deployment size"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        inputRef={inputRef}
        getOptionLabel={getOptionLabel}
        selectProps={{ MenuProps: MENU_PROPS, SelectDisplayProps: { "aria-labelledby": labelId } }}
      >
        <ListSubheader
          aria-hidden="true"
          disableSticky
          sx={{ ...rowSx, p: 0, color: "text.primary", fontWeight: 600, bgcolor: "background.paper", whiteSpace: "nowrap" }}
        >
          {COLUMNS.map((column) => (
            <span key={column.header}>{column.header}</span>
          ))}
        </ListSubheader>
        {DEPLOYMENT_SIZES.map((size) => (
          <MenuItem key={size.value} value={size.value} aria-label={describeSize(size)} sx={{ ...rowSx, p: 0, minHeight: 0 }}>
            {COLUMNS.map((column) => (
              <Box component="span" key={column.header}>
                {column.cell(size)}
              </Box>
            ))}
          </MenuItem>
        ))}
      </PlaceholderSelect>
    </FormField>
  );
}

DeploymentSizeField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.node,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};
