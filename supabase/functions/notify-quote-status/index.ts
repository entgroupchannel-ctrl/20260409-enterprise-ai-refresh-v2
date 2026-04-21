import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { renderToStaticMarkup } from "npm:react-dom@18.3.1/server";
import * as React from "npm:react@18.3.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Service-role client to write to email_send_log (bypasses RLS)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const adminDb = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  : null;

async function logEmail(row: {
  template_name: string;
  recipient_email: string;
  subject?: string;
  status: "pending" | "sent" | "failed";
  provider_message_id?: string | null;
  error_message?: string | null;
  related_type?: string | null;
  related_id?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  if (!adminDb) return;
  try {
    await adminDb.from("email_send_log").insert({
      template_name: row.template_name,
      recipient_email: row.recipient_email,
      subject: row.subject ?? null,
      status: row.status,
      provider_message_id: row.provider_message_id ?? null,
      error_message: row.error_message ?? null,
      related_type: row.related_type ?? null,
      related_id: row.related_id ?? null,
      metadata: row.metadata ?? null,
    });
  } catch (e) {
    console.error("logEmail failed:", e);
  }
}

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM_ADDRESS = "ENT Group <noreply@entgroup.co.th>";
const PRIMARY_COLOR = "#0fa888";
const SITE_URL = "https://www.entgroup.co.th";
const SALES_TEAM_CC = "sales@entgroup.co.th";

// Rewrite preview/dev URLs to canonical production domain so emailed links
// always point to www.entgroup.co.th (regardless of where the trigger ran).
function canonicalizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const isPreview =
      u.hostname.endsWith(".lovableproject.com") ||
      u.hostname.endsWith(".lovable.app") ||
      u.hostname.endsWith(".lovable.dev") ||
      u.hostname === "localhost" ||
      u.hostname === "127.0.0.1";
    if (isPreview) {
      return `${SITE_URL}${u.pathname}${u.search}${u.hash}`;
    }
    return url;
  } catch {
    return url;
  }
}

// ---------- Status label mapping ----------

const STATUS_LABELS: Record<string, { th: string; emoji: string }> = {
  quoted: { th: "จัดทำใบเสนอราคาแล้ว", emoji: "📋" },
  sent: { th: "ส่งใบเสนอราคาแล้ว", emoji: "📤" },
  approved: { th: "อนุมัติแล้ว", emoji: "✅" },
  won: { th: "ได้รับการตอบรับ", emoji: "🎉" },
  rejected: { th: "ไม่ได้รับการอนุมัติ", emoji: "❌" },
  po_uploaded: { th: "ได้รับ PO แล้ว", emoji: "📎" },
  invoiced: { th: "ออกใบแจ้งหนี้แล้ว", emoji: "🧾" },
  payment_confirmed: { th: "ยืนยันการชำระเงินแล้ว", emoji: "💰" },
  invoice_created: { th: "ออกใบวางบิลแล้ว", emoji: "🧾" },
  payment_slip_uploaded: { th: "ลูกค้าส่งสลิปการชำระเงิน — รอตรวจสอบ", emoji: "💳" },
  po_approved: { th: "อนุมัติใบสั่งซื้อ (PO) แล้ว", emoji: "✅" },
  po_rejected: { th: "ไม่อนุมัติใบสั่งซื้อ (PO)", emoji: "⚠️" },
  tax_invoice_created: { th: "ออกใบกำกับภาษีแล้ว", emoji: "🧾" },
  receipt_created: { th: "ออกใบเสร็จรับเงินแล้ว", emoji: "🧾" },
  credit_note_created: { th: "ออกใบลดหนี้แล้ว", emoji: "📝" },
  sale_order_created: { th: "สร้างใบสั่งขาย (Sales Order) แล้ว", emoji: "📦" },
};

// ---------- HTML builder ----------

interface QuoteStatusData {
  customerName?: string;
  quoteNumber?: string;
  status: string;
  invoiceNumber?: string;
  amount?: string;
  viewUrl?: string;
  pdfUrl?: string;
  note?: string;
}

