// Public campaign landing — anyone can view & share. Logged-in users auto-enroll
// as affiliates, so their share links earn commissions.
import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import SiteNavbar from "@/components/SiteNavbar";
import FooterCompact from "@/components/FooterCompact";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { setAffiliateCookie } from "@/lib/affiliate-attribution";
import { getRelatedCatalogProducts, type CatalogProduct } from "@/lib/product-catalog";
import {
  Loader2, ShoppingCart, Share2, Copy, Check, MessageCircle,
  Facebook, Sparkles, Package, Tag, Award, Clock, AlertCircle,
  Store, ArrowRight, Flame, TrendingUp, Wallet, Users, Zap, Crown, Gift,
} from "lucide-react";

interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  campaign_type: string;
  is_active: boolean;
  promo_note: string | null;
  estimated_total: number | null;
  hero_image_url: string | null;
  ends_at: string | null;
}

interface CampaignItem {
  id: string;
  product_model: string;
  product_name: string | null;
  product_description: string | null;
  quantity: number;
  unit_price: number | null;
  display_order: number;
}

export default function CampaignLanding() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [items, setItems] = useState<CampaignItem[]>([]);
  const [related, setRelated] = useState<CatalogProduct[]>([]);
  const [myCode, setMyCode] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [copied, setCopied] = useState(false);

  // Track inbound click if ?ref=
  useEffect(() => {
    if (!refCode) return;
    let visitor_id = localStorage.getItem("ent_visitor_id");
    if (!visitor_id) {
      visitor_id = crypto.randomUUID();
      localStorage.setItem("ent_visitor_id", visitor_id);
    }
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("track-affiliate-click", {
          body: {
            code: refCode,
            landing_path: `/c/${slug}`,
            referrer: document.referrer || undefined,
            visitor_id,
          },
        });
        if (data?.ok) {
          setAffiliateCookie({
            code: data.affiliate_code,
            click_id: data.click_id,
            affiliate_id: data.affiliate_id,
            ts: Date.now(),
          });
        }
      } catch (e) {
        console.warn("track click failed", e);
      }
    })();
  }, [refCode, slug]);

  // Load campaign
  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data: c, error } = await (supabase.from as any)("affiliate_campaigns")
        .select("id, slug, title, description, campaign_type, is_active, promo_note, estimated_total, hero_image_url, ends_at")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !c) {
        setLoading(false);
        return;
      }
      setCampaign(c);

      const { data: rows } = await (supabase.from as any)("affiliate_campaign_items")
        .select("id, product_model, product_name, product_description, quantity, unit_price, display_order")
        .eq("campaign_id", c.id)
        .order("display_order", { ascending: true });
      setItems(rows || []);

      // Load related products from shop catalog (based on first campaign item)
      const firstModel = (rows || [])[0]?.product_model;
      if (firstModel) {
        setRelated(getRelatedCatalogProducts(firstModel, 8));
      } else {
        setRelated(getRelatedCatalogProducts("", 8));
      }

      // Increment view counter (best-effort; non-blocking)
      try {
        await (supabase.from as any)("affiliate_campaigns")
          .update({ total_clicks: (c as any).total_clicks ? undefined : undefined })
          .eq("id", c.id);
      } catch { /* ignore */ }

      setLoading(false);
    })();
  }, [slug]);

  // If logged-in, fetch (don't auto-create yet) their affiliate code
  useEffect(() => {
    if (!user) {
      setMyCode(null);
      return;
    }
    (async () => {
      const { data } = await (supabase.from as any)("affiliates")
        .select("affiliate_code, status")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data?.affiliate_code) setMyCode(data.affiliate_code);
    })();
  }, [user]);

  const ensureMyCode = async (): Promise<string | null> => {
    if (myCode) return myCode;
    if (!user) {
      // Send to login, return here after
      navigate(`/login?redirect=/c/${slug}`);
      return null;
    }
    setEnrolling(true);
    try {
      const { data, error } = await supabase.functions.invoke("affiliate-auto-enroll");
      if (error) throw error;
      const code = data?.affiliate?.affiliate_code as string | undefined;
      if (!code) throw new Error("ไม่สามารถสร้างรหัสได้");
      setMyCode(code);
      if (data?.created) {
        toast({
          title: "🎉 ยินดีด้วย คุณเป็น Affiliate แล้ว!",
          description: `รหัสของคุณคือ ${code} — ทุกการแชร์จากนี้จะคิดค่าคอมฯ ให้`,
        });
      }
      return code;
    } catch (e: any) {
      toast({ title: "สมัคร Affiliate ไม่สำเร็จ", description: e.message, variant: "destructive" });
      return null;
    } finally {
      setEnrolling(false);
    }
  };

  const buildShareUrl = (code: string) =>
    `${window.location.origin}/c/${slug}?ref=${encodeURIComponent(code)}`;

  const handleCopy = async () => {
    const code = await ensureMyCode();
    if (!code) return;
    const url = buildShareUrl(code);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "คัดลอกลิงก์แล้ว", description: url });
  };

  const handleShareLine = async () => {
    const code = await ensureMyCode();
    if (!code) return;
    const url = buildShareUrl(code);
    const text = `${campaign?.title} — ราคาพิเศษ ${campaign?.estimated_total ? `฿${Number(campaign.estimated_total).toLocaleString("th-TH")}` : ""}`;
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareFacebook = async () => {
    const code = await ensureMyCode();
    if (!code) return;
    const url = buildShareUrl(code);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  const handleNativeShare = async () => {
    const code = await ensureMyCode();
    if (!code) return;
    const url = buildShareUrl(code);
    if (navigator.share) {
      try {
        await navigator.share({ title: campaign?.title || "Campaign", url });
      } catch { /* user cancelled */ }
    } else {
      handleCopy();
    }
  };

  const handleRequestQuote = () => {
    if (!campaign) return;
    // Send to RFQ form with campaign slug → form pre-fills products from campaign items
    navigate(`/request-quote?campaign=${encodeURIComponent(campaign.slug)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNavbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!campaign || !campaign.is_active) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNavbar />
        <div className="container mx-auto px-4 py-16 max-w-xl text-center">
          <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <h1 className="text-xl font-bold mb-2">ไม่พบแคมเปญนี้</h1>
          <p className="text-sm text-muted-foreground mb-6">
            แคมเปญนี้อาจหมดอายุหรือถูกปิดใช้งาน
          </p>
          <Button asChild><Link to="/affiliate">ดูโปรแกรม Affiliate</Link></Button>
        </div>
        <FooterCompact />
      </div>
    );
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const expired = campaign.ends_at && new Date(campaign.ends_at) < new Date();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{campaign.title} — ENT Group</title>
        <meta name="description" content={campaign.description?.slice(0, 160) || campaign.title} />
        <meta property="og:title" content={campaign.title} />
        <meta property="og:description" content={campaign.description || ""} />
        {campaign.hero_image_url && <meta property="og:image" content={campaign.hero_image_url} />}
      </Helmet>

      <SiteNavbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Affiliate referral notice — shown to visitors arriving via ?ref=<code> */}
        {refCode && (
          <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
            <Award className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-foreground">
                คุณกำลังเข้าชมผ่านลิงก์ของพันธมิตร (Affiliate Program)
              </p>
              <p className="text-muted-foreground mt-1">
                ผู้แนะนำ: <span className="font-mono text-primary">{refCode}</span> — การเข้าชมและคำขอใบเสนอราคาของคุณจะถูกบันทึกเพื่อให้เครดิตกับผู้แนะนำท่านนี้ ราคาและคุณภาพสินค้าจาก ENT Group ยังคงเหมือนเดิมทุกประการ
              </p>
            </div>
          </div>
        )}

        {/* Hero */}
        <Card className="overflow-hidden mb-6 border-primary/30">
          {campaign.hero_image_url && (
            <div className="aspect-[3/1] bg-muted overflow-hidden">
              <img src={campaign.hero_image_url} alt={campaign.title} className="w-full h-full object-cover" />
            </div>
          )}
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge className="gap-1"><Sparkles className="w-3 h-3" /> Special Bundle</Badge>
              {campaign.promo_note && (
                <Badge variant="outline" className="border-amber-400 text-amber-600">
                  {campaign.promo_note}
                </Badge>
              )}
              {expired && <Badge variant="destructive">หมดเขตแล้ว</Badge>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{campaign.title}</h1>
            {campaign.description && (
              <p className="text-muted-foreground">{campaign.description}</p>
            )}
            <div className="flex items-baseline gap-3 mt-4 flex-wrap">
              {campaign.estimated_total && (
                <span className="text-3xl font-bold text-primary">
                  ฿{Number(campaign.estimated_total).toLocaleString("th-TH")}
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                <Package className="w-3.5 h-3.5 inline mr-1" />
                {totalItems} ชิ้น • {items.length} รายการ
              </span>
              {campaign.ends_at && !expired && (
                <span className="text-xs text-amber-600 dark:text-amber-400">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  ถึง {new Date(campaign.ends_at).toLocaleDateString("th-TH")}
                </span>
              )}
            </div>

            <div className="mt-5">
              <Button size="lg" onClick={handleRequestQuote} disabled={!!expired} className="gap-2 w-full sm:w-auto">
                <ShoppingCart className="w-4 h-4" /> ขอใบเสนอราคา
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Item list */}
        {items.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" /> รายการในแคมเปญ
              </h3>
              <div className="divide-y">
                {items.map((it) => (
                  <div key={it.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{it.product_name || it.product_model}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{it.product_model}</p>
                      {it.product_description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.product_description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm">x{it.quantity}</p>
                      {it.unit_price && (
                        <p className="text-xs text-muted-foreground">
                          ฿{Number(it.unit_price).toLocaleString("th-TH")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {campaign.estimated_total && (
                <div className="border-t mt-4 pt-4 flex justify-between items-center">
                  <span className="font-semibold">รวมโดยประมาณ</span>
                  <span className="text-xl font-bold text-primary">
                    ฿{Number(campaign.estimated_total).toLocaleString("th-TH")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6">
          <Tag className="w-3 h-3 inline mr-1" />
          ราคานี้เป็นข้อเสนอเบื้องต้น — ราคาจริงจะยืนยันในใบเสนอราคา
        </p>

        {/* You-may-also-like grid (Shop catalog) */}
        {related.length > 0 && (
          <section className="mt-10">
            <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    สินค้าแนะนำเพิ่มเติม
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold">เสริมโซลูชันของคุณให้ครบ</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  เลือกเพิ่มจากแคตตาล็อกของเรา ราคาดี พร้อมส่งทั่วประเทศ
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <Link to="/shop">
                  <Store className="w-3.5 h-3.5" /> ดูร้านค้าทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {related.map((p) => (
                <Link
                  key={p.model}
                  to={`/shop/${encodeURIComponent(p.model)}`}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all"
                >
                  <div className="aspect-square bg-muted overflow-hidden relative">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 bg-background/90 backdrop-blur"
                    >
                      {p.category}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground font-mono truncate">{p.model}</p>
                    <p className="text-sm font-medium line-clamp-2 mt-0.5 min-h-[2.5rem]">
                      {p.name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {p.price ? (
                        <span className="text-sm font-bold text-primary">{p.price}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">ขอใบเสนอราคา</span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Compact share bar — bottom of page */}
        <Card className="mt-8 border-primary/30 bg-gradient-to-r from-primary/5 to-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Award className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-semibold flex items-center gap-2 flex-wrap">
                  แชร์แคมเปญนี้ — รับค่าคอมมิชชัน
                  {myCode && <Badge variant="secondary" className="font-mono text-xs">{myCode}</Badge>}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user
                    ? "ทุกคลิกผ่านลิงก์ของคุณจะถูกบันทึก — ปิดการขายได้รับค่าคอมฯ ตาม tier"
                    : "เข้าสู่ระบบเพื่อรับลิงก์ส่วนตัว — ใครก็เป็น Affiliate ได้ทันที"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={handleCopy} disabled={enrolling} className="gap-2">
                  {enrolling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                    copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleShareLine} disabled={enrolling} className="gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> LINE
                </Button>
                <Button size="sm" variant="outline" onClick={handleShareFacebook} disabled={enrolling} className="gap-1.5">
                  <Facebook className="w-3.5 h-3.5" /> Facebook
                </Button>
                <Button size="sm" variant="outline" onClick={handleNativeShare} disabled={enrolling} className="gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            {!user && (
              <p className="text-xs text-muted-foreground mt-2">
                ยังไม่มีบัญชี? <Link to={`/register?redirect=/c/${slug}`} className="text-primary hover:underline">สมัครฟรี</Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <FooterCompact />
    </div>
  );
}
