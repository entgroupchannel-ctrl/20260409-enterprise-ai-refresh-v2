// Route: /r/:code  — บันทึกคลิก + ตั้ง cookie attribution → redirect ไปหน้าปลายทาง
import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { setAffiliateCookie } from "@/lib/affiliate-attribution";
import { Loader2 } from "lucide-react";

export default function AffiliateRedirect() {
  const { code } = useParams<{ code: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const target = params.get("to") || "/";
    const utm_source = params.get("utm_source") || undefined;
    const utm_medium = params.get("utm_medium") || undefined;
    const utm_campaign = params.get("utm_campaign") || undefined;

    if (!code) {
      navigate("/", { replace: true });
      return;
    }

    let visitor_id = localStorage.getItem("ent_visitor_id");
    if (!visitor_id) {
      visitor_id = crypto.randomUUID();
      localStorage.setItem("ent_visitor_id", visitor_id);
    }

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "track-affiliate-click",
          {
            body: {
              code,
              landing_path: target,
              referrer: document.referrer || undefined,
              utm_source,
              utm_medium,
              utm_campaign,
              visitor_id,
            },
          },
        );

        if (!error && data?.ok) {
          setAffiliateCookie({
            code: data.affiliate_code,
            click_id: data.click_id,
            affiliate_id: data.affiliate_id,
            ts: Date.now(),
          });
        }
      } catch (e) {
        console.warn("affiliate track failed", e);
      } finally {
        // Always redirect — never block the user
        const safeTarget = target.startsWith("/") ? target : "/";
        navigate(safeTarget, { replace: true });
      }
    })();
  }, [code, params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
        <p className="text-sm text-muted-foreground">กำลังนำคุณไปยังหน้าปลายทาง...</p>
      </div>
    </div>
  );
}
