import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
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
    categories,
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
    toggleGoalEnabled,
    setGoalField,
    isDirty,
    handleSave,
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
          <Typography variant="h6" color="text.primary">
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
            categories={categories}
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
          />
        )}
      </Stack>

      <ProtectionCategoryEditDialog
        categoryId={editDialogCategoryId}
        categoryFormData={categoryFormData}
        categories={categories}
        onClose={closeEditDialog}
        onSave={handleSaveCategoryEdit}
      />
    </Box>
  );
}
