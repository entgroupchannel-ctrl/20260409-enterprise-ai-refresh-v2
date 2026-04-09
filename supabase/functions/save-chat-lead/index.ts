import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id, name, email, phone, company, line_id, interest, conversation_summary, messages } = await req.json();

    if (!session_id) {
      return new Response(
        JSON.stringify({ error: "session_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate lead score
    let leadScore = 0;
    if (name) leadScore += 15;
    if (email) leadScore += 20;
    if (phone) leadScore += 15;
    if (company) leadScore += 20;
    if (line_id) leadScore += 10;
    if (interest) leadScore += 10;
    if (conversation_summary) leadScore += 10;

    const { data, error } = await supabase
      .from("chat_leads")
      .insert({
        session_id,
        name: name || null,
        email: email || null,
        phone: phone || null,
        company: company || null,
        line_id: line_id || null,
        interest: interest || null,
        conversation_summary: conversation_summary || null,
        messages: messages || [],
        lead_score: leadScore,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving lead:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save lead" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email notification
    try {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (LOVABLE_API_KEY && email) {
        const notifyRes = await fetch(`${supabaseUrl}/functions/v1/notify-quote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            type: "chat_lead",
            name: name || "ไม่ระบุ",
            email: email || "ไม่ระบุ",
            phone: phone || "ไม่ระบุ",
            company: company || "ไม่ระบุ",
            interest: interest || "ไม่ระบุ",
          }),
        });
        console.log("Notification sent:", notifyRes.status);
      }
    } catch (notifyErr) {
      console.error("Notification error (non-critical):", notifyErr);
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("save-chat-lead error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
