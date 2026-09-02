import { AutoFixHigh, AutoAwesomeMosaic, Edit } from "@mui/icons-material";
import { amber, blueGrey, purple } from "@mui/material/colors";

export const PROTECTION_INTENT_STEPS = [
  "Define Protection Intent",
  "Configure Goals & Autonomy",
  "Configure Messaging Channels",
  "Review & Apply",
];

export const ARCHITECTING_COPY = {
  title: "Architecting Your Protection Strategy",
  description:
    "Please wait while ArcGenie dynamically calculates your configurations, risk mitigations, and recovery validation schedules.",
};

export const ARCHITECTING_STATUS_MESSAGES = [
  "Initializing synthesis engine...",
  "Analyzing source inventory...",
  "Calculating retention policies...",
  "Evaluating compliance requirements...",
  "Finalizing recommendations...",
];

export const REVIEW_STEP_COPY = {
  title: "Review Your Protection Intent Setup",
  description:
    "Confirm your protection categories, agentic goals, and global autonomy settings before activating ArcGenie.",
};

export const CUSTOM_PROMPT_COPY = {
  instructions:
    "Write what you need in plain english - one policy or several. The model reads it and replaces the cards above with what you ask for, before anything is created.",
  placeholder:
    "e.g. establish 3 policies: Critical - ensure all essential nodes are monitored, High - prioritize data backups for key applications, and Low - schedule regular checks for non-critical systems.",
  generateLabel: "Generate Recommended Protection Intent Now",
};

export const PROTECTION_INTENT_OPTIONS = [
  {
    id: "arcgenie-suggest",
    title: "Let ArcGenie Suggest",
    description: "Best for quick setup.",
    icon: <AutoFixHigh fontSize="medium" />,
    iconColor: "primary.dark",
    avatarBgColor: purple[50],
  },
  {
    id: "category-based",
    title: "Category-Based",
    description: "Apply standard categories.",
    icon: <AutoAwesomeMosaic fontSize="medium" />,
    iconColor: amber[800],
    avatarBgColor: amber[50],
  },
  {
    id: "custom-prompt",
    title: "Custom Prompt",
    description: "Describe your policy in plain English",
    icon: <Edit fontSize="medium" />,
    iconColor: blueGrey[600],
    avatarBgColor: blueGrey[50],
  },
];