function buildQuoteStatusHtml(data: QuoteStatusData): string {
  const label = STATUS_LABELS[data.status] || { th: data.status, emoji: "📌" };
  const viewUrl = data.viewUrl || `${SITE_URL}/my-account/quotes`;

  const children: React.ReactNode[] = [
    React.createElement("h1", { key: "h1", style: { fontSize: "20px", fontWeight: "700", color: PRIMARY_COLOR, textAlign: "center", margin: "0 0 20px" } }, "ENT Group"),
    React.createElement("h2", { key: "h2", style: { fontSize: "18px", fontWeight: "600", color: "#1a1a2e", margin: "20px 0 10px" } }, `${label.emoji} ${label.th}`),
    React.createElement("p", { key: "greeting", style: { fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: "0 0 16px" } },
      data.customerName ? `สวัสดีครับ/ค่ะ คุณ${data.customerName},` : "สวัสดีครับ/ค่ะ,"
    ),
  ];

  // Main status message
  let msg = `ใบเสนอราคา${data.quoteNumber ? ` ${data.quoteNumber}` : ""} มีสถานะอัปเดตเป็น "${label.th}"`;
  if (data.invoiceNumber) msg += ` (ใบแจ้งหนี้: ${data.invoiceNumber})`;
  if (data.amount) msg += ` ยอดรวม ${data.amount} บาท`;
  children.push(React.createElement("p", { key: "msg", style: { fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: "0 0 16px" } }, msg));

  if (data.note) {
    children.push(React.createElement("p", { key: "note", style: { fontSize: "14px", color: "#6b7280", lineHeight: "1.6", margin: "0 0 16px", fontStyle: "italic" } }, `หมายเหตุ: ${data.note}`));
  }

  // CTA buttons — show "Download PDF" first if available, then "View Online"
  const ctaButtons: React.ReactNode[] = [];

  if (data.pdfUrl) {
    ctaButtons.push(
      React.createElement("a", {
        key: "pdf-btn",
        href: data.pdfUrl,
        style: {
          backgroundColor: PRIMARY_COLOR,
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          textDecoration: "none",
          display: "inline-block",
          margin: "0 6px 8px",
        },
      }, "📥 ดาวน์โหลด PDF")
    );
  }

  ctaButtons.push(
    React.createElement("a", {
      key: "view-btn",
      href: viewUrl,
      style: {
        backgroundColor: data.pdfUrl ? "#ffffff" : PRIMARY_COLOR,
        color: data.pdfUrl ? PRIMARY_COLOR : "#ffffff",
        border: data.pdfUrl ? `1.5px solid ${PRIMARY_COLOR}` : "none",
        padding: "12px 24px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        textDecoration: "none",
        display: "inline-block",
        margin: "0 6px 8px",
      },
    }, "🔗 ดูออนไลน์")
  );

  children.push(
    React.createElement("div", { key: "cta", style: { textAlign: "center", margin: "30px 0" } }, ...ctaButtons)
  );

  if (data.pdfUrl) {
    children.push(
      React.createElement("p", { key: "pdf-hint", style: { fontSize: "12px", color: "#9ca3af", textAlign: "center", margin: "0 0 16px" } },
        "คลิกปุ่มดาวน์โหลด PDF เพื่อรับเอกสารทันที โดยไม่ต้องเข้าสู่ระบบ")
    );
  }

  children.push(React.createElement("hr", { key: "hr", style: { borderColor: "#e5e7eb", margin: "24px 0" } }));
  children.push(React.createElement("p", { key: "footer", style: { fontSize: "12px", color: "#9ca3af", textAlign: "center", margin: "0" } }, "ขอบคุณที่ไว้วางใจ ENT Group — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร"));

  const el = React.createElement(
    "div",
    { style: { fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif", backgroundColor: "#ffffff", padding: "20px 0" } },
    React.createElement("div", { style: { maxWidth: "580px", margin: "0 auto", padding: "20px 30px" } }, ...children)
  );
  return renderToStaticMarkup(el);
}

// ---------- Main handler ----------

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const body = await req.json();
    const { recipientEmail, customerName, quoteNumber, status, invoiceNumber, amount, viewUrl, pdfUrl, note, relatedType, relatedId } = body;

    if (!recipientEmail || !status) {
      return new Response(
        JSON.stringify({ error: "recipientEmail and status are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const label = STATUS_LABELS[status] || { th: status, emoji: "📌" };
    const docRef = invoiceNumber || quoteNumber || "";
    const subject = `${label.emoji} ${label.th}${docRef ? ` — ${docRef}` : ""}`;
    const html = buildQuoteStatusHtml({ customerName, quoteNumber, status, invoiceNumber, amount, viewUrl, pdfUrl, note });

    const templateName = `quote-status-${status}`;
    const relType = relatedType || (invoiceNumber ? "invoice" : "quote");
    const relId = relatedId || null;

    // Visible log: which links/PDF are being sent
    const linkSummary = {
      recipient: recipientEmail,
      template: templateName,
      doc: docRef || null,
      viewUrl: viewUrl || null,
      pdfUrl: pdfUrl || null,
      hasPdfAttachment: !!pdfUrl,
    };
    console.log(`[notify-quote-status] ${pdfUrl ? "📥 PDF link" : "🔗 view-only"} → ${recipientEmail} | ${JSON.stringify(linkSummary)}`);

    const sharedMetadata = {
      customerName,
      quoteNumber,
      invoiceNumber,
      amount,
      status,
      viewUrl: viewUrl || null,
      pdfUrl: pdfUrl || null,
      hasPdfLink: !!pdfUrl,
      linkType: pdfUrl ? "pdf_download" : "view_only",
    };

    await logEmail({
      template_name: templateName,
      recipient_email: recipientEmail,
      subject,
      status: "pending",
      related_type: relType,
      related_id: relId,
      metadata: sharedMetadata,
    });

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [recipientEmail],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`[notify-quote-status] ❌ FAILED → ${recipientEmail} | pdfUrl=${pdfUrl || "none"} | error=${JSON.stringify(data)}`);
      await logEmail({
        template_name: templateName,
        recipient_email: recipientEmail,
        subject,
        status: "failed",
        error_message: typeof data === "object" ? JSON.stringify(data) : String(data),
        related_type: relType,
        related_id: relId,
        metadata: sharedMetadata,
      });
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: data }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[notify-quote-status] ✅ SENT → ${recipientEmail} | messageId=${data?.id} | pdfUrl=${pdfUrl ? "✓ included" : "✗ none"} | viewUrl=${viewUrl ? "✓" : "✗"}`);

    await logEmail({
      template_name: templateName,
      recipient_email: recipientEmail,
      subject,
      status: "sent",
      provider_message_id: data?.id ?? null,
      related_type: relType,
      related_id: relId,
      metadata: sharedMetadata,
    });

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("notify-quote-status error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
