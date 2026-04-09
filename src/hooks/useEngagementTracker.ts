import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── Session ID (per browser tab) ───
function getSessionId(): string {
  const KEY = "ent_session_id";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID?.() || `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

// ─── Types ───
type EventType =
  | "product_view"
  | "wishlist_add"
  | "wishlist_remove"
  | "share_line"
  | "share_facebook"
  | "share_email"
  | "share_copy_link"
  | "quote_request"
  | "contact_submit"
  | "chat_inquiry";

interface TrackEventParams {
  eventType: EventType;
  productId?: string;
  productCategory?: string;
  productName?: string;
  channel?: string;
  metadata?: Record<string, unknown>;
}

// ─── Hook ───
export function useEngagementTracker() {
  const debounceRef = useRef<Record<string, number>>({});

  const trackEvent = useCallback(
    ({
      eventType,
      productId,
      productCategory,
      productName,
      channel,
      metadata = {},
    }: TrackEventParams) => {
      try {
        // Debounce product_view: same id within 30s → skip
        if (eventType === "product_view" && productId) {
          const key = `product_view:${productId}`;
          const now = Date.now();
          if (debounceRef.current[key] && now - debounceRef.current[key] < 30_000) {
            return;
          }
          debounceRef.current[key] = now;
        }

        const sessionId = getSessionId();

        // Fire-and-forget insert
        (async () => {
          try {
            const {
              data: { session },
            } = await supabase.auth.getSession();

            await supabase.from("engagement_events").insert([{
              user_id: session?.user?.id || null,
              session_id: sessionId,
              event_type: eventType,
              product_id: productId || null,
              product_category: productCategory || null,
              product_name: productName || null,
              channel: channel || null,
              page_url: window.location.pathname,
              metadata: metadata as any,
            }]);
          } catch (err) {
            // Silent — never block UI
            console.warn("[engagement-tracker]", err);
          }
        })();
      } catch {
        // outer safety net
      }
    },
    []
  );

  return { trackEvent };
}
