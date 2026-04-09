import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { recordPermissionLoad } from "@/hooks/useSessionMetrics";

export type AccessLevel = "none" | "view" | "edit";

export const PERMISSION_KEYS = [
  "sales.contacts",
  "sales.quotes",
  "sales.quote_review",
  "sales.chatleads",
  "sales.software",
  "product.catalog",
  "product.documents",
  "marketing.engagement",
  "marketing.subscribers",
  "system.users",
] as const;

export type PermissionKey = typeof PERMISSION_KEYS[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  "sales.contacts": "ติดต่อเข้ามา",
  "sales.quotes": "ใบเสนอราคา",
  "sales.quote_review": "จัดการ Quote",
  "sales.chatleads": "AI Chat Leads",
  "sales.software": "สอบถามซอฟต์แวร์",
  "product.catalog": "สินค้า + ราคา",
  "product.documents": "คลังเอกสาร",
  "marketing.engagement": "Engagement",
  "marketing.subscribers": "สมาชิก",
  "system.users": "จัดการผู้ใช้",
};

export const PERMISSION_GROUPS: { label: string; keys: PermissionKey[] }[] = [
  { label: "งานขาย", keys: ["sales.contacts", "sales.quotes", "sales.quote_review", "sales.chatleads", "sales.software"] },
  { label: "สินค้า", keys: ["product.catalog", "product.documents"] },
  { label: "การตลาด", keys: ["marketing.engagement", "marketing.subscribers"] },
  { label: "ระบบ", keys: ["system.users"] },
];

export interface PermissionPreset {
  label: string;
  permissions: Record<PermissionKey, AccessLevel>;
}

export const PRESETS: Record<string, PermissionPreset> = {
  super_admin: {
    label: "Super Admin (ทุกสิทธิ์)",
    permissions: Object.fromEntries(PERMISSION_KEYS.map((k) => [k, "edit"])) as Record<PermissionKey, AccessLevel>,
  },
  sales_manager: {
    label: "ผู้จัดการฝ่ายขาย",
    permissions: {
      "sales.contacts": "edit", "sales.quotes": "edit", "sales.quote_review": "edit",
      "sales.chatleads": "edit", "sales.software": "edit",
      "product.catalog": "view", "product.documents": "view",
      "marketing.engagement": "view", "marketing.subscribers": "none",
      "system.users": "none",
    },
  },
  sales_staff: {
    label: "พนักงานขาย",
    permissions: {
      "sales.contacts": "view", "sales.quotes": "view", "sales.quote_review": "view",
      "sales.chatleads": "view", "sales.software": "view",
      "product.catalog": "view", "product.documents": "view",
      "marketing.engagement": "none", "marketing.subscribers": "none",
      "system.users": "none",
    },
  },
  marketing: {
    label: "ฝ่ายการตลาด",
    permissions: {
      "sales.contacts": "view", "sales.quotes": "view", "sales.quote_review": "none",
      "sales.chatleads": "view", "sales.software": "none",
      "product.catalog": "view", "product.documents": "edit",
      "marketing.engagement": "edit", "marketing.subscribers": "edit",
      "system.users": "none",
    },
  },
  viewer: {
    label: "ดูอย่างเดียว (Read-only)",
    permissions: Object.fromEntries(PERMISSION_KEYS.map((k) => [k, "view"])) as Record<PermissionKey, AccessLevel>,
  },
};

type PermissionsMap = Record<PermissionKey, AccessLevel>;

export function usePermissions() {
  const { user, isSuperAdmin } = useAuth();
  const [permissions, setPermissions] = useState<PermissionsMap | null>(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // CRITICAL: Depend on user.id (primitive) instead of user object reference.
  const userId = user?.id ?? null;

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!userId) {
      setPermissions(null);
      setLoading(false);
      return;
    }

    // Super admin always gets full edit
    if (isSuperAdmin) {
      setPermissions(
        Object.fromEntries(PERMISSION_KEYS.map((k) => [k, "edit"])) as PermissionsMap
      );
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    // ✅ FIX: 10s timeout — force setLoading(false) to prevent infinite stuck
    timeoutRef.current = setTimeout(() => {
      if (!cancelled) {
        console.error('[usePermissions] ⏱️ TIMEOUT after 10s — forcing loading=false');
        setLoading(false);
        setPermissions(null);
      }
    }, 10_000);

    const fetchPermissions = async () => {
      const MAX_RETRIES = 2;
      let retryCount = 0;
      const t0 = performance.now();

      try {
        // ✅ FIX: Check session before query
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !sessionData?.session) {
          console.warn('[usePermissions] No valid session');
          if (!cancelled) {
            setPermissions(null);
            setLoading(false);
          }
          return;
        }

        // ✅ FIX: Smart retry on JWT errors
        while (retryCount <= MAX_RETRIES) {
          const { data, error } = await supabase
            .from("admin_permissions")
            .select("permission_key, access_level")
            .eq("user_id", userId);

          if (error) {
            const isJWTError =
              error.code === 'PGRST301' ||
              String(error.message || '').toLowerCase().includes('jwt') ||
              String(error.message || '').toLowerCase().includes('expired');

            if (isJWTError && retryCount < MAX_RETRIES) {
              console.warn(`[usePermissions] JWT error, refreshing session (${retryCount + 1}/${MAX_RETRIES})`);
              const { error: refreshError } = await supabase.auth.refreshSession();
              if (refreshError) {
                console.error('[usePermissions] Session refresh failed');
                break;
              }
              retryCount++;
              await new Promise((r) => setTimeout(r, 500));
              continue;
            }

            // Non-JWT error or max retries
            console.error('[usePermissions] Query error:', error.message);
            break;
          }

          // Success
          if (cancelled) return;

          const map: PermissionsMap = Object.fromEntries(
            PERMISSION_KEYS.map((k) => [k, "none"])
          ) as PermissionsMap;

          if (data) {
            data.forEach((row: { permission_key: string; access_level: string }) => {
              if (row.permission_key in map) {
                map[row.permission_key as PermissionKey] = row.access_level as AccessLevel;
              }
            });
          }

          setPermissions(map);
          setLoading(false);
          recordPermissionLoad(performance.now() - t0);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          return;
        }

        // All retries failed
        if (!cancelled) {
          setPermissions(null);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error('[usePermissions] Error:', err?.message);
          setPermissions(null);
          setLoading(false);
        }
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    fetchPermissions();

    return () => {
      cancelled = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [userId, isSuperAdmin]);

  const can = useCallback(
    (key: PermissionKey, level: AccessLevel = "view"): boolean => {
      if (isSuperAdmin) return true;
      if (!permissions) return false;
      const userLevel = permissions[key];
      if (level === "view") return userLevel === "view" || userLevel === "edit";
      if (level === "edit") return userLevel === "edit";
      return false;
    },
    [permissions, isSuperAdmin]
  );

  const getLevel = useCallback(
    (key: PermissionKey): AccessLevel => {
      if (isSuperAdmin) return "edit";
      if (!permissions) return "none";
      return permissions[key] || "none";
    },
    [permissions, isSuperAdmin]
  );

  return { permissions, loading, can, getLevel };
}
