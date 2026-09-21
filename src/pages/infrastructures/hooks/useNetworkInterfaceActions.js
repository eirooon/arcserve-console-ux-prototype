import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { acrsServersStore } from "./useAcrsServersData";
import { SUBMIT_ACTION, hasNetworkConfig } from "./networkInterfaceConfig";

// The mock API resolves a PUT almost instantly, which would make the
// Connect/Disconnect button's loading state flash too briefly to actually
// see. Holding it for at least this long keeps it perceivable without
// meaningfully slowing down the action.
export const MIN_CONNECTING_DURATION_MS = 500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const replaceNic = (nics, updatedNic) => nics.map((nic) => (nic.id === updatedNic.id ? updatedNic : nic));

/**
 * Owns every write the ACRS Networks tab can make: bringing a link up or
 * down, saving a NIC's configuration (optionally connecting or cycling the
 * link as part of it), and the confirmation that gates every disconnect
 * (worded more strongly for the interface the admin's management session is
 * routed through, flagged on the NIC as `managementSession`).
 */
export function useNetworkInterfaceActions({ serverId, nics, onConfigureRequired }) {
  const [saving, setSaving] = useState(false);
  const [busyIds, setBusyIds] = useState(() => new Set());
  const [pendingDisconnect, setPendingDisconnect] = useState(null);

  // Handlers read the latest list through a ref so their identity stays
  // stable across refetches, letting memoized cards skip unrelated updates.
  const nicsRef = useRef(nics);
  useEffect(() => {
    nicsRef.current = nics;
  }, [nics]);

  const persist = useCallback(
    async (nextNics) => {
      await apiClient.put(`${ENDPOINTS.ACRS_SERVERS}/${serverId}`, { networkInterfaces: nextNics });
      await acrsServersStore.refetch();
    },
    [serverId],
  );

  const runWithBusyIndicator = useCallback(async (nicId, task) => {
    setBusyIds((current) => new Set(current).add(nicId));
    try {
      await Promise.all([task(), wait(MIN_CONNECTING_DURATION_MS)]);
    } finally {
      setBusyIds((current) => {
        const next = new Set(current);
        next.delete(nicId);
        return next;
      });
    }
  }, []);

  const setConnected = useCallback(
    (nic, connected) =>
      runWithBusyIndicator(nic.id, () => persist(replaceNic(nicsRef.current, { ...nic, connected }))),
    [persist, runWithBusyIndicator],
  );

  // Brings the link up with the last-saved configuration.
  const connect = useCallback((nic) => setConnected(nic, true), [setConnected]);
  const disconnect = useCallback((nic) => setConnected(nic, false), [setConnected]);

  // Connect/Disconnect button. Connecting is immediate when the interface has
  // saved settings; otherwise (a newly added device) it hands off to
  // `onConfigureRequired` so the caller can collect a config and connect as
  // part of saving it. Disconnecting always asks for confirmation first.
  const toggleConnection = useCallback(
    (nic) => {
      if (nic.connected) {
        setPendingDisconnect(nic);
        return undefined;
      }
      if (!hasNetworkConfig(nic)) {
        onConfigureRequired(nic);
        return undefined;
      }
      return connect(nic);
    },
    [connect, onConfigureRequired],
  );

  const confirmDisconnect = useCallback(async () => {
    const nic = pendingDisconnect;
    setPendingDisconnect(null);
    if (nic) await disconnect(nic);
  }, [pendingDisconnect, disconnect]);

  const cancelDisconnect = useCallback(() => setPendingDisconnect(null), []);

  // Modal submit. `updatedNic` carries the edited config with the NIC's
  // existing `connected` value; `action` says what to do with the link.
  const saveConfig = useCallback(
    async (updatedNic, action) => {
      setSaving(true);
      try {
        if (action === SUBMIT_ACTION.SAVE_AND_CONNECT) {
          await runWithBusyIndicator(updatedNic.id, () =>
            persist(replaceNic(nicsRef.current, { ...updatedNic, connected: true })),
          );
        } else if (action === SUBMIT_ACTION.SAVE_AND_RECONNECT) {
          // Cycle the link: take it down with the new config, then bring it back up.
          await runWithBusyIndicator(updatedNic.id, async () => {
            await persist(replaceNic(nicsRef.current, { ...updatedNic, connected: false }));
            await wait(MIN_CONNECTING_DURATION_MS);
            await persist(replaceNic(nicsRef.current, { ...updatedNic, connected: true }));
          });
        } else {
          await persist(replaceNic(nicsRef.current, updatedNic));
        }
      } finally {
        setSaving(false);
      }
    },
    [persist, runWithBusyIndicator],
  );

  return {
    saving,
    busyIds,
    pendingDisconnect,
    toggleConnection,
    confirmDisconnect,
    cancelDisconnect,
    saveConfig,
  };
}
