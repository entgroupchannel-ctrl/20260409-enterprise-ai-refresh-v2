import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    let authorized = false;

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Method 1: Service role key
    if (authHeader === `Bearer ${serviceKey}`) {
      authorized = true;
      console.log("Authorized via service role key");
    }

    // Method 2: Authenticated admin user
    if (!authorized && authHeader) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      console.log("Trying user auth, URL:", supabaseUrl);
      
      const anonClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      
      const { data: { user }, error: userError } = await anonClient.auth.getUser();
      console.log("getUser result:", user?.id, "error:", userError?.message);
      
      if (user) {
        const { data: userData, error: roleError } = await anonClient
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        console.log("Role query:", userData, "error:", roleError?.message);
        
        if (userData && ["admin", "sales"].includes(userData.role)) {
          authorized = true;
          console.log("Authorized as", userData.role);
        }
      }
    }

    if (!authorized) {
      console.log("Authorization failed");
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

    console.log("Upserting", products.length, "products");
    const { data, error } = await serviceClient
      .from("products")
      .upsert(products, { onConflict: "sku" })
      .select("id");

    if (error) {
      console.error("Upsert error:", error);
      return new Response(JSON.stringify({ error: error.message, detail: JSON.stringify(error) }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Success:", data?.length, "products");
    return new Response(
      JSON.stringify({ success: true, count: data?.length ?? 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Catch error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
