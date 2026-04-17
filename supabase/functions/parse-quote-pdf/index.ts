// Parse Quote PDF using Lovable AI Gateway (Gemini)
// Returns structured quote data: customer info + line items + totals
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { file_base64, media_type } = await req.json();

    if (!file_base64) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `อ่านเอกสารใบเสนอราคา (Quotation) นี้ แล้วดึงข้อมูลออกมาเป็น JSON เท่านั้น (ห้ามใส่ markdown, code block, backtick) ตามโครงสร้างนี้:
{
  "quote_number": "",
  "quote_date": "",
  "valid_until": "",
  "customer_name": "",
  "customer_company": "",
  "customer_email": "",
  "customer_phone": "",
  "customer_address": "",
  "customer_tax_id": "",
  "customer_branch_type": "",
  "customer_branch_code": "",
  "customer_branch_name": "",
  "items": [
    {"name": "", "description": "", "quantity": 0, "unit_price": 0, "discount_percent": 0, "discount_amount": 0, "line_total": 0}
  ],
  "subtotal": 0,
  "discount_amount": 0,
  "discount_percent": 0,
  "vat_percent": 7,
  "vat_amount": 0,
  "withholding_percent": 0,
  "withholding_amount": 0,
  "grand_total": 0,
  "payment_terms": "",
  "delivery_terms": "",
  "warranty_terms": "",
  "notes": ""
}
กฎ:
- ตัวเลขให้เป็น number (ไม่มี comma, ไม่มี ฿, ไม่มี THB)
- วันที่ในรูปแบบ YYYY-MM-DD (ถ้าไม่มีให้เว้น "")
- field ที่ไม่พบให้เว้น "" สำหรับ string หรือ 0 สำหรับ number
- items ต้องเป็น array ของรายการสินค้าจริงในใบเสนอราคา (ไม่รวม subtotal/vat/grand_total)
- name = ชื่อรุ่น/โมเดลสินค้า, description = รายละเอียด/สเปก
- branch_type ถ้าเป็น "สำนักงานใหญ่" ให้ใส่ "head_office", ถ้าเป็นสาขาอื่นใส่ "branch"`;

    const messages = [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${media_type || "application/pdf"};base64,${file_base64}`,
            },
          },
          { type: "text", text: prompt },
        ],
      },
    ];

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages,
          max_tokens: 8192,
          temperature: 0,
        }),
      }
    );

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "ใช้งาน AI ถี่เกินไป กรุณารอสักครู่แล้วลองใหม่" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "เครดิต Lovable AI หมด กรุณาเติมเครดิตใน Workspace" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: `AI error: ${response.status}`, detail: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    // Robust JSON extraction
    let jsonStr = content;
    jsonStr = jsonStr.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const firstBrace = jsonStr.indexOf("{");
    const lastBrace = jsonStr.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }
    jsonStr = jsonStr
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/[\x00-\x1F\x7F]/g, (ch: string) => (ch === "\n" || ch === "\t" ? ch : ""));

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("JSON parse failed. Raw content:", content);
      return new Response(
        JSON.stringify({ error: "ไม่สามารถแปลงผลลัพธ์ AI เป็น JSON ได้", raw: content.substring(0, 500) }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("parse-quote-pdf error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
