import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Megaphone, Copy, MessageCircle, Facebook, Mail, ShoppingCart,
  FileText, Sparkles, Loader2, Package, ExternalLink, LayoutGrid, List,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QRCodeSVG } from "qrcode.react";

interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  campaign_type: string;
  is_featured: boolean;
  hero_image_url: string | null;
  estimated_total: number | null;
  promo_note: string | null;
  starts_at: string | null;
  ends_at: string | null;
}

interface CampaignItem {
  id: string;
  product_model: string;
  product_name: string | null;
  quantity: number;
  unit_price: number | null;
}

export default function CampaignsTab({ affiliateCode }: { affiliateCode: string }) {
  const { toast } = useToast();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [items, setItems] = useState<Record<string, CampaignItem[]>>({});
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [view, setView] = useState<"grid" | "list">(() => {
    if (typeof window === "undefined") return "grid";
    return (localStorage.getItem("affiliate_campaigns_view") as "grid" | "list") || "grid";
  });
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("affiliate_campaigns_view", view);
  }, [view]);

  useEffect(() => {
    (async () => {
      try {
        const { data: cs, error } = await (supabase.from as any)("affiliate_campaigns")
          .select("id, slug, title, description, campaign_type, is_featured, hero_image_url, estimated_total, promo_note, starts_at, ends_at")
          .eq("is_active", true)
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false });
        if (error) throw error;
        setCampaigns(cs || []);

        if (cs && cs.length > 0) {
          const ids = cs.map((c: Campaign) => c.id);
          const { data: its } = await (supabase.from as any)("affiliate_campaign_items")
            .select("id, campaign_id, product_model, product_name, quantity, unit_price")
            .in("campaign_id", ids)
            .order("display_order");
          const grouped: Record<string, CampaignItem[]> = {};
          (its || []).forEach((it: any) => {
            (grouped[it.campaign_id] ||= []).push(it);
          });
          setItems(grouped);
        }
      } catch (err: any) {
        toast({ title: "โหลดแคมเปญไม่สำเร็จ", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const buildLink = (c: Campaign, source?: string) => {
    const params = new URLSearchParams();
    params.set("to", `/c/${c.slug}`);
    params.set("utm_campaign", c.slug);
    if (source) {
      params.set("utm_source", source);
      params.set("utm_medium", source === "line" || source === "facebook" ? "social" : "referral");
    }
    return `${baseUrl}/r/${affiliateCode}?${params.toString()}`;
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "คัดลอกลิงก์แล้ว", description: text.slice(0, 70) + "…" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <Megaphone className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">ยังไม่มีแคมเปญในตอนนี้</p>
          <p className="text-sm text-muted-foreground mt-1">
            แอดมินจะเปิดแคมเปญพิเศษให้คุณนำไปแชร์เร็วๆ นี้
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> แคมเปญพร้อมใช้งาน ({campaigns.length})
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            เลือกแคมเปญที่เหมาะกับลูกค้าของคุณ — กดแชร์ได้ทันทีทุกช่องทาง ทุกคลิกถูกผูกกับรหัสคุณอัตโนมัติ
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v as "grid" | "list")}
          className="border rounded-md"
        >
          <ToggleGroupItem value="grid" size="sm" aria-label="Grid view" className="gap-1.5 px-3">
            <LayoutGrid className="w-4 h-4" /> <span className="hidden sm:inline text-xs">Grid</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="list" size="sm" aria-label="List view" className="gap-1.5 px-3">
            <List className="w-4 h-4" /> <span className="hidden sm:inline text-xs">List</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map(c => {
            const list = items[c.id] || [];
            const link = buildLink(c);
            return (
              <Card key={c.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                {c.hero_image_url ? (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img src={c.hero_image_url} alt={c.title} className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    {c.campaign_type === "cart" ? (
                      <ShoppingCart className="w-12 h-12 text-primary/40" />
                    ) : (
                      <FileText className="w-12 h-12 text-primary/40" />
                    )}
                  </div>
                )}

                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start gap-2 mb-2 flex-wrap">
                    {c.is_featured && <Badge className="text-xs">⭐ Featured</Badge>}
                    <Badge variant="outline" className="text-xs gap-1">
                      {c.campaign_type === "cart" ? <ShoppingCart className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      {c.campaign_type === "cart" ? "ตะกร้าสำเร็จรูป" : "ใบเสนอราคา"}
                    </Badge>
                  </div>

                  <h4 className="font-semibold text-base leading-snug mb-1">{c.title}</h4>
                  {c.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
                  )}

                  {list.length > 0 && (
                    <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                      <Package className="w-3 h-3" /> {list.length} รายการสินค้า
                      {c.estimated_total ? ` • ฿${c.estimated_total.toLocaleString("th-TH")}` : ""}
                    </div>
                  )}

                  <div className="mt-auto flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5 flex-1" onClick={() => copy(link)}>
                      <Copy className="w-3.5 h-3.5" /> คัดลอกลิงก์
                    </Button>
                    <Button size="sm" className="gap-1.5" onClick={() => setSelected(c)}>
                      แชร์ <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="border rounded-lg divide-y bg-card">
          {campaigns.map(c => {
            const list = items[c.id] || [];
            const link = buildLink(c);
            return (
              <div key={c.id} className="flex items-center gap-3 p-3 hover:bg-muted/40 transition-colors">
                <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  {c.hero_image_url ? (
                    <img src={c.hero_image_url} alt={c.title} className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                  ) : c.campaign_type === "cart" ? (
                    <ShoppingCart className="w-7 h-7 text-primary/40" />
                  ) : (
                    <FileText className="w-7 h-7 text-primary/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {c.is_featured && <Badge className="text-[10px] px-1.5 py-0">⭐</Badge>}
                    <h4 className="font-semibold text-sm truncate">{c.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {list.length > 0 && <><Package className="w-3 h-3 inline mr-1" />{list.length} รายการ</>}
                    {c.estimated_total ? ` • ฿${c.estimated_total.toLocaleString("th-TH")}` : ""}
                    {c.description ? ` • ${c.description}` : ""}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => copy(link)}>
                    <Copy className="w-3.5 h-3.5" /> คัดลอก
                  </Button>
                  <Button size="sm" className="gap-1.5" onClick={() => setSelected(c)}>
                    แชร์ <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <ShareDialog
              campaign={selected}
              items={items[selected.id] || []}
              link={buildLink(selected)}
              shareLine={() => window.open(`https://line.me/R/msg/text/?${encodeURIComponent(`${selected.title} — ${buildLink(selected, "line")}`)}`, "_blank")}
              shareFB={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(buildLink(selected, "facebook"))}`, "_blank")}
              shareMail={() => window.open(`mailto:?subject=${encodeURIComponent(selected.title)}&body=${encodeURIComponent(`${selected.description || ""}\n\n${buildLink(selected, "email")}`)}`)}
              copy={copy}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ShareDialog({
  campaign, items, link, shareLine, shareFB, shareMail, copy,
}: {
  campaign: Campaign;
  items: CampaignItem[];
  link: string;
  shareLine: () => void;
  shareFB: () => void;
  shareMail: () => void;
  copy: (t: string) => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" /> แชร์แคมเปญ
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">{campaign.title}</h4>
          {campaign.description && (
            <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
          )}
        </div>

        {items.length > 0 && (
          <div className="rounded-lg border p-3 bg-muted/30">
            <p className="text-xs font-medium mb-2">สินค้าในแคมเปญ ({items.length})</p>
            <ul className="space-y-1 text-xs">
              {items.slice(0, 6).map(it => (
                <li key={it.id} className="flex justify-between gap-2">
                  <span className="truncate">
                    <span className="font-mono text-primary">{it.product_model}</span>
                    {it.product_name ? ` • ${it.product_name}` : ""}
                  </span>
                  <span className="text-muted-foreground whitespace-nowrap">x{it.quantity}</span>
                </li>
              ))}
              {items.length > 6 && <li className="text-muted-foreground">และอีก {items.length - 6} รายการ…</li>}
            </ul>
          </div>
        )}

        <div>
          <label className="text-xs font-medium">ลิงก์อ้างอิงของคุณ</label>
          <div className="flex gap-2 mt-1">
            <Input value={link} readOnly className="font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={() => copy(link)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center bg-white p-4 rounded-lg border">
          <QRCodeSVG value={link} size={160} level="M" includeMargin />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={shareLine} className="gap-1.5">
            <MessageCircle className="w-4 h-4 text-green-600" /> LINE
          </Button>
          <Button variant="outline" size="sm" onClick={shareFB} className="gap-1.5">
            <Facebook className="w-4 h-4 text-blue-600" /> Facebook
          </Button>
          <Button variant="outline" size="sm" onClick={shareMail} className="gap-1.5">
            <Mail className="w-4 h-4" /> Email
          </Button>
        </div>
      </div>

      <DialogFooter>
        <p className="text-xs text-muted-foreground">
          ทุกคลิกจะถูกผูกกับรหัส Affiliate ของคุณอัตโนมัติ
        </p>
      </DialogFooter>
    </>
  );
}
