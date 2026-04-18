import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Loader2, Plus, ExternalLink, Trash2, Copy, ShoppingCart, FileText,
  MousePointerClick, Users, CheckCircle2, Sparkles, Search, Package, Minus,
} from "lucide-react";
import { searchCatalogProducts, getCatalogCategories, type CatalogProduct } from "@/lib/product-catalog";

interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  campaign_type: "cart" | "quote_template";
  is_active: boolean;
  is_featured: boolean;
  promo_note: string | null;
  estimated_total: number | null;
  total_clicks: number;
  total_leads: number;
  total_converted: number;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

interface CampaignItem {
  product_model: string;
  product_name: string;
  quantity: number;
  unit_price: number | null;
}

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);

export default function AffiliateCampaignsManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [openWizard, setOpenWizard] = useState(false);

  // Wizard state
  const [step, setStep] = useState(1);
  const [type, setType] = useState<"cart" | "quote_template">("cart");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [promoNote, setPromoNote] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [items, setItems] = useState<CampaignItem[]>([
    { product_model: "", product_name: "", quantity: 1, unit_price: null },
  ]);
  const [templateQuoteId, setTemplateQuoteId] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data, error } = await (supabase.from as any)("affiliate_campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "โหลดไม่สำเร็จ", description: error.message, variant: "destructive" });
    setCampaigns((data as Campaign[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const resetWizard = () => {
    setStep(1); setType("cart"); setTitle(""); setSlug(""); setDescription("");
    setPromoNote(""); setStartsAt(""); setEndsAt(""); setIsFeatured(false);
    setItems([{ product_model: "", product_name: "", quantity: 1, unit_price: null }]);
    setTemplateQuoteId("");
  };

  const handleSave = async () => {
    if (!title || !slug) {
      toast({ title: "กรุณากรอกชื่อและ slug", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const estTotal = type === "cart"
        ? items.reduce((s, i) => s + (Number(i.unit_price || 0) * Number(i.quantity || 0)), 0)
        : null;

      const { data: created, error } = await (supabase.from as any)("affiliate_campaigns")
        .insert({
          slug, title, description: description || null,
          campaign_type: type,
          promo_note: promoNote || null,
          starts_at: startsAt || null,
          ends_at: endsAt || null,
          is_featured: isFeatured,
          is_active: true,
          estimated_total: estTotal,
          template_quote_id: type === "quote_template" && templateQuoteId ? templateQuoteId : null,
        })
        .select("id")
        .single();
      if (error) throw error;

      if (type === "cart") {
        const validItems = items.filter(i => i.product_model.trim());
        if (validItems.length > 0) {
          const { error: itemsErr } = await (supabase.from as any)("affiliate_campaign_items")
            .insert(validItems.map((it, idx) => ({
              campaign_id: created.id,
              product_model: it.product_model,
              product_name: it.product_name || null,
              quantity: it.quantity,
              unit_price: it.unit_price,
              display_order: idx,
            })));
          if (itemsErr) throw itemsErr;
        }
      }

      toast({ title: "สร้าง campaign สำเร็จ" });
      setOpenWizard(false);
      resetWizard();
      fetchCampaigns();
    } catch (err: any) {
      toast({ title: "บันทึกไม่สำเร็จ", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c: Campaign) => {
    const { error } = await (supabase.from as any)("affiliate_campaigns")
      .update({ is_active: !c.is_active })
      .eq("id", c.id);
    if (error) return toast({ title: "อัพเดตไม่สำเร็จ", variant: "destructive" });
    fetchCampaigns();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบ campaign นี้?")) return;
    const { error } = await (supabase.from as any)("affiliate_campaigns").delete().eq("id", id);
    if (error) return toast({ title: "ลบไม่สำเร็จ", variant: "destructive" });
    fetchCampaigns();
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "คัดลอก URL แล้ว", description: url });
  };

  return (
    <div className="space-y-6">
      {/* Header + How it works */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm space-y-2">
              <p className="font-semibold">Campaign คืออะไร?</p>
              <p className="text-muted-foreground">
                สร้าง <strong>"ตะกร้าสำเร็จรูป"</strong> หรือ <strong>"ใบเสนอราคา draft"</strong> ที่กำหนดสินค้า/ราคา/โปรโมชันไว้ล่วงหน้า
                จากนั้น Affiliate จะเอา URL ของ campaign ไปแชร์ — เมื่อมีลูกค้าคลิกผ่านลิงก์ของ Affiliate และขอใบเสนอราคา
                ระบบจะผูก campaign + affiliate ไว้กับใบเสนอราคาทันที เพื่อให้คุณตรวจสอบและจ่ายค่าคอมฯ ได้แม่นยำ
              </p>
              <p className="text-xs text-muted-foreground">
                URL: <code className="bg-muted px-1.5 py-0.5 rounded">/c/[slug]</code> →
                Affiliate share: <code className="bg-muted px-1.5 py-0.5 rounded">/c/[slug]?ref=[code]</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Campaigns ทั้งหมด ({campaigns.length})</h2>
          <p className="text-xs text-muted-foreground">จัดการตะกร้า/ใบเสนอราคาสำหรับ Affiliate</p>
        </div>
        <Button onClick={() => { resetWizard(); setOpenWizard(true); }}>
          <Plus className="w-4 h-4 mr-1" /> สร้าง Campaign
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : campaigns.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">
          ยังไม่มี campaign — กดปุ่ม "สร้าง Campaign" เพื่อเริ่ม
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {campaigns.map(c => (
            <Card key={c.id} className={!c.is_active ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant={c.campaign_type === "cart" ? "default" : "secondary"} className="gap-1">
                        {c.campaign_type === "cart" ? <ShoppingCart className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        {c.campaign_type === "cart" ? "Cart" : "Quote Template"}
                      </Badge>
                      {c.is_featured && <Badge variant="outline" className="border-amber-500 text-amber-600">Featured</Badge>}
                      {!c.is_active && <Badge variant="outline">ปิดใช้งาน</Badge>}
                    </div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">/c/{c.slug}</p>
                    {c.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{c.description}</p>}
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3" /> {c.total_clicks} clicks</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.total_leads} leads</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {c.total_converted} converted</span>
                      {c.estimated_total && <span>~฿{Number(c.estimated_total).toLocaleString("th-TH")}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">เปิด</span>
                      <Switch checked={c.is_active} onCheckedChange={() => toggleActive(c)} />
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => copyLink(c.slug)} title="คัดลอก URL">
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" asChild title="ดูหน้า public">
                        <Link to={`/c/${c.slug}`} target="_blank"><ExternalLink className="w-3.5 h-3.5" /></Link>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)} title="ลบ">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Wizard Dialog */}
      <Dialog open={openWizard} onOpenChange={setOpenWizard}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>สร้าง Campaign — ขั้น {step}/3</DialogTitle>
            <DialogDescription>
              {step === 1 && "เลือกประเภทของ campaign"}
              {step === 2 && "ใส่รายละเอียดและกำหนดเวลา"}
              {step === 3 && (type === "cart" ? "เพิ่มสินค้าในตะกร้า" : "ระบุ ID ใบเสนอราคา draft")}
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType("cart")}
                className={`text-left p-4 rounded-lg border-2 transition-colors ${type === "cart" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
              >
                <ShoppingCart className="w-6 h-6 text-primary mb-2" />
                <div className="font-semibold">Cart Campaign</div>
                <p className="text-xs text-muted-foreground mt-1">
                  เลือกสินค้า + จำนวน + ราคาโปรโมชัน — ลูกค้าเห็นเป็นตะกร้าสำเร็จรูปและกดขอใบเสนอราคา
                </p>
              </button>
              <button
                onClick={() => setType("quote_template")}
                className={`text-left p-4 rounded-lg border-2 transition-colors ${type === "quote_template" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
              >
                <FileText className="w-6 h-6 text-primary mb-2" />
                <div className="font-semibold">Quote Template</div>
                <p className="text-xs text-muted-foreground mt-1">
                  ผูกกับใบเสนอราคา draft ที่สร้างไว้แล้ว — ลูกค้าเห็นเทมเพลตและขอ copy ของตัวเอง
                </p>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div>
                <Label>ชื่อ Campaign *</Label>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug || slug === slugify(title)) setSlug(slugify(e.target.value));
                  }}
                  placeholder="เช่น Q2 Industrial PC Bundle"
                />
              </div>
              <div>
                <Label>Slug (URL) *</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="q2-industrial-bundle"
                />
                <p className="text-xs text-muted-foreground mt-1">URL: /c/{slug || "..."}</p>
              </div>
              <div>
                <Label>คำอธิบาย</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
              </div>
              <div>
                <Label>โน้ตโปรโมชัน</Label>
                <Input value={promoNote} onChange={(e) => setPromoNote(e.target.value)} placeholder="เช่น ลด 15% เมื่อสั่งครบ 5 เครื่อง" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>เริ่มแสดง</Label>
                  <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
                </div>
                <div>
                  <Label>หมดเขต</Label>
                  <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="text-sm font-medium">Featured</div>
                  <p className="text-xs text-muted-foreground">แสดงเด่นในรายการ</p>
                </div>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
            </div>
          )}

          {step === 3 && type === "cart" && (
            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg border">
                  <div className="col-span-3">
                    <Label className="text-xs">รุ่น *</Label>
                    <Input value={it.product_model} onChange={(e) => {
                      const next = [...items]; next[idx].product_model = e.target.value; setItems(next);
                    }} placeholder="GT-1500" />
                  </div>
                  <div className="col-span-4">
                    <Label className="text-xs">ชื่อสินค้า</Label>
                    <Input value={it.product_name} onChange={(e) => {
                      const next = [...items]; next[idx].product_name = e.target.value; setItems(next);
                    }} placeholder="Industrial Panel PC 15&quot;" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">จำนวน</Label>
                    <Input type="number" min={1} value={it.quantity} onChange={(e) => {
                      const next = [...items]; next[idx].quantity = Number(e.target.value); setItems(next);
                    }} />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">ราคา/หน่วย</Label>
                    <Input type="number" value={it.unit_price ?? ""} onChange={(e) => {
                      const next = [...items]; next[idx].unit_price = e.target.value ? Number(e.target.value) : null; setItems(next);
                    }} />
                  </div>
                  <div className="col-span-1">
                    <Button size="sm" variant="ghost" onClick={() => setItems(items.filter((_, i) => i !== idx))}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setItems([...items, { product_model: "", product_name: "", quantity: 1, unit_price: null }])}>
                <Plus className="w-3.5 h-3.5 mr-1" /> เพิ่มสินค้า
              </Button>
              <p className="text-xs text-muted-foreground">
                รวมประมาณ: ฿{items.reduce((s, i) => s + (Number(i.unit_price || 0) * Number(i.quantity || 0)), 0).toLocaleString("th-TH")}
              </p>
            </div>
          )}

          {step === 3 && type === "quote_template" && (
            <div className="space-y-3">
              <div>
                <Label>Quote Draft ID (UUID)</Label>
                <Input value={templateQuoteId} onChange={(e) => setTemplateQuoteId(e.target.value)} placeholder="วาง UUID ของ draft quote" />
                <p className="text-xs text-muted-foreground mt-1">
                  ไปที่ "ใบเสนอราคา" → สร้าง draft → คัดลอก ID มาวางที่นี่ (ฟีเจอร์เลือกผ่าน picker จะเพิ่มในเฟสถัดไป)
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>ย้อนกลับ</Button>}
            {step < 3 && <Button onClick={() => setStep(step + 1)} disabled={step === 2 && (!title || !slug)}>ถัดไป</Button>}
            {step === 3 && (
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                บันทึก Campaign
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
