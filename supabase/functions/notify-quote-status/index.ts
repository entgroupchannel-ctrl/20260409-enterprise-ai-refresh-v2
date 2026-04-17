import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { renderToStaticMarkup } from "npm:react-dom@18.3.1/server";
import * as React from "npm:react@18.3.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM_ADDRESS = "ENT Group <noreply@entgroup.co.th>";
const PRIMARY_COLOR = "#0fa888";
const SITE_URL = "https://www.entgroup.co.th";

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
  invoice_created: { th: "ออกใบแจ้งหนี้แล้ว", emoji: "🧾" },
  payment_slip_uploaded: { th: "ลูกค้าส่งสลิปการชำระเงิน — รอตรวจสอบ", emoji: "💳" },
};

// ---------- HTML builder ----------

interface QuoteStatusData {
  customerName?: string;
  quoteNumber?: string;
  status: string;
  invoiceNumber?: string;
  amount?: string;
  viewUrl?: string;
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

  // CTA button
  children.push(
    React.createElement("div", { key: "cta", style: { textAlign: "center", margin: "30px 0" } },
      React.createElement("a", {
        href: viewUrl,
        style: {
          backgroundColor: PRIMARY_COLOR,
          color: "#ffffff",
          padding: "12px 28px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          textDecoration: "none",
          display: "inline-block",
        },
      }, "ดูรายละเอียด")
    )
  );

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
    const { recipientEmail, customerName, quoteNumber, status, invoiceNumber, amount, viewUrl, note } = body;

    if (!recipientEmail || !status) {
      return new Response(
        JSON.stringify({ error: "recipientEmail and status are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const label = STATUS_LABELS[status] || { th: status, emoji: "📌" };
    const subject = `${label.emoji} ใบเสนอราคา ${quoteNumber || ""} — ${label.th}`;
    const html = buildQuoteStatusHtml({ customerName, quoteNumber, status, invoiceNumber, amount, viewUrl, note });

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
      console.error("Resend API error:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: data }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
