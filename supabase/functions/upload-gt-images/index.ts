import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImageUploadItem {
  filename: string;
  base64Data: string;
  contentType: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { images } = await req.json() as { images: ImageUploadItem[] };

    if (!Array.isArray(images) || images.length === 0) {
      return new Response(JSON.stringify({ error: "No images provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: Array<{ filename: string; url: string | null; error?: string }> = [];

    for (const img of images) {
      try {
        const binary = Uint8Array.from(atob(img.base64Data), (c) => c.charCodeAt(0));
        const path = `gt-series/${img.filename}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from("product-images")
          .upload(path, binary, {
            contentType: img.contentType,
            upsert: true,
          });

        if (uploadError) {
          results.push({ filename: img.filename, url: null, error: uploadError.message });
          continue;
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
          .from("product-images")
          .getPublicUrl(path);

        results.push({ filename: img.filename, url: publicUrl });
      } catch (e: any) {
        results.push({ filename: img.filename, url: null, error: e.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: results.filter((r) => r.url).length,
        total: images.length,
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
