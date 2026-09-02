import { ButtonGroup, Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// Primary action + "more actions" menu trigger as one connected control,
// sharing the goal detail page's single Menu instance (opened via onOpenMenu)
// rather than owning a separate popup per row.
export default function SourceActionSplitButton({ label, sourceName, onPrimaryAction, onOpenMenu }) {
  return (
    <ButtonGroup variant="outlined" color="secondary" size="small">
      <Button onClick={onPrimaryAction}>{label}</Button>
      <Button
        onClick={onOpenMenu}
        aria-label={`More actions for ${sourceName}`}
        sx={{ px: 0.5 }}
      >
        <ArrowDropDownIcon fontSize="small" />
      </Button>
    </ButtonGroup>
  );
}
