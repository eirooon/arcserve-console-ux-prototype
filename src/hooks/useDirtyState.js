import { useCallback, useState } from "react";

/**
 * The standard way to gate a page's primary "Save" action: disabled until
 * something has actually changed, and disabled again immediately after a
 * save succeeds — rather than enabled any time the form merely happens to
 * be valid (which would let someone re-save unchanged data, or silently
 * create a duplicate on a second click of what looks like a no-op).
 *
 * Wrap every setter a step/section can call with `track` before handing it
 * down as a prop — calling the wrapped setter flips `dirty` to true, then
 * forwards the call unchanged. Call `markClean()` once a save has
 * succeeded (a fresh id-bearing route swap after a create starts clean on
 * its own, with no explicit call needed — see the Add Plan wizard).
 *
 * ```js
 * const { dirty, track, markClean } = useDirtyState();
 * const [name, setName] = useState("");
 * // ...
 * const canSubmit = isValid && dirty;
 * const submit = async () => {
 *   if (!canSubmit) return;
 *   await save({ name });
 *   markClean();
 * };
 * return { name, setName: track(setName), canSubmit, submit };
 * ```
 */
export function useDirtyState() {
  const [dirty, setDirty] = useState(false);

  const track = useCallback(
    (setter) =>
      (...args) => {
        setDirty(true);
        setter(...args);
      },
    [],
  );

  const markClean = useCallback(() => setDirty(false), []);

  return { dirty, track, markClean };
}
