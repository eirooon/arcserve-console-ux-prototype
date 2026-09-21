import { useEffect, useRef, useState } from "react";

const DEFAULT_DELAY_MS = 600;

/**
 * Drives a search input that commits its value either after the user pauses
 * typing for `delayMs`, or immediately on Enter — the two triggers a search
 * box conventionally supports. `committedValue`/`onCommit` are the actual
 * applied search term owned by the caller (e.g. what's used to filter rows);
 * this hook only manages the input's own in-progress draft text and the
 * debounce timing, so the draft stays in sync if the committed value is ever
 * changed from elsewhere (e.g. a "Clear" button next to the results).
 */
export function useDebouncedSearchInput(committedValue, onCommit, delayMs = DEFAULT_DELAY_MS) {
  const [draft, setDraft] = useState(committedValue);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setDraft(committedValue);
  }, [committedValue]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const commit = (value) => {
    clearTimeout(timeoutRef.current);
    onCommit(value.trim());
  };

  const handleChange = (value) => {
    setDraft(value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => commit(value), delayMs);
  };

  return {
    value: draft,
    onChange: handleChange,
    onSubmit: () => commit(draft),
  };
}
