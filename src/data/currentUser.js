// The app has no auth/session model yet, so this is the single stand-in for
// "who's using the console right now" — previously duplicated as a local
// literal inside AppNavigation.jsx. Anything that needs to attribute an
// action to the current person (activity log entries, dismissal records)
// should read from here instead of inventing its own copy, so a future real
// identity provider only has to be wired in once.
export const CURRENT_USER = {
  name: "Erron Sevilla",
  organization: "Arcserve",
  initials: "ES",
  planLabel: "Pro",
  version: "v1.5.69",
};
