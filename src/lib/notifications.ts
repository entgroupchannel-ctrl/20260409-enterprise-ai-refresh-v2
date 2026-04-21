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
  entityType?: string;
  entityId?: string;
  idempotencyKey?: string;
}

/**
 * Centralized notification dispatcher (Phase 1 Foundation).
 *
 * Single entry point for all notification events. Handles:
 * - Event registry validation (notification_events.is_active)
 * - Channel gate from registry (notify_admin_in_app / notify_customer_in_app)
 * - User preference checks (critical events bypass preference)
 * - In-app notification insert + audit log (notification_dispatch_log)
 *
 * Prefer this over `createNotification` / `notifyAdmins`. Fire-and-forget.
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
      p_entity_type: params.entityType ?? null,
      p_entity_id: params.entityId ?? null,
      p_idempotency_key: params.idempotencyKey ?? null,
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

// ──────────────── Legacy helpers (auto-route to dispatcher) ────────────────

/**
 * Map legacy `type` strings (used by old `notifyAdmins` / `createNotification`
 * call sites) to the canonical event_key in `notification_events`.
 *
 * Any type not listed here falls back to a direct insert (legacy behaviour),
 * so unknown types keep working but are NOT logged in dispatch_log.
 */
const LEGACY_TYPE_TO_EVENT_KEY: Record<string, string> = {
  // Quote
  new_quote_request: "quote.requested",
  quote_sent: "quote.sent",
  quote_new: "quote.sent",
  quote_revised: "quote.revised",
  negotiation_request: "quote.revised",
  quote_accepted: "quote.accepted",
  quote_rejected: "quote.rejected",
  quote_expired: "quote.expired",
  quote_status_change: "quote.sent",
  // PO
  po_uploaded: "po.uploaded",
  quote_po_uploaded: "po.uploaded",
  po_received: "po.uploaded",
  po_approved: "po.approved",
  po_rejected: "po.rejected",
  // Sale Order
  sale_order_created: "so.created",
  so_shipped: "so.shipped",
  so_delivered: "so.delivered",
  order_completed: "so.delivered",
  // Invoice / Tax invoice / Credit note / Receipt
  invoice_created: "invoice.created",
  invoice_new: "invoice.created",
  invoice_issued: "invoice.created",
  invoice_sent: "invoice.sent",
  invoice_paid: "invoice.paid",
  invoice_overdue: "invoice.overdue",
  invoice_cancelled: "invoice.voided",
  tax_invoice_created: "tax_invoice.issued",
  tax_invoice_new: "tax_invoice.issued",
  credit_note_created: "credit_note.issued",
  receipt_issued: "receipt.issued",
  receipt_new: "receipt.issued",
  receipt_created: "receipt.created",
  receipt_cancelled: "receipt.issued",
  tax_invoice_cancelled: "tax_invoice.cancelled",
  // Payment
  payment_confirmed: "payment.confirmed",
  payment_verified: "payment.confirmed",
  payment_refunded: "payment.refunded",
  payment_rejected: "payment.refunded",
  payment_slip_uploaded: "payment.slip_uploaded",
  payment_uploaded: "payment.slip_uploaded",
  // Contact / partner / member
  new_contact: "contact.submitted",
  new_member: "contact.submitted",
  partner_applied: "partner.applied",
  // Repair
  new_repair_request: "repair.requested",
  repair_received: "repair.received",
  repair_in_progress: "repair.in_progress",
  repair_completed: "repair.completed",
  repair_returned: "repair.returned",
  // Affiliate
  affiliate_approved: "affiliate.approved",
  affiliate_lead_qualified: "affiliate.lead_qualified",
  affiliate_payout_paid: "affiliate.payout_paid",
  // Cart
  cart_abandoned: "cart.abandoned",
  cart_liked_reminder: "cart.liked_reminder",
  // Chat
  new_message: "chat.message_received",
  chat_message: "chat.message_received",
};

/** Warn once per unknown type so we can spot new legacy types in production. */
const _warnedUnknownTypes = new Set<string>();
function warnUnknownLegacyType(type: string) {
  if (_warnedUnknownTypes.has(type)) return;
  _warnedUnknownTypes.add(type);
  console.warn(
    `[notifications] Legacy type "${type}" has no event_key mapping — falling back to direct insert (no audit log, no preference check). Please add it to LEGACY_TYPE_TO_EVENT_KEY.`
  );
}

/**
 * Insert a single in-app notification for a specific user.
 *
 * Auto-routes to `dispatchNotificationEvent` if `type` maps to a known
 * event_key, otherwise falls back to direct insert (legacy behaviour).
 *
 * @deprecated Prefer `dispatchNotificationEvent` with an explicit event_key.
 */
export async function createNotification(params: CreateNotificationParams) {
  const eventKey = LEGACY_TYPE_TO_EVENT_KEY[params.type];
  if (eventKey) {
    return dispatchNotificationEvent({
      eventKey,
      recipientUserId: params.userId,
      title: params.title,
      message: params.message,
      actionUrl: params.actionUrl,
      actionLabel: params.actionLabel,
      linkType: params.linkType,
      linkId: params.linkId,
      entityType: params.linkType,
      entityId: params.linkId,
    });
  }
  warnUnknownLegacyType(params.type);
  // Fallback: unknown legacy type — direct insert
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
 * Auto-routes to `dispatchNotificationEvent({ recipientRole: 'admin' })` if
 * `type` maps to a known event_key, otherwise falls back to legacy RPC.
 *
 * @deprecated Prefer `dispatchNotificationEvent({ recipientRole: 'admin', ... })`.
 */
export async function notifyAdmins(
  params: Omit<CreateNotificationParams, "userId">
) {
  const eventKey = LEGACY_TYPE_TO_EVENT_KEY[params.type];
  if (eventKey) {
    return dispatchNotificationEvent({
      eventKey,
      recipientRole: "admin",
      title: params.title,
      message: params.message,
      actionUrl: params.actionUrl,
      actionLabel: params.actionLabel,
      linkType: params.linkType,
      linkId: params.linkId,
      entityType: params.linkType,
      entityId: params.linkId,
    });
  }
  warnUnknownLegacyType(params.type);
  // Fallback: unknown legacy type — use legacy RPC
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
    // Use SECURITY DEFINER RPC to bypass RLS on public.users
    // (customer/guest clients cannot select admin rows directly — P-0.2 fix)
    const { data: admins, error: rpcError } = await (supabase as any).rpc("get_admin_emails");
    if (rpcError) {
      console.error("notifyAdminsByEmail: get_admin_emails RPC error:", rpcError);
      return;
    }

    const emails = (admins || [])
      .map((u: any) => u?.email)
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
