// Pure rules for the messaging channel Configure/Connect flow, mirroring
// src/pages/infrastructures/hooks/networkInterfaceConfig.js for the ACRS
// Networks tab's "Configure Network" flow.

// Where the Configure dialog was opened from. The modal needs this alongside
// the channel's connection state to pick its primary button.
export const ENTRY_POINT = Object.freeze({
  CONNECT: "connect",
  CONFIGURE: "configure",
});

export const SUBMIT_ACTION = Object.freeze({
  SAVE: "save",
  SAVE_AND_CONNECT: "save-and-connect",
});

export const SUBMIT_LABEL = Object.freeze({
  [SUBMIT_ACTION.SAVE]: "Save",
  [SUBMIT_ACTION.SAVE_AND_CONNECT]: "Save & Connect",
});

// Every disconnect is confirmed, since it immediately stops ArcGenie from
// sending reports, alerts, and insights to the channel.
export const DISCONNECT_DESCRIPTION =
  "ArcGenie will stop sending messages to this channel until it's connected again. Continue?";

/**
 * Whether a channel has a usable routing config: a channel/room selected to
 * send to. A freshly-picked service has none yet, so Connect has to collect
 * one first instead of connecting immediately.
 */
export function hasChannelConfig(channel) {
  return Boolean(channel?.channelName);
}

/**
 * The modal's primary action for a given entry point and connection state —
 * connecting a channel is immediate (no reconnect concept, unlike a NIC's
 * link), so this only ever resolves to Save or Save & Connect.
 */
export function resolveSubmitAction({ entryPoint, connected }) {
  if (connected) return SUBMIT_ACTION.SAVE;
  return entryPoint === ENTRY_POINT.CONNECT ? SUBMIT_ACTION.SAVE_AND_CONNECT : SUBMIT_ACTION.SAVE;
}
