import { useEffect } from "react";

/**
 * Soft content protection (anti-copy/scrape).
 * - Blocks right-click, text selection, image drag, and DevTools shortcuts on PUBLIC pages
 * - Allows: bots (SEO), authenticated staff, internal/backoffice routes (admin & customer portal)
 * - Honors [data-allow-copy], form fields, and contact links (tel/mailto/line)
 * - Silent: no toasts or warnings
 */
const BOT_RE = /bot|crawler|spider|crawling|googlebot|bingbot|yandex|duckduck|baidu|facebookexternalhit|slurp|sogou/i;
const isBot = () => typeof navigator !== "undefined" && BOT_RE.test(navigator.userAgent);

// Any authenticated user (customer or staff) bypasses protection on every page
const isLoggedIn = () => {
  try {
    return Object.keys(localStorage).some(
      (k) => k.includes("auth-token") || (k.startsWith("sb-") && k.includes("-auth-"))
    );
  } catch {
    return false;
  }
};

// Internal/backoffice routes — fully open for both staff & customer portal
const INTERNAL_ROUTE_RE = /^\/(admin|dashboard|profile|notifications|cart|my-account|my-quotes|my-orders|my-invoices|my-tax-invoices|my-receipts|my-documents|my-repairs|my|debug-test|affiliate-dashboard|partner-portal)(\/|$|\?)/i;

const isInternalRoute = () => {
  try {
    return INTERNAL_ROUTE_RE.test(window.location.pathname);
  } catch {
    return false;
  }
};

const isAllowedTarget = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  if (el.closest("input, textarea, select, [contenteditable='true'], [data-allow-copy]")) return true;
  if (el.closest("a[href^='tel:'], a[href^='mailto:'], a[href*='line.me'], a[href*='lin.ee']")) return true;
  return false;
};

export function useContentProtection(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (isBot()) return;

    // Re-check on every event so login/logout takes effect immediately
    const isProtectedNow = () => !isLoggedIn() && !isInternalRoute();

    // Toggle body class so CSS rules apply only on public routes for guests
    const syncBodyClass = () => {
      const open = isLoggedIn() || isInternalRoute();
      document.body.classList.toggle("ent-internal-route", open);
    };
    syncBodyClass();

    // Watch for SPA navigation
    let lastPath = window.location.pathname;
    const pathPoll = window.setInterval(() => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        syncBodyClass();
      }
    }, 500);

    const onContextMenu = (e: MouseEvent) => {
      if (!isProtectedNow()) return;
      if (isAllowedTarget(e.target)) return;
      e.preventDefault();
    };
    const onSelectStart = (e: Event) => {
      if (!isProtectedNow()) return;
      if (isAllowedTarget(e.target)) return;
      e.preventDefault();
    };
    const onCopy = (e: ClipboardEvent) => {
      if (!isProtectedNow()) return;
      if (isAllowedTarget(e.target)) return;
      e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      if (!isProtectedNow()) return;
      const t = e.target as HTMLElement | null;
      if (t?.tagName === "IMG") e.preventDefault();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isProtectedNow()) return;
      const k = e.key.toLowerCase();
      if (e.key === "F12") { e.preventDefault(); return; }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(k)) { e.preventDefault(); return; }
      if ((e.ctrlKey || e.metaKey) && (k === "u" || k === "s")) { e.preventDefault(); return; }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("copy", onCopy);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown);

    const styleEl = document.createElement("style");
    styleEl.id = "ent-content-protection";
    styleEl.textContent = `
      body:not(.ent-internal-route) { -webkit-touch-callout: none; }
      body:not(.ent-internal-route), body:not(.ent-internal-route) * {
        -webkit-user-select: none; -ms-user-select: none; user-select: none;
      }
      body:not(.ent-internal-route) input,
      body:not(.ent-internal-route) textarea,
      body:not(.ent-internal-route) select,
      body:not(.ent-internal-route) [contenteditable="true"],
      body:not(.ent-internal-route) [data-allow-copy],
      body:not(.ent-internal-route) [data-allow-copy] *,
      body:not(.ent-internal-route) a[href^="tel:"],
      body:not(.ent-internal-route) a[href^="mailto:"],
      body:not(.ent-internal-route) a[href*="line.me"],
      body:not(.ent-internal-route) a[href*="lin.ee"] {
        -webkit-user-select: text !important; user-select: text !important;
      }
      body:not(.ent-internal-route) img { -webkit-user-drag: none; user-drag: none; }
    `;
    document.head.appendChild(styleEl);

    return () => {
      window.clearInterval(pathPoll);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown);
      styleEl.remove();
      document.body.classList.remove("ent-internal-route");
    };
  }, [enabled]);
}

export default useContentProtection;
