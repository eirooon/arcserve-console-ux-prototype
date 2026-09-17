import PropTypes from "prop-types";
import { Button, Stack, Typography } from "@mui/material";
import AccordionShell from "../../../../../components/AccordionShell";

/**
 * Accordion used by the "Backup Schedule" and "Merge Schedule" sections on
 * the "When to Protect" sub-tab (Figma nodes 6480:8336, 7567:9589).
 */
export default function ScheduleAccordion({ title, expanded, onToggleExpand, onAdd, children }) {
  return (
    <AccordionShell
      expanded={expanded}
      onToggleExpand={onToggleExpand}
      summary={
        <>
          <Typography variant="body1" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          <Button
            variant="text"
            color="secondary"
            onClick={(event) => {
              event.stopPropagation();
              onAdd();
            }}
          >
            Add
          </Button>
        </>
      }
    >
      <Stack spacing={3}>{children}</Stack>
    </AccordionShell>
  );
}

ScheduleAccordion.propTypes = {
  title: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
