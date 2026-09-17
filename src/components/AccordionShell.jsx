import PropTypes from "prop-types";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 * Shared bordered/rounded Accordion styling used everywhere the console
 * needs an expandable section with a summary row and a details panel —
 * first built for ProtectionCategoryAccordion (Protection Intent) and
 * reused by ScheduleAccordion (Add Plan's "When to Protect" tab) so both
 * read as the same pattern and only need one place to tweak spacing.
 *
 * `summary` renders inside the header row (AccordionSummary); pass
 * `summaryContentSx` to override that row's flex layout (gap, justifyContent,
 * etc.) per usage. `children` renders inside the details panel — callers own
 * their own layout there (e.g. a Stack), since that content differs enough
 * per usage that baking one in here wouldn't fit everyone.
 */
export default function AccordionShell({
  expanded,
  onToggleExpand,
  summary,
  summaryContentSx,
  summarySx,
  children,
  sx,
}) {
  return (
    <Accordion
      expanded={expanded}
      onChange={onToggleExpand}
      disableGutters
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderTopLeftRadius: "8px !important",
        borderTopRightRadius: "8px !important",
        borderBottomLeftRadius: "8px !important",
        borderBottomRightRadius: "8px !important",
        overflow: "hidden",
        "&:before": { display: "none" },
        ...sx,
      }}
    >
      <AccordionSummary
        component="div"
        expandIcon={<ExpandMoreIcon />}
        sx={{
          px: 3,
          py: 1,
          borderBottom: expanded ? 1 : 0,
          borderColor: "divider",
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 2,
            my: 1,
            minWidth: 0,
            ...summaryContentSx,
          },
          ...summarySx,
        }}
      >
        {summary}
      </AccordionSummary>
      <AccordionDetails sx={{ p: 3 }}>{children}</AccordionDetails>
    </Accordion>
  );
}

AccordionShell.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  summary: PropTypes.node.isRequired,
  summaryContentSx: PropTypes.object,
  summarySx: PropTypes.object,
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};
