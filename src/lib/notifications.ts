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

/**
 * Insert a single in-app notification for a specific user.
 * Fires-and-forgets (logs errors but does not throw).
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
 * Looks up user_roles for admin/super_admin, then inserts one notification per admin.
 */
export async function notifyAdmins(
  params: Omit<CreateNotificationParams, "userId">
) {
  try {
    const { data: roles, error: rolesError } = await (supabase as any)
      .from("user_roles")
      .select("user_id")
      .in("role", ["admin", "super_admin"]);

    if (rolesError || !roles?.length) {
      console.error("notifyAdmins: could not fetch admin roles", rolesError);
      return;
    }

    const notifications = roles.map((r: any) => ({
      user_id: r.user_id,
      type: params.type,
      title: params.title,
      message: params.message,
      priority: params.priority ?? "normal",
      action_url: params.actionUrl ?? null,
      action_label: params.actionLabel ?? null,
      link_type: params.linkType ?? null,
      link_id: params.linkId ?? null,
    }));

    const { error } = await (supabase as any)
      .from("notifications")
      .insert(notifications);
    if (error) console.error("notifyAdmins insert error:", error);
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
  note?: string;
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
