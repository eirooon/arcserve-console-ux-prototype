import { useCallback, useRef } from "react";

/**
 * Named refs for form controls, so a form can move focus to a field by
 * name (e.g. the first invalid one). `register(name)` returns the same
 * callback ref every render, so React doesn't detach/reattach it on each
 * keystroke.
 */
export function useFieldRefs() {
  const nodes = useRef({});
  const callbacks = useRef({});

  const register = useCallback((name) => {
    callbacks.current[name] ??= (node) => {
      nodes.current[name] = node;
    };
    return callbacks.current[name];
  }, []);

  const focus = useCallback((name) => {
    nodes.current[name]?.focus();
  }, []);

  return { register, focus };
}
