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

/**
 * Send a transactional email via Edge Function (fire-and-forget).
 */
export async function sendTransactionalEmail(params: {
  templateName: string;
  recipientEmail: string;
  idempotencyKey: string;
  templateData?: Record<string, any>;
}) {
  try {
    const { error } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: params.templateName,
        recipientEmail: params.recipientEmail,
        idempotencyKey: params.idempotencyKey,
        templateData: params.templateData,
      },
    });
    if (error) console.error("sendTransactionalEmail error:", error);
  } catch (e) {
    console.error("sendTransactionalEmail exception:", e);
  }
}
