// Edge Function: receives base64 PDF + path, uploads to `datasheets` bucket using service role.
// Used as a one-shot tool to upload generated FPM datasheets.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(url, key);

    const { path, contentBase64, contentType = "application/pdf" } = await req.json();
    if (!path || !contentBase64) {
      return new Response(JSON.stringify({ error: "missing path/contentBase64" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const bin = Uint8Array.from(atob(contentBase64), (c) => c.charCodeAt(0));
    const { error } = await supabase.storage.from("datasheets").upload(path, bin, {
      contentType,
      upsert: true,
    });
    if (error) throw error;

    const { data: pub } = supabase.storage.from("datasheets").getPublicUrl(path);
    return new Response(JSON.stringify({ success: true, path, publicUrl: pub.publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("upload-datasheet error:", e);
    return new Response(JSON.stringify({ success: false, error: e.message ?? String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
