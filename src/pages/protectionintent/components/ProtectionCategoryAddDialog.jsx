import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useProtectionCategoryAddForm } from "../hooks/useProtectionCategoryAddForm";
import ProtectionCategoryFormFields from "./ProtectionCategoryFormFields";

export default function ProtectionCategoryAddDialog({ open, onClose, onSave }) {
  const { formValues, setField, expandedExtension, toggleExtensionExpanded } =
    useProtectionCategoryAddForm(open);

  const canSave = formValues.categoryName.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ ...formValues, categoryName: formValues.categoryName.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Typography variant="body1" fontWeight={700} color="text.primary">
          Add Protection Category
        </Typography>
        <IconButton onClick={onClose} aria-label="Close dialog" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <ProtectionCategoryFormFields
          categoryNameLabel="Category Name"
          formValues={formValues}
          setField={setField}
          expandedExtension={expandedExtension}
          onToggleExtensionExpanded={toggleExtensionExpanded}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!canSave}>
          Add Category
        </Button>
      </DialogActions>
    </Dialog>
  );
}
