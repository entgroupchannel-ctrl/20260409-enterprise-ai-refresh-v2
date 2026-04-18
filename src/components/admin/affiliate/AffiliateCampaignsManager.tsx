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
  MousePointerClick, Users, CheckCircle2, Sparkles, Search, Package, Minus, Pencil,
  LayoutGrid, List as ListIcon,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  const [view, setView] = useState<"grid" | "list">(() => {
    if (typeof window === "undefined") return "grid";
    return ((localStorage.getItem("admin_campaigns_view") as "grid" | "list") || "grid");
  });
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("admin_campaigns_view", view);
  }, [view]);

  // Wizard state
  const [editingId, setEditingId] = useState<string | null>(null);
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
    setEditingId(null);
    setStep(1); setType("cart"); setTitle(""); setSlug(""); setDescription("");
    setPromoNote(""); setStartsAt(""); setEndsAt(""); setIsFeatured(false);
    setItems([{ product_model: "", product_name: "", quantity: 1, unit_price: null }]);
    setTemplateQuoteId("");
  };

  const toLocalInput = (iso: string | null) => iso ? new Date(iso).toISOString().slice(0, 16) : "";

  const handleEdit = async (c: Campaign) => {
    resetWizard();
    setEditingId(c.id);
    setStep(2); // skip type-selection (type is locked when editing)
    setType(c.campaign_type);
    setTitle(c.title);
    setSlug(c.slug);
    setDescription(c.description || "");
    setPromoNote(c.promo_note || "");
    setStartsAt(toLocalInput(c.starts_at));
    setEndsAt(toLocalInput(c.ends_at));
    setIsFeatured(c.is_featured);

    if (c.campaign_type === "cart") {
      const { data: rows, error } = await (supabase.from as any)("affiliate_campaign_items")
        .select("product_model, product_name, quantity, unit_price, display_order")
        .eq("campaign_id", c.id)
        .order("display_order", { ascending: true });
      if (error) toast({ title: "โหลดสินค้าไม่สำเร็จ", description: error.message, variant: "destructive" });
      const loaded: CampaignItem[] = (rows || []).map((r: any) => ({
        product_model: r.product_model,
        product_name: r.product_name || "",
        quantity: r.quantity,
        unit_price: r.unit_price,
      }));
      setItems(loaded.length > 0 ? loaded : [{ product_model: "", product_name: "", quantity: 1, unit_price: null }]);
    } else {
      // template_quote_id is not in Campaign type but may exist on row
      setTemplateQuoteId((c as any).template_quote_id || "");
    }

    setOpenWizard(true);
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

      const payload = {
        slug, title, description: description || null,
        campaign_type: type,
        promo_note: promoNote || null,
        starts_at: startsAt || null,
        ends_at: endsAt || null,
        is_featured: isFeatured,
        estimated_total: estTotal,
        template_quote_id: type === "quote_template" && templateQuoteId ? templateQuoteId : null,
      };

      let campaignId = editingId;

      if (editingId) {
        const { error } = await (supabase.from as any)("affiliate_campaigns")
          .update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { data: created, error } = await (supabase.from as any)("affiliate_campaigns")
          .insert({ ...payload, is_active: true })
          .select("id").single();
        if (error) throw error;
        campaignId = created.id;
      }

      if (type === "cart" && campaignId) {
        // Replace items: delete existing then insert current
        if (editingId) {
          const { error: delErr } = await (supabase.from as any)("affiliate_campaign_items")
            .delete().eq("campaign_id", campaignId);
          if (delErr) throw delErr;
        }
        const validItems = items.filter(i => i.product_model.trim());
        if (validItems.length > 0) {
          const { error: itemsErr } = await (supabase.from as any)("affiliate_campaign_items")
            .insert(validItems.map((it, idx) => ({
              campaign_id: campaignId,
              product_model: it.product_model,
              product_name: it.product_name || null,
              quantity: it.quantity,
              unit_price: it.unit_price,
              display_order: idx,
            })));
          if (itemsErr) throw itemsErr;
        }
      }

      toast({ title: editingId ? "อัพเดต campaign สำเร็จ" : "สร้าง campaign สำเร็จ" });
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

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Campaigns ทั้งหมด ({campaigns.length})</h2>
          <p className="text-xs text-muted-foreground">จัดการตะกร้า/ใบเสนอราคาสำหรับ Affiliate</p>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && setView(v as "grid" | "list")}
            size="sm"
            variant="outline"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view"><LayoutGrid className="w-4 h-4" /></ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view"><ListIcon className="w-4 h-4" /></ToggleGroupItem>
          </ToggleGroup>
          <Button onClick={() => { resetWizard(); setOpenWizard(true); }}>
            <Plus className="w-4 h-4 mr-1" /> สร้าง Campaign
          </Button>
        </div>
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
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(c)} title="แก้ไข">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
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
            <DialogTitle>
              {editingId ? "แก้ไข Campaign" : "สร้าง Campaign"} — ขั้น {step}/3
            </DialogTitle>
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
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">ลิงก์สาธารณะของ Campaign (สร้างอัตโนมัติ)</p>
                    <p className="text-sm font-mono truncate">/c/{slug || "—"}</p>
                  </div>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-primary hover:underline select-none">แก้ไขลิงก์</summary>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(slugify(e.target.value))}
                      placeholder="auto-generated-slug"
                      className="mt-2 w-64"
                    />
                  </details>
                </div>
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
            <CartPickerStep items={items} setItems={setItems} />
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
            {step > (editingId ? 2 : 1) && <Button variant="outline" onClick={() => setStep(step - 1)}>ย้อนกลับ</Button>}
            {step < 3 && <Button onClick={() => setStep(step + 1)} disabled={step === 2 && (!title || !slug)}>ถัดไป</Button>}
            {editingId && (
              <Button onClick={handleSave} disabled={saving} variant={step === 3 ? "default" : "secondary"}>
                {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                บันทึกการแก้ไข
              </Button>
            )}
            {!editingId && step === 3 && (
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

// ─── Cart Picker (Browse + Search) ──────────────────────────────────────
function CartPickerStep({
  items, setItems,
}: {
  items: CampaignItem[];
  setItems: (next: CampaignItem[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const categories = getCatalogCategories();
  const results = searchCatalogProducts(query, 30, category);

  const findIdx = (model: string) => items.findIndex(i => i.product_model === model);

  const addProduct = (p: CatalogProduct) => {
    const idx = findIdx(p.model);
    if (idx >= 0) {
      const next = [...items];
      next[idx].quantity += 1;
      setItems(next);
    } else {
      const cleanItems = items.filter(i => i.product_model.trim());
      setItems([
        ...cleanItems,
        {
          product_model: p.model,
          product_name: p.name,
          quantity: 1,
          unit_price: p.price ? Number(String(p.price).replace(/[^0-9.]/g, "")) || null : null,
        },
      ]);
    }
  };

  const updateQty = (idx: number, delta: number) => {
    const next = [...items];
    next[idx].quantity = Math.max(1, next[idx].quantity + delta);
    setItems(next);
  };

  const updatePrice = (idx: number, val: string) => {
    const next = [...items];
    next[idx].unit_price = val ? Number(val) : null;
    setItems(next);
  };

  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const validItems = items.filter(i => i.product_model.trim());
  const total = validItems.reduce((s, i) => s + (Number(i.unit_price || 0) * Number(i.quantity || 0)), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <span>เลือกสินค้าจากแคตตาล็อก ระบบเพิ่มเข้าตะกร้าให้ทันที — ปรับจำนวนและราคาโปรโมชันได้</span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาด้วยรุ่นหรือชื่อสินค้า..."
            className="pl-8"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg max-h-[280px] overflow-y-auto">
        {results.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">ไม่พบสินค้า</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
            {results.map(p => {
              const inCart = findIdx(p.model) >= 0;
              return (
                <button
                  key={p.model}
                  type="button"
                  onClick={() => addProduct(p)}
                  className={`flex items-center gap-2 p-2 rounded-md border text-left hover:border-primary hover:bg-primary/5 transition-colors ${inCart ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <Package className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{p.model}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.category}{p.price ? ` • ${p.price}` : ""}</div>
                  </div>
                  {inCart ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <Plus className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm">สินค้าในตะกร้า ({validItems.length})</Label>
          <span className="text-xs text-muted-foreground">รวมประมาณ: ฿{total.toLocaleString("th-TH")}</span>
        </div>
        {validItems.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
            ยังไม่มีสินค้า — คลิกเลือกจากด้านบน
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((it, idx) => it.product_model.trim() && (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{it.product_model}</div>
                  <div className="text-xs text-muted-foreground truncate">{it.product_name}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(idx, -1)}><Minus className="w-3 h-3" /></Button>
                  <span className="text-sm w-6 text-center">{it.quantity}</span>
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(idx, 1)}><Plus className="w-3 h-3" /></Button>
                </div>
                <Input
                  type="number"
                  value={it.unit_price ?? ""}
                  onChange={(e) => updatePrice(idx, e.target.value)}
                  placeholder="ราคา/หน่วย"
                  className="w-28 h-8 text-sm"
                />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeItem(idx)}>
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
