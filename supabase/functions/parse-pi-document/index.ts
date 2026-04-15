import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file_base64, media_type } = await req.json();

    if (!file_base64) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Extract this Proforma Invoice document. Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "pi_number": "",
  "supplier_name": "",
  "items": [{ "model": "", "description": "", "color": "", "qty": 0, "unit_price": 0, "amount": 0, "hs_code": "" }],
  "shipping_cost": 0,
  "handling_fee": 0,
  "grand_total": 0,
  "currency": "USD",
  "price_terms": "",
  "payment_terms": "",
  "delivery_days": "",
  "loading_port": "",
  "bank_name": "",
  "swift_code": "",
  "account_number": "",
  "account_name": ""
}
If a field is not found, use empty string for text or 0 for numbers.`;

    const isImage = media_type?.startsWith("image/");
    const contentParts = isImage
      ? [
          { type: "image_url", image_url: { url: `data:${media_type};base64,${file_base64}` } },
          { type: "text", text: prompt },
        ]
      : [
          { type: "text", text: `[Document content as base64 PDF — please analyze the following base64-encoded PDF]\n\nBase64 data (first 100 chars): ${file_base64.substring(0, 100)}...\n\n${prompt}` },
        ];

    // For PDFs, we send the full base64 in a different way
    const messages = isImage
      ? [{ role: "user", content: contentParts }]
      : [{
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${media_type || "application/pdf"};base64,${file_base64}` },
            },
            { type: "text", text: prompt },
          ],
        }];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages,
        max_tokens: 3000,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Gateway error:", errText);
      return new Response(JSON.stringify({ error: `AI error: ${response.status}` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();
    
    // Try to find JSON object directly
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) jsonStr = objMatch[0];

    const parsed = JSON.parse(jsonStr);

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("parse-pi-document error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
