// One-off admin upload: fetches an image URL and stores it in product-images bucket.
// Called from sandbox to seed touchwo product images. Auth via shared admin token.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.45.4/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SHARED_TOKEN = Deno.env.get("ADMIN_SEED_TOKEN") || "touchwo-seed-2026-x9k2m4n8p";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const auth = req.headers.get("x-seed-token");
    if (auth !== SHARED_TOKEN) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { source_url, bucket, path, content_type } = await req.json();
    if (!source_url || !bucket || !path) {
      return new Response(JSON.stringify({ error: "missing fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    let bytes: Uint8Array;
    let ct = content_type;
    if (source_url.startsWith("data:base64,")) {
      const b64 = source_url.slice("data:base64,".length);
      bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    } else {
      const r = await fetch(source_url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!r.ok) throw new Error(`fetch ${r.status}`);
      bytes = new Uint8Array(await r.arrayBuffer());
      ct = ct || r.headers.get("content-type") || "application/octet-stream";
    }
    const { error } = await sb.storage.from(bucket).upload(path, bytes, {
      contentType: ct, upsert: true,
    });
    if (error) throw error;
    const { data } = sb.storage.from(bucket).getPublicUrl(path);
    return new Response(JSON.stringify({ success: true, public_url: data.publicUrl, size: bytes.length }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
