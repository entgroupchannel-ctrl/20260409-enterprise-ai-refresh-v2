import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Soft content protection (anti-copy/scrape).
 * - Blocks right-click, text selection, image drag, and DevTools shortcuts
 * - Allows: bots (Googlebot/Bingbot), authenticated admin/staff, and elements
 *   marked with [data-allow-copy] (phone, email, Line ID, form inputs)
 */
const BOT_RE = /bot|crawler|spider|crawling|googlebot|bingbot|yandex|duckduck|baidu|facebookexternalhit|slurp|sogou/i;

const isBot = () => typeof navigator !== "undefined" && BOT_RE.test(navigator.userAgent);

const isAdminLogged = () => {
  try {
    // Check Supabase auth token + role markers cached on app
    const keys = Object.keys(localStorage);
    const hasAuth = keys.some((k) => k.includes("auth-token") || k.includes("supabase"));
    const isStaff = localStorage.getItem("ent-is-staff") === "1";
    return hasAuth && isStaff;
  } catch {
    return false;
  }
};

const isAllowedTarget = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  // Allow on form fields and explicitly tagged elements
  if (el.closest("input, textarea, select, [contenteditable='true'], [data-allow-copy]")) return true;
  // Allow copying contact info inside footer/contact areas
  if (el.closest("a[href^='tel:'], a[href^='mailto:'], a[href*='line.me'], a[href*='lin.ee']")) return true;
  return false;
};

let warnedOnce = false;
const warn = (msg: string) => {
  if (warnedOnce) return;
  warnedOnce = true;
  toast.info(msg, { duration: 2500 });
  setTimeout(() => { warnedOnce = false; }, 3000);
};

export function useContentProtection(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (isBot()) return; // SEO friendly
    if (isAdminLogged()) return; // staff bypass

    const onContextMenu = (e: MouseEvent) => {
      if (isAllowedTarget(e.target)) return;
      e.preventDefault();
      warn("เนื้อหานี้ได้รับการคุ้มครอง · ติดต่อ ENT Group เพื่อขอข้อมูล");
    };

    const onSelectStart = (e: Event) => {
      if (isAllowedTarget(e.target)) return;
      e.preventDefault();
    };

    const onCopy = (e: ClipboardEvent) => {
      if (isAllowedTarget(e.target)) return;
      e.preventDefault();
      warn("ห้ามคัดลอกเนื้อหา · กรุณาติดต่อขอใบเสนอราคา");
    };

    const onDragStart = (e: DragEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.tagName === "IMG") {
        e.preventDefault();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      // F12
      if (e.key === "F12") { e.preventDefault(); warn("ปิดการใช้งาน DevTools"); return; }
      // Ctrl/Cmd + Shift + I/J/C  (DevTools/Inspect)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(k)) {
        e.preventDefault(); warn("ปิดการใช้งาน DevTools"); return;
      }
      // Ctrl/Cmd + U (view source)
      if ((e.ctrlKey || e.metaKey) && k === "u") {
        e.preventDefault(); warn("ปิดการดู source"); return;
      }
      // Ctrl/Cmd + S (save page)
      if ((e.ctrlKey || e.metaKey) && k === "s") {
        e.preventDefault(); warn("ปิดการบันทึกหน้าเว็บ"); return;
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("copy", onCopy);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown);

    // CSS-based selection block (excluding allowed)
    const styleEl = document.createElement("style");
    styleEl.id = "ent-content-protection";
    styleEl.textContent = `
      body { -webkit-touch-callout: none; }
      body, body * { -webkit-user-select: none; -ms-user-select: none; user-select: none; }
      input, textarea, select, [contenteditable="true"], [data-allow-copy], [data-allow-copy] *,
      a[href^="tel:"], a[href^="mailto:"], a[href*="line.me"], a[href*="lin.ee"] {
        -webkit-user-select: text !important; user-select: text !important;
      }
      img { -webkit-user-drag: none; user-drag: none; pointer-events: auto; }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown);
      styleEl.remove();
    };
  }, [enabled]);
}

export default useContentProtection;
