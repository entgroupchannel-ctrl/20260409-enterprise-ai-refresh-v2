import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DatasheetUpload {
  filename: string;
  base64Data: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { datasheets } = await req.json() as { datasheets: DatasheetUpload[] };

    if (!Array.isArray(datasheets) || datasheets.length === 0) {
      return new Response(JSON.stringify({ error: "No datasheets provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: Array<{ filename: string; url: string | null; error?: string }> = [];

    for (const ds of datasheets) {
      try {
        const binary = Uint8Array.from(atob(ds.base64Data), (c) => c.charCodeAt(0));

        const { error: uploadError } = await supabaseAdmin.storage
          .from("datasheets")
          .upload(ds.filename, binary, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (uploadError) {
          results.push({ filename: ds.filename, url: null, error: uploadError.message });
          continue;
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
          .from("datasheets")
          .getPublicUrl(ds.filename);

        results.push({ filename: ds.filename, url: publicUrl });
      } catch (e: any) {
        results.push({ filename: ds.filename, url: null, error: e.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: results.filter((r) => r.url).length,
        total: datasheets.length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
