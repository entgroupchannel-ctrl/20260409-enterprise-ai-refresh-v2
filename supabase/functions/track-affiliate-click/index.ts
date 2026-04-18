// Edge function: บันทึกคลิกลิงก์แนะนำของ Affiliate
// Public endpoint — ไม่ต้องมี JWT (เรียกจากหน้า /r/:code redirect)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Body {
  code: string;
  landing_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  visitor_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Body;
    if (!body?.code || typeof body.code !== "string") {
      return json({ error: "code is required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Lookup approved affiliate
    const { data: aff, error: lookupErr } = await supabase
      .from("affiliates")
      .select("id, affiliate_code, status")
      .ilike("affiliate_code", body.code)
      .eq("status", "approved")
      .maybeSingle();

    if (lookupErr) throw lookupErr;
    if (!aff) {
      return json({ error: "affiliate not found or not approved" }, 404);
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      null;
    const ua = req.headers.get("user-agent") || null;
    const country = req.headers.get("cf-ipcountry") || null;

    const { data: click, error: insErr } = await supabase
      .from("affiliate_clicks")
      .insert({
        affiliate_id: aff.id,
        affiliate_code: aff.affiliate_code,
        landing_path: body.landing_path?.slice(0, 500) ?? null,
        referrer: body.referrer?.slice(0, 500) ?? null,
        utm_source: body.utm_source?.slice(0, 100) ?? null,
        utm_medium: body.utm_medium?.slice(0, 100) ?? null,
        utm_campaign: body.utm_campaign?.slice(0, 100) ?? null,
        visitor_id: body.visitor_id?.slice(0, 100) ?? null,
        user_agent: ua,
        ip_address: ip,
        country_code: country,
      })
      .select("id")
      .single();

    if (insErr) throw insErr;

    return json({
      ok: true,
      click_id: click.id,
      affiliate_id: aff.id,
      affiliate_code: aff.affiliate_code,
    });
  } catch (e) {
    console.error("track-affiliate-click error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
