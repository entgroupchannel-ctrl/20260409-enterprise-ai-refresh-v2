import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { contacts } = await req.json();

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return new Response(JSON.stringify({ error: "No contacts provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Add import metadata
    const now = new Date().toISOString();
    const enriched = contacts.map((c: any) => ({
      ...c,
      imported_from: "csv_2026_04_11",
      imported_at: now,
    }));

    // Batch insert 500 at a time
    const BATCH = 500;
    let success = 0;
    let errors: string[] = [];

    for (let i = 0; i < enriched.length; i += BATCH) {
      const batch = enriched.slice(i, i + BATCH);
      const { error } = await supabaseAdmin.from("contacts").insert(batch);
      if (error) {
        errors.push(`Batch ${Math.floor(i / BATCH) + 1}: ${error.message}`);
      } else {
        success += batch.length;
      }
    }

    return new Response(
      JSON.stringify({ success, total: enriched.length, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
