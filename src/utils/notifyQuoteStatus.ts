import { supabase } from "@/integrations/supabase/client";

/**
 * Send email notification for quote status changes.
 * Best-effort — never throws, never blocks the UI.
 */
export type QuoteEmailEvent =
  | "new"
  | "quoted"
  | "negotiation_customer"
  | "negotiation_admin_reply"
  | "won"
  | "po_uploaded"
  | "po_approved"
  | "po_rejected"
  | "lost";

interface NotifyParams {
  event: QuoteEmailEvent;
  quoteId: string;
  customerEmail: string;
  customerName?: string;
  quoteNumber?: string;
  grandTotal?: number;
  products?: string;
  saleEmail?: string;
  saleName?: string;
  poNumber?: string;
  poFileName?: string;
  rejectReason?: string;
  counterValue?: string;
  negotiationSubject?: string;
}

/**
 * Fetch assigned sale info for a quote.
 * Returns { saleName, saleEmail } or defaults.
 */
export async function getSaleInfo(assignedTo: string | null): Promise<{ saleName: string; saleEmail: string }> {
  if (!assignedTo) return { saleName: "ทีมขาย ENT Group", saleEmail: "sales@entgroup.co.th" };
  try {
    const { data } = await supabase.rpc("get_sales_team");
    if (data) {
      const sale = (data as any[]).find((s) => s.user_id === assignedTo);
      if (sale) return { saleName: sale.full_name || sale.email, saleEmail: sale.email };
    }
  } catch {}
  return { saleName: "ทีมขาย ENT Group", saleEmail: "sales@entgroup.co.th" };
}

/**
 * Build product summary string from products array.
 */
export function productSummaryText(products: any[]): string {
  if (!Array.isArray(products) || products.length === 0) return "-";
  return products
    .filter((p) => p.model || p.category)
    .map((p) => `${p.category || ""} ${p.model || ""} ×${p.qty || 1}`)
    .join(", ");
}

/**
 * Send notification — fire and forget, never throws.
 */
export async function notifyQuoteStatus(params: NotifyParams): Promise<void> {
  try {
    await supabase.functions.invoke("notify-quote-status", {
      body: params,
    });
  } catch (err) {
    console.warn("[notifyQuoteStatus] Failed (non-blocking):", err);
  }
}
