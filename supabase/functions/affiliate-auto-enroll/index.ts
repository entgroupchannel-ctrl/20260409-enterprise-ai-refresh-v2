// Auto-enroll a logged-in user as an affiliate so they can share campaign links
// and earn commissions. Idempotent: returns existing affiliate if already enrolled.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function genCode(seed: string): string {
  // 6-char alphanumeric, prefix from seed (alpha only) + random suffix
  const alpha = (seed || "user").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3) || "REF";
  const rand = Math.random().toString(36).replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 5);
  return `${alpha}${rand}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the JWT and get the user
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json({ error: "invalid token" }, 401);
    const user = userData.user;

    const admin = createClient(supabaseUrl, serviceKey);

    // Already an affiliate?
    const { data: existing } = await admin
      .from("affiliates")
      .select("id, affiliate_code, status, full_name, email")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return json({ ok: true, affiliate: existing, created: false });
    }

    // Build a unique code (try a few times)
    const seed = (user.email || "user").split("@")[0];
    let code = "";
    for (let i = 0; i < 5; i++) {
      const candidate = genCode(seed);
      const { data: dup } = await admin
        .from("affiliates")
        .select("id")
        .ilike("affiliate_code", candidate)
        .maybeSingle();
      if (!dup) {
        code = candidate;
        break;
      }
    }
    if (!code) code = genCode(seed) + Math.floor(Math.random() * 99);

    const fullName =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      seed;

    const { data: created, error: insErr } = await admin
      .from("affiliates")
      .insert({
        user_id: user.id,
        email: user.email,
        full_name: fullName,
        affiliate_code: code,
        status: "approved", // auto-approve so they can earn immediately
        approved_at: new Date().toISOString(),
        tier: "bronze",
      })
      .select("id, affiliate_code, status, full_name, email")
      .single();

    if (insErr) throw insErr;

    return json({ ok: true, affiliate: created, created: true });
  } catch (e) {
    console.error("affiliate-auto-enroll error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
