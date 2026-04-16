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

// ---------- HTML email builder ----------

function buildContactReplyHtml(name?: string): string {
  const el = React.createElement(
    "div",
    { style: { fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif", backgroundColor: "#ffffff", padding: "20px 0" } },
    React.createElement(
      "div",
      { style: { maxWidth: "580px", margin: "0 auto", padding: "20px 30px" } },
      React.createElement("h1", { style: { fontSize: "20px", fontWeight: "700", color: "#0fa888", textAlign: "center", margin: "0 0 20px" } }, "ENT Group"),
      React.createElement("h2", { style: { fontSize: "18px", fontWeight: "600", color: "#1a1a2e", margin: "20px 0 10px" } }, "ได้รับข้อความของคุณแล้ว"),
      React.createElement("p", { style: { fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: "0 0 16px" } }, name ? `สวัสดีครับ/ค่ะ คุณ${name},` : "สวัสดีครับ/ค่ะ,"),
      React.createElement("p", { style: { fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: "0 0 16px" } }, "เราได้รับข้อความของคุณเรียบร้อยแล้ว ทีมงาน ENT Group จะตรวจสอบและตอบกลับภายใน 1-2 วันทำการ"),
      React.createElement("p", { style: { fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: "0 0 16px" } }, "หากมีความเร่งด่วน สามารถติดต่อเราได้โดยตรงทาง LINE @entgroup"),
      React.createElement("hr", { style: { borderColor: "#e5e7eb", margin: "24px 0" } }),
      React.createElement("p", { style: { fontSize: "12px", color: "#9ca3af", textAlign: "center", margin: "0" } }, "ขอบคุณที่ไว้วางใจ ENT Group — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร")
    )
  );
  return renderToStaticMarkup(el);
}

function buildQuoteRequestReplyHtml(name?: string, quoteRef?: string): string {
  const el = React.createElement(
    "div",
    { style: { fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif", backgroundColor: "#ffffff", padding: "20px 0" } },
    React.createElement(
      "div",
      { style: { maxWidth: "580px", margin: "0 auto", padding: "20px 30px" } },
      React.createElement("h1", { style: { fontSize: "20px", fontWeight: "700", color: "#0fa888", textAlign: "center", margin: "0 0 20px" } }, "ENT Group"),
      React.createElement("h2", { style: { fontSize: "18px", fontWeight: "600", color: "#1a1a2e", margin: "20px 0 10px" } }, "ได้รับคำขอใบเสนอราคาแล้ว"),
      React.createElement("p", { style: { fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: "0 0 16px" } }, name ? `สวัสดีครับ/ค่ะ คุณ${name},` : "สวัสดีครับ/ค่ะ,"),
      React.createElement("p", { style: { fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: "0 0 16px" } },
        `เราได้รับคำขอใบเสนอราคาของคุณ${quoteRef ? ` (${quoteRef})` : ""} เรียบร้อยแล้ว ทีมขายจะจัดทำใบเสนอราคาและส่งให้ท่านภายใน 1-2 วันทำการ`
      ),
      React.createElement("hr", { style: { borderColor: "#e5e7eb", margin: "24px 0" } }),
      React.createElement("p", { style: { fontSize: "12px", color: "#9ca3af", textAlign: "center", margin: "0" } }, "ขอบคุณที่ไว้วางใจ ENT Group — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร")
    )
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

    const { type, recipientEmail, recipientName, quoteRef } = await req.json();

    if (!recipientEmail || !type) {
      return new Response(
        JSON.stringify({ error: "recipientEmail and type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subject: string;
    let html: string;

    switch (type) {
      case "contact":
        subject = "ขอบคุณที่ติดต่อ ENT Group";
        html = buildContactReplyHtml(recipientName);
        break;
      case "quote-request":
        subject = "ได้รับคำขอใบเสนอราคาเรียบร้อย — ENT Group";
        html = buildQuoteRequestReplyHtml(recipientName, quoteRef);
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unknown auto-reply type: ${type}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

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
    console.error("send-auto-reply error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
