import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-import-key",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const importKey = req.headers.get("x-import-key");
    let authorized = false;

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const bulkImportKey = Deno.env.get("BULK_IMPORT_KEY");
    
    // Method 1: Service role key in bearer token
    if (authHeader === `Bearer ${serviceKey}`) {
      authorized = true;
    }

    // Method 2: Import key matches service key
    if (!authorized && importKey === serviceKey) {
      authorized = true;
    }

    // Method 3: Bulk import key (dedicated secret)
    if (!authorized && bulkImportKey && importKey === bulkImportKey) {
      authorized = true;
    }

    // Method 4: Authenticated admin user
    if (!authorized && authHeader) {
      const anonClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user } } = await anonClient.auth.getUser();
      if (user) {
        const { data: userData } = await anonClient
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        if (userData && ["admin", "sales"].includes(userData.role)) {
          authorized = true;
        }
      }
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      serviceKey
    );

    const { products } = await req.json();
    if (!Array.isArray(products) || products.length === 0) {
      return new Response(JSON.stringify({ error: "No products" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await serviceClient
      .from("products")
      .upsert(products, { onConflict: "sku" })
      .select("id");

    if (error) {
      return new Response(JSON.stringify({ error: error.message, detail: JSON.stringify(error) }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, count: data?.length ?? 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
