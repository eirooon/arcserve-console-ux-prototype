import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button } from "@mui/material";
import PermissionListDialog from "./PermissionListDialog";

// Shown inline before "View all" — a full list can be up to 25 actions,
// which would push the rest of the content down.
const PREVIEW_COUNT = 3;

/** The first few permissions inline, the rest in PermissionListDialog. */
export default function ShortActionList({ actions, dialogTitle, dialogDescription }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.5, fontFamily: "monospace", fontSize: 13, overflowWrap: "anywhere" }}>
        {actions.slice(0, PREVIEW_COUNT).map((roleAction) => (
          <li key={roleAction}>{roleAction}</li>
        ))}
      </Box>
      {actions.length > PREVIEW_COUNT && (
        <Button
          color="inherit"
          size="small"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          sx={{ mt: 0.5, textDecoration: "underline" }}
        >
          View all {actions.length}
        </Button>
      )}
      <PermissionListDialog
        open={open}
        title={dialogTitle}
        description={dialogDescription}
        actions={actions}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

ShortActionList.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  dialogTitle: PropTypes.string.isRequired,
  dialogDescription: PropTypes.string.isRequired,
};
