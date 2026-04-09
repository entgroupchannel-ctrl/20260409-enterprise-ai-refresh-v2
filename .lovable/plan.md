

## Session Health Monitoring Dashboard for Admin

### Goal
Add a "Session Monitor" tab to the Admin Dashboard that displays real-time session health metrics: JWT refresh count, permission load time, tab switch recovery events, and current token status.

### Approach
Create a lightweight in-memory metrics store (no database changes needed) that captures events from the existing Session Recovery v3 and usePermissions logic, then display them in a new admin tab.

### Files to create/modify

**1. Create `src/hooks/useSessionMetrics.ts`** — Singleton metrics store
- Global object that tracks: `jwtRefreshCount`, `jwtRefreshErrors`, `permissionLoadTimeMs`, `lastRefreshTimestamp`, `tabSwitchCount`, `tokenExpiresAt`, `sessionStatus` (healthy/expiring/expired/none)
- Export helper functions: `recordRefresh()`, `recordPermissionLoad(ms)`, `recordTabSwitch()`, `getMetrics()`
- Uses a simple event emitter pattern (or React state via context) so the dashboard component re-renders on changes

**2. Modify `src/App.tsx`** — Instrument Session Recovery v3
- After successful `guardedRefresh()`: call `recordRefresh()`
- On visibility change handler: call `recordTabSwitch()`
- After `getSession()` — update token expiry in metrics

**3. Modify `src/hooks/usePermissions.ts`** — Instrument permission load timing
- Record `performance.now()` before and after the fetch, call `recordPermissionLoad(delta)`

**4. Create `src/components/AdminSessionMonitor.tsx`** — Dashboard UI
- 4 stat cards at top: Token Status (with color badge), JWT Refresh Count, Permission Load Time (ms), Tab Switch Count
- Token expiry countdown (live updating every second)
- Recent events log (last 20 events with timestamps)
- "Reset Counters" button
- Uses existing shadcn Card, Badge components — matches admin dashboard styling

**5. Modify `src/pages/AdminDashboard.tsx`** — Add tab
- Add `"session_monitor"` to the Tab type
- Add sidebar menu item (Shield icon) — visible only to super_admin
- Render `AdminSessionMonitor` when tab is active

### Technical Details
- No database changes — all metrics are in-memory (reset on page refresh)
- No new dependencies
- Metrics store uses a simple pub/sub pattern with `useSyncExternalStore` for React integration
- Only super_admin can see this tab (gated by `isSuperAdmin` check)
- Lightweight: no polling, event-driven updates only

### Result
Super admins get a real-time view of session health, helping diagnose "stuck loading" or JWT issues without opening browser DevTools.

