import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ProtectionCategoriesList from "./components/ProtectionCategoriesList";
import GoalsAutonomyPanel from "./components/GoalsAutonomyPanel";
import ProtectionCategoryEditDialog from "./components/ProtectionCategoryEditDialog";
import { useArcGenieProtectionIntent } from "./hooks/useArcGenieProtectionIntent";
import { useArcGenieActivation } from "../../hooks/useArcGenieActivation";

const TABS = {
  categories: "Protection Categories",
  goals: "Goals & Autonomy",
};

export default function ArcGenieProtectionIntentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsArcGenieActivated } = useArcGenieActivation();
  const [activeTab, setActiveTab] = useState(
    location.state?.initialTab === "goals" ? "goals" : "categories",
  );
  const {
    expandedCategories,
    toggleCategoryExpanded,
    extensionState,
    editDialogCategoryId,
    handleEditCategory,
    closeEditDialog,
    categoryFormData,
    toggleExtension,
    handleSaveCategoryEdit,
    goals,
    globalSettings,
    toggleGoalEnabled,
    setGoalField,
    setGlobalField,
    isDirty,
    handleSave,
    snackbarMessage,
    closeSnackbar,
  } = useArcGenieProtectionIntent();

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        minHeight: "calc(100vh - 64px)",
        py: 6,
      }}
    >
      <Stack spacing={3} sx={{ width: "100%", px: 6 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Protection Intent
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RestartAltRoundedIcon />}
              onClick={() => {
                setIsArcGenieActivated(false);
                navigate("/dashboard/protection-intent-setup");
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              disabled={!isDirty}
              onClick={handleSave}
            >
              Save
            </Button>
          </Stack>
        </Stack>

        <Tabs
          value={activeTab}
          onChange={(event, value) => setActiveTab(value)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          {Object.entries(TABS).map(([value, label]) => (
            <Tab key={value} value={value} label={label} />
          ))}
        </Tabs>

        {activeTab === "categories" && (
          <ProtectionCategoriesList
            categoryFormData={categoryFormData}
            extensionState={extensionState}
            expandedCategories={expandedCategories}
            onToggleCategoryExpand={toggleCategoryExpanded}
            onToggleExtension={toggleExtension}
            onEditCategory={handleEditCategory}
          />
        )}

        {activeTab === "goals" && (
          <GoalsAutonomyPanel
            goals={goals}
            toggleGoalEnabled={toggleGoalEnabled}
            setGoalField={setGoalField}
            globalSettings={globalSettings}
            setGlobalField={setGlobalField}
          />
        )}
      </Stack>

      <ProtectionCategoryEditDialog
        categoryId={editDialogCategoryId}
        categoryFormData={categoryFormData}
        onClose={closeEditDialog}
        onSave={handleSaveCategoryEdit}
      />

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={closeSnackbar}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
