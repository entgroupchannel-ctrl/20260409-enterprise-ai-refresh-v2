import { supabase } from "@/integrations/supabase/client";

export type NotificationPriority = "urgent" | "high" | "normal";

interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
  linkType?: string;
  linkId?: string;
}

// ──────────────── Phase 1: Centralized Dispatcher ────────────────

interface DispatchEventParams {
  eventKey: string;
  recipientUserId?: string;
  recipientRole?: "admin" | "super_admin";
  title?: string;
  message?: string;
  actionUrl?: string;
  actionLabel?: string;
  linkType?: string;
  linkId?: string;
  metadata?: Record<string, unknown>;
  actorId?: string;
}

/**
 * Centralized notification dispatcher (Phase 1 Foundation).
 *
 * Single entry point for all notification events. Handles:
 * - Event registry validation (notification_events)
 * - User preference checks (notification_preferences)
 * - Critical event override (bypass preference)
 * - In-app notification insert
 * - Audit log (notification_dispatch_log)
 *
 * Prefer this over `createNotification` / `notifyAdmins` for new code.
 * Fire-and-forget; logs errors but does not throw.
 */
export async function dispatchNotificationEvent(params: DispatchEventParams) {
  try {
    const { data, error } = await (supabase as any).rpc("dispatch_notification_event", {
      p_event_key: params.eventKey,
      p_recipient_user_id: params.recipientUserId ?? null,
      p_recipient_role: params.recipientRole ?? null,
      p_title: params.title ?? null,
      p_message: params.message ?? null,
      p_action_url: params.actionUrl ?? null,
      p_action_label: params.actionLabel ?? null,
      p_link_type: params.linkType ?? null,
      p_link_id: params.linkId ?? null,
      p_metadata: params.metadata ?? {},
      p_actor_id: params.actorId ?? null,
    });

    if (error) {
      console.error(`[dispatchNotificationEvent:${params.eventKey}] error:`, error);
      return null;
    }
    const row = Array.isArray(data) ? data[0] : data;
    console.log(
      `[dispatchNotificationEvent:${params.eventKey}] recipients=${row?.recipients_count ?? 0} enqueued=${row?.enqueued_count ?? 0} skipped=${row?.skipped_count ?? 0}`
    );
    return row;
  } catch (e) {
    console.error(`[dispatchNotificationEvent:${params.eventKey}] exception:`, e);
    return null;
  }
}

// ──────────────── Legacy helpers (kept for backward compat) ────────────────

/**
 * Insert a single in-app notification for a specific user.
 * Fires-and-forgets (logs errors but does not throw).
 *
 * @deprecated Prefer `dispatchNotificationEvent` with a registered event_key.
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const { error } = await (supabase as any).from("notifications").insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      priority: params.priority ?? "normal",
      action_url: params.actionUrl ?? null,
      action_label: params.actionLabel ?? null,
      link_type: params.linkType ?? null,
      link_id: params.linkId ?? null,
    });
    if (error) console.error("createNotification error:", error);
  } catch (e) {
    console.error("createNotification exception:", e);
  }
}

/**
 * Notify all admin users about an event.
 *
 * @deprecated Prefer `dispatchNotificationEvent({ recipientRole: 'admin', ... })`.
 */
export async function notifyAdmins(
  params: Omit<CreateNotificationParams, "userId">
) {
  try {
    const { data, error } = await (supabase as any).rpc("notify_admins", {
      p_type: params.type,
      p_title: params.title,
      p_message: params.message,
      p_priority: params.priority ?? "normal",
      p_action_url: params.actionUrl ?? null,
      p_action_label: params.actionLabel ?? null,
      p_link_type: params.linkType ?? null,
      p_link_id: params.linkId ?? null,
    });

    if (error) {
      console.error("notifyAdmins RPC error:", error);
      return;
    }
    console.log(`[notifyAdmins] enqueued ${data ?? 0} admin notifications (${params.type})`);
  } catch (e) {
    console.error("notifyAdmins exception:", e);
  }
}

// ──────────────── Email via Resend (Connector Gateway) ────────────────

/**
 * Send auto-reply email (contact form / quote request) via send-auto-reply Edge Function.
 * Fire-and-forget.
 */
export async function sendAutoReplyEmail(params: {
  type: "contact" | "quote-request";
  recipientEmail: string;
  recipientName?: string;
  quoteRef?: string;
}) {
  try {
    const { error } = await supabase.functions.invoke("send-auto-reply", {
      body: {
        type: params.type,
        recipientEmail: params.recipientEmail,
        recipientName: params.recipientName,
        quoteRef: params.quoteRef,
      },
    });
    if (error) console.error("sendAutoReplyEmail error:", error);
  } catch (e) {
    console.error("sendAutoReplyEmail exception:", e);
  }
}

/**
 * Send the same status email to all admins.
 * Looks up admin user IDs in user_roles, fetches emails from profiles,
 * and fans out one email per admin via notify-quote-status.
 * Fire-and-forget.
 */
export async function notifyAdminsByEmail(params: {
  subject: string;
  status: string;
  customerName?: string;
  quoteNumber?: string;
  invoiceNumber?: string;
  amount?: string;
  viewUrl?: string;
  note?: string;
}) {
  try {
    // Get admin user IDs
    const { data: roles } = await (supabase as any)
      .from("user_roles")
      .select("user_id")
      .in("role", ["admin", "super_admin"]);

    if (!roles?.length) return;
    const userIds = roles.map((r: any) => r.user_id);

    // Get admin emails from profiles
    const { data: profiles } = await (supabase as any)
      .from("profiles")
      .select("email")
      .in("id", userIds);

    const emails = (profiles || [])
      .map((p: any) => p?.email)
      .filter((e: string | null | undefined): e is string => !!e);

    if (!emails.length) {
      console.warn("notifyAdminsByEmail: no admin emails found");
      return;
    }

    // Fan-out one email per admin (parallel)
    await Promise.all(
      emails.map((email: string) =>
        supabase.functions.invoke("notify-quote-status", {
          body: {
            recipientEmail: email,
            customerName: params.customerName,
            quoteNumber: params.quoteNumber,
            status: params.status,
            invoiceNumber: params.invoiceNumber,
            amount: params.amount,
            viewUrl: params.viewUrl,
            note: params.note,
          },
        }).catch((e) => console.error("notifyAdminsByEmail fanout error:", e))
      )
    );
  } catch (e) {
    console.error("notifyAdminsByEmail exception:", e);
  }
}

/**
 * Send quote / invoice status notification email via notify-quote-status Edge Function.
 * Fire-and-forget.
 */
export async function sendQuoteStatusEmail(params: {
  recipientEmail: string;
  customerName?: string;
  quoteNumber?: string;
  status: string;
  invoiceNumber?: string;
  amount?: string;
  viewUrl?: string;
  pdfUrl?: string;
  note?: string;
  relatedType?: string;
  relatedId?: string;
}) {
  try {
    const { error } = await supabase.functions.invoke("notify-quote-status", {
      body: params,
    });
    if (error) console.error("sendQuoteStatusEmail error:", error);
  } catch (e) {
    console.error("sendQuoteStatusEmail exception:", e);
  }
}
