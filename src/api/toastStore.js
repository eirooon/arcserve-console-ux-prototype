const MAX_VISIBLE_TOASTS = 3;
const AUTO_HIDE_MS = 4000;

let toasts = [];
let nextId = 0;
const listeners = new Set();
const timers = new Map();

function notify() {
  listeners.forEach((listener) => listener());
}

function clearTimer(id) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
}

function dismissToast(id) {
  clearTimer(id);
  const next = toasts.filter((toast) => toast.id !== id);
  if (next.length === toasts.length) return;
  toasts = next;
  notify();
}

/**
 * Adds a toast to the top of the stack. Oldest toast is dropped once more
 * than MAX_VISIBLE_TOASTS are queued, same as it would auto-hide anyway —
 * this just makes room for the new one immediately instead of waiting.
 */
function pushToast(message, severity = "success") {
  const id = ++nextId;
  const withNew = [{ id, message, severity }, ...toasts];
  const overflow = withNew.slice(MAX_VISIBLE_TOASTS);
  toasts = withNew.slice(0, MAX_VISIBLE_TOASTS);
  overflow.forEach((toast) => clearTimer(toast.id));
  timers.set(
    id,
    setTimeout(() => dismissToast(id), AUTO_HIDE_MS),
  );
  notify();
  return id;
}

export const toastStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return toasts;
  },
  pushToast,
  dismissToast,
};
