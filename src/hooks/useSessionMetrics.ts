import { useSyncExternalStore } from "react";

export interface SessionEvent {
  type: "refresh_ok" | "refresh_fail" | "tab_switch" | "permission_load" | "timeout" | "session_check";
  timestamp: number;
  detail?: string;
}

export interface SessionMetrics {
  jwtRefreshCount: number;
  jwtRefreshErrors: number;
  tabSwitchCount: number;
  permissionLoadTimeMs: number;
  lastRefreshTimestamp: number | null;
  tokenExpiresAt: number | null;
  sessionStatus: "healthy" | "expiring" | "expired" | "none";
  events: SessionEvent[];
}

const MAX_EVENTS = 30;

let metrics: SessionMetrics = {
  jwtRefreshCount: 0,
  jwtRefreshErrors: 0,
  tabSwitchCount: 0,
  permissionLoadTimeMs: 0,
  lastRefreshTimestamp: null,
  tokenExpiresAt: null,
  sessionStatus: "none",
  events: [],
};

let listeners = new Set<() => void>();
let version = 0;

function notify() {
  version++;
  listeners.forEach((l) => l());
}

function pushEvent(evt: Omit<SessionEvent, "timestamp">) {
  metrics.events = [{ ...evt, timestamp: Date.now() }, ...metrics.events].slice(0, MAX_EVENTS);
}

// ── Public recording functions (called from App.tsx / usePermissions) ──

export function recordRefresh(success: boolean, detail?: string) {
  if (success) {
    metrics.jwtRefreshCount++;
    metrics.lastRefreshTimestamp = Date.now();
    pushEvent({ type: "refresh_ok", detail });
  } else {
    metrics.jwtRefreshErrors++;
    pushEvent({ type: "refresh_fail", detail });
  }
  notify();
}

export function recordTabSwitch(hiddenDurationMs: number) {
  metrics.tabSwitchCount++;
  pushEvent({ type: "tab_switch", detail: `${Math.round(hiddenDurationMs / 1000)}s away` });
  notify();
}

export function recordPermissionLoad(ms: number) {
  metrics.permissionLoadTimeMs = Math.round(ms);
  pushEvent({ type: "permission_load", detail: `${Math.round(ms)}ms` });
  notify();
}

export function updateTokenExpiry(expiresAtMs: number | null) {
  metrics.tokenExpiresAt = expiresAtMs;
  if (!expiresAtMs) {
    metrics.sessionStatus = "none";
  } else {
    const timeLeft = expiresAtMs - Date.now();
    metrics.sessionStatus = timeLeft > 120_000 ? "healthy" : timeLeft > 0 ? "expiring" : "expired";
  }
  notify();
}

export function resetMetrics() {
  metrics = {
    jwtRefreshCount: 0,
    jwtRefreshErrors: 0,
    tabSwitchCount: 0,
    permissionLoadTimeMs: 0,
    lastRefreshTimestamp: null,
    tokenExpiresAt: metrics.tokenExpiresAt,
    sessionStatus: metrics.sessionStatus,
    events: [],
  };
  notify();
}

export function getMetrics(): SessionMetrics {
  return metrics;
}

// ── React hook via useSyncExternalStore ──

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return version;
}

export function useSessionMetrics() {
  useSyncExternalStore(subscribe, getSnapshot);
  return metrics;
}
