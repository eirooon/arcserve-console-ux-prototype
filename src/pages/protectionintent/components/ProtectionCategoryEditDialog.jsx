import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useProtectionCategoryEditForm } from "../hooks/useProtectionCategoryEditForm";
import ProtectionCategoryFormFields from "./ProtectionCategoryFormFields";

export default function ProtectionCategoryEditDialog({
  categoryId,
  categoryFormData,
  categories,
  onClose,
  onSave,
}) {
  const { category, formValues, setField, expandedExtension, toggleExtensionExpanded } =
    useProtectionCategoryEditForm(categoryId, categoryFormData, categories);

  const open = Boolean(categoryId) && Boolean(category) && Boolean(formValues);

  const handleSave = () => {
    onSave(categoryId, formValues);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {category && formValues && (
        <>
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            <Typography variant="body1" fontWeight={700} color="text.primary">
              Edit Protection Category - {formValues.categoryName}
            </Typography>
            <IconButton onClick={onClose} aria-label="Close dialog" size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <ProtectionCategoryFormFields
              categoryId={category.id}
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
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
