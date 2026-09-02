import { useEffect, useState } from "react";
import { apiClient } from "./client";

/**
 * Fetches a list resource from the API (real or MSW-mocked) and exposes it
 * in the shape MUI DataGrid tables expect: rows/loading/error.
 */
export function useApiResource(path) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get(path)
      .then((data) => {
        if (!cancelled) setRows(data ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return { rows, loading, error };
}
