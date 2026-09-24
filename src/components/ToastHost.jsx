import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Box, Button, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toastStore } from "../api/toastStore";

const EXIT_DURATION_MS = 250;

function reconcile(current, toasts) {
  const currentIds = new Set(current.map((entry) => entry.id));
  const nextIds = new Set(toasts.map((toast) => toast.id));

  const additions = toasts
    .filter((toast) => !currentIds.has(toast.id))
    .map((toast) => ({ ...toast, phase: "entering" }));

  const updated = current.map((entry) =>
    nextIds.has(entry.id) || entry.phase === "exiting" ? entry : { ...entry, phase: "exiting" },
  );

  return [...additions, ...updated];
}

/**
 * Floating, stacked toast notifications — mounted once by AppShell so every
 * page shares one stack instead of each owning its own Snackbar (see
 * toastStore, which every page's `showSnackbar`-style action now feeds).
 * New toasts slide in from the right at the top of the stack, pushing older
 * ones down; dismissed toasts fade out and the stack smoothly closes the gap
 * they leave, whether they were closed by hand or timed out on their own.
 */
export default function ToastHost({ topOffset }) {
  // Seeded from the store during render (not in an effect) so there's no
  // synchronous setState in the subscription effect below — it only needs to
  // react to *future* store updates from here on.
  const [entries, setEntries] = useState(() => reconcile([], toastStore.getSnapshot()));
  const exitTimers = useRef(new Map());

  // Mirrors the store's toasts into local render state instead of rendering
  // it directly, so a dismissed toast can stick around just long enough to
  // play its exit transition (see the "exiting" phase below) before actually
  // unmounting.
  useEffect(
    () =>
      toastStore.subscribe(() => {
        setEntries((current) => reconcile(current, toastStore.getSnapshot()));
      }),
    [],
  );

  // Flips freshly-added toasts from "entering" to "visible" on the next
  // frame, so the browser paints the off-screen/transparent starting state
  // first and the flip to on-screen/opaque actually transitions instead of
  // snapping.
  useEffect(() => {
    if (!entries.some((entry) => entry.phase === "entering")) return undefined;
    const frame = requestAnimationFrame(() => {
      setEntries((current) =>
        current.map((entry) => (entry.phase === "entering" ? { ...entry, phase: "visible" } : entry)),
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [entries]);

  // Once a toast is marked "exiting", give its fade-out transition time to
  // play before dropping it from render state for good.
  useEffect(() => {
    entries
      .filter((entry) => entry.phase === "exiting")
      .forEach((entry) => {
        if (exitTimers.current.has(entry.id)) return;
        const timer = setTimeout(() => {
          exitTimers.current.delete(entry.id);
          setEntries((current) => current.filter((existing) => existing.id !== entry.id));
        }, EXIT_DURATION_MS);
        exitTimers.current.set(entry.id, timer);
      });
  }, [entries]);

  useEffect(() => {
    const timers = exitTimers.current;
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  if (entries.length === 0) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: topOffset,
        right: 24,
        zIndex: (theme) => theme.zIndex.snackbar,
        display: "flex",
        flexDirection: "column",
        width: 360,
        maxWidth: "calc(100vw - 48px)",
      }}
    >
      {entries.map((entry) => {
        const visible = entry.phase === "visible";
        return (
          <Box
            key={entry.id}
            sx={{
              overflow: "hidden",
              maxHeight: visible ? 200 : 0,
              // Widen the clipping box beyond the visible column (and pull it
              // back with a matching negative margin) so the Alert's own
              // box-shadow has room to bleed into before hitting the edge
              // that's clipped for the collapse animation — otherwise the
              // shadow gets a hard cutoff. Horizontal clearance (px/mx) is
              // unconditional since width isn't part of the collapse; the
              // vertical clearance (py) has to drop to 0 alongside max-height
              // when collapsed, or a border-box element's padding would keep
              // rendering even at max-height: 0 and the toast would never
              // fully close. The top padding is then canceled by an equal
              // negative top margin so it only buys clipping clearance, not
              // extra visual distance from the header above the first toast —
              // the bottom padding is left uncanceled instead, since it
              // already supplies exactly the intended 16px gap between
              // stacked toasts (no separate margin-bottom needed on top of
              // it).
              px: 2,
              mx: -2,
              py: visible ? 2 : 0,
              mt: visible ? -2 : 0,
              transition:
                "max-height 0.3s ease, margin-top 0.3s ease, padding-top 0.3s ease, padding-bottom 0.3s ease",
            }}
          >
            <Alert
              severity={entry.severity}
              variant="standard"
              action={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {entry.action && (
                    <Button
                      size="small"
                      color="inherit"
                      sx={{ fontWeight: 600, minHeight: 44 }}
                      onClick={() => {
                        entry.action.onClick();
                        toastStore.dismissToast(entry.id);
                      }}
                    >
                      {entry.action.label}
                    </Button>
                  )}
                  <IconButton
                    size="small"
                    color="inherit"
                    aria-label="Close"
                    onClick={() => toastStore.dismissToast(entry.id)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              }
              sx={{
                width: "100%",
                // Matches MUI's own SnackbarContent, which defaults to
                // elevation={6} — keeps this toast's depth consistent with
                // what a plain MUI Snackbar would use.
                boxShadow: 6,
                opacity: visible ? 1 : 0,
                transform: entry.phase === "entering" ? "translateX(40px)" : "translateX(0)",
                transition: "opacity 0.25s ease, transform 0.3s ease",
              }}
            >
              {entry.message}
            </Alert>
          </Box>
        );
      })}
    </Box>
  );
}

ToastHost.propTypes = {
  topOffset: PropTypes.number.isRequired,
};
