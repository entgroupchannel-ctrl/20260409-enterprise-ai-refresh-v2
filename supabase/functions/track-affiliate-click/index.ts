// Edge function: บันทึกคลิกลิงก์ Affiliate + คำนวณรายได้ (฿0.10/click)
// Public endpoint — ไม่ต้องมี JWT (เรียกจากหน้า /r/:code redirect)
//
// กฎการนับ billable:
//   1) ต้องมี visitor_id และไม่เคยนับใน 30 วันที่ผ่านมา (สำหรับ affiliate คนเดียวกัน)
//   2) ไม่ใช่ bot (UA filter)
//   3) ไม่ใช่ self-click (visitor อยู่ใน blacklist affiliate_known_visitors หรือ user_id ตรงกัน)
//   4) referrer ไม่ใช่โดเมนของเราเอง

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

const BOT_REGEX =
  /(bot|crawl|spider|preview|headless|curl|wget|python-|axios|node-fetch|monitor|uptime|facebookexternalhit|slackbot|discord|whatsapp|telegrambot|linebot|googlebot|bingbot|yandex|duckduck|ahrefs|semrush|baidu)/i;

const SELF_DOMAINS = [
  "entgroup.co.th",
  "ent-vision-v2.lovable.app",
  "lovable.app",
];

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

    const { data: aff, error: lookupErr } = await supabase
      .from("affiliates")
      .select("id, affiliate_code, status, user_id, click_rate")
      .ilike("affiliate_code", body.code)
      .eq("status", "approved")
      .maybeSingle();

    if (lookupErr) throw lookupErr;
    if (!aff) return json({ ok: false, error: "affiliate not found or not approved" }, 200);

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      null;
    const ua = req.headers.get("user-agent") || null;
    const country = req.headers.get("cf-ipcountry") || null;
    const visitor_id = body.visitor_id?.slice(0, 100) ?? null;
    const referrer = body.referrer?.slice(0, 500) ?? null;

    // === Billability checks ===
    let is_bot = false;
    let is_self_click = false;
    let duplicate_30d = false;
    let internal_referrer = false;
    const reasons: string[] = [];

    if (!ua || BOT_REGEX.test(ua)) {
      is_bot = true;
      reasons.push("bot");
    }

    if (referrer) {
      try {
        const refHost = new URL(referrer).hostname.toLowerCase();
        if (SELF_DOMAINS.some((d) => refHost.endsWith(d))) {
          internal_referrer = true;
          reasons.push("internal_referrer");
        }
      } catch { /* ignore */ }
    }

    // Self-click: visitor in blacklist
    if (visitor_id && !is_self_click) {
      const { data: known } = await supabase
        .from("affiliate_known_visitors")
        .select("user_id")
        .eq("visitor_id", visitor_id)
        .maybeSingle();
      if (known) {
        is_self_click = true;
        reasons.push("self_click");
      }
    }

    // Duplicate within 30 days for same affiliate+visitor
    if (visitor_id && !is_bot && !is_self_click) {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("affiliate_clicks")
        .select("id", { count: "exact", head: true })
        .eq("affiliate_id", aff.id)
        .eq("visitor_id", visitor_id)
        .eq("is_billable", true)
        .gte("created_at", since);
      if ((count ?? 0) > 0) {
        duplicate_30d = true;
        reasons.push("duplicate_30d");
      }
    } else if (!visitor_id && !is_bot && !is_self_click) {
      reasons.push("no_visitor_id");
    }

    const is_billable =
      !is_bot && !is_self_click && !duplicate_30d && !internal_referrer && !!visitor_id;
    const earnings = is_billable ? Number(aff.click_rate ?? 0.1) : 0;

    const { data: click, error: insErr } = await supabase
      .from("affiliate_clicks")
      .insert({
        affiliate_id: aff.id,
        affiliate_code: aff.affiliate_code,
        landing_path: body.landing_path?.slice(0, 500) ?? null,
        referrer,
        utm_source: body.utm_source?.slice(0, 100) ?? null,
        utm_medium: body.utm_medium?.slice(0, 100) ?? null,
        utm_campaign: body.utm_campaign?.slice(0, 100) ?? null,
        visitor_id,
        user_agent: ua,
        ip_address: ip,
        country_code: country,
        is_bot,
        is_self_click,
        is_billable,
        rejected_reason: reasons.length > 0 ? reasons.join(",") : null,
        earnings_amount: earnings,
      })
      .select("id")
      .single();

    if (insErr) throw insErr;

    // Increment counters atomically (best-effort; ignore failure)
    if (is_billable) {
      await supabase
        .from("affiliates")
        .update({
          total_clicks: (await getCount(supabase, aff.id, false)),
          total_billable_clicks: (await getCount(supabase, aff.id, true)),
          pending_earnings: (await getPending(supabase, aff.id)),
          updated_at: new Date().toISOString(),
        })
        .eq("id", aff.id);
    } else {
      await supabase
        .from("affiliates")
        .update({
          total_clicks: (await getCount(supabase, aff.id, false)),
          updated_at: new Date().toISOString(),
        })
        .eq("id", aff.id);
    }

    return json({
      ok: true,
      click_id: click.id,
      affiliate_id: aff.id,
      affiliate_code: aff.affiliate_code,
      billable: is_billable,
      earnings,
    });
  } catch (e) {
    console.error("track-affiliate-click error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

async function getCount(sb: any, affId: string, billableOnly: boolean): Promise<number> {
  let q = sb.from("affiliate_clicks").select("id", { count: "exact", head: true }).eq("affiliate_id", affId);
  if (billableOnly) q = q.eq("is_billable", true);
  const { count } = await q;
  return count ?? 0;
}

async function getPending(sb: any, affId: string): Promise<number> {
  // pending = sum(earnings) - paid_earnings (computed lazily)
  const { data } = await sb
    .from("affiliate_clicks")
    .select("earnings_amount")
    .eq("affiliate_id", affId)
    .eq("is_billable", true);
  const total = (data || []).reduce((s: number, r: any) => s + Number(r.earnings_amount || 0), 0);
  const { data: aff } = await sb.from("affiliates").select("paid_earnings").eq("id", affId).single();
  return Math.max(0, total - Number(aff?.paid_earnings || 0));
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
