import { useState, useEffect } from "react";
import {
  Package, Plus, Search, Edit3, Trash2, Save, X,
  Loader2, RefreshCw, ChevronDown, ChevronUp, Check, Info,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CatalogProduct {
  id: string;
  model: string;
  name_th: string | null;
  description: string | null;
  category: string;
  subcategory: string | null;
  brand: string | null;
  base_price: number;
  specs: Record<string, string>;
  configurable_options: any[];
  min_qty: number;
  lead_days: number;
  unit_label: string | null;
  warranty_terms: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

const CATEGORIES = [
  "GT Series — Mini PC",
  "GB Series — Compact",
  "EPC Series",
  "EPC Box Series",
  "GK Series — Panel PC",
  "Panel PC GTG/GTY",
  "UTC Series",
  "Smart Display & KIOSK",
  "Rugged Tablet",
  "Rugged Notebook",
  "Rugged Handheld",
  "Volktek Switch",
  "Mini PC Firewall",
  "vCloudPoint",
  "Waterproof PC IP69K",
  "iBox Series",
  "All-in-One PC",
  "อื่นๆ",
];

const SPEC_KEYS = [
  { key: "cpu", label: "CPU", placeholder: "Intel Core i5-1235U" },
  { key: "ram", label: "RAM", placeholder: "8GB DDR4" },
  { key: "storage", label: "Storage", placeholder: "256GB SSD" },
  { key: "com", label: "COM", placeholder: "6 COM" },
  { key: "usb", label: "USB", placeholder: "6 USB" },
  { key: "lan", label: "LAN", placeholder: "2 LAN" },
  { key: "display", label: "Display", placeholder: "HDMI×3" },
  { key: "gpio", label: "GPIO", placeholder: "✓" },
  { key: "gen", label: "Gen", placeholder: "Gen 8-10" },
  { key: "fanless", label: "Fanless", placeholder: "✓" },
  { key: "ip_rating", label: "IP Rating", placeholder: "IP65" },
  { key: "sim", label: "SIM", placeholder: "1 SIM" },
  { key: "os", label: "OS", placeholder: "Windows 10/11 Pro" },
  { key: "power", label: "Power", placeholder: "12V DC" },
  { key: "dimension", label: "Dimension", placeholder: "200×150×50 mm" },
  { key: "weight", label: "Weight", placeholder: "1.2 kg" },
  { key: "certification", label: "Cert", placeholder: "CE, FCC" },
];

const inp = "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";
const lbl = "block text-[11px] font-medium text-muted-foreground mb-1";

const emptyForm = {
  model: "", name_th: "", description: "", category: "", subcategory: "", brand: "",
  base_price: 0, min_qty: 1, lead_days: 7, unit_label: "เครื่อง", warranty_terms: "1 ปี Carry-in",
  is_active: true, notes: "",
  specs: {} as Record<string, string>,
};

const AdminProductCatalog = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await (supabase.from as any)("product_catalog")
        .select("*")
        .order("category", { ascending: true })
        .order("model", { ascending: true });
      if (data) setProducts(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async () => {
    if (!form.model || !form.category) {
      toast({ title: "กรุณากรอกรุ่นสินค้าและหมวดหมู่", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      // Clean empty spec values
      const specs: Record<string, string> = {};
      Object.entries(form.specs).forEach(([k, v]) => { if (v && v.trim()) specs[k] = v.trim(); });

      const payload = {
        model: form.model,
        name_th: form.name_th || null,
        description: form.description || null,
        category: form.category,
        subcategory: form.subcategory || null,
        brand: form.brand || null,
        base_price: form.base_price,
        specs,
        min_qty: form.min_qty,
        lead_days: form.lead_days,
        unit_label: form.unit_label || "เครื่อง",
        warranty_terms: form.warranty_terms || null,
        is_active: form.is_active,
        notes: form.notes || null,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await (supabase.from as any)("product_catalog").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "อัปเดตสินค้าสำเร็จ" });
      } else {
        const { error } = await (supabase.from as any)("product_catalog").insert(payload);
        if (error) throw error;
        toast({ title: "เพิ่มสินค้าสำเร็จ" });
      }
      setEditingId(null);
      setShowAddForm(false);
      setForm(emptyForm);
      setShowAllSpecs(false);
      fetchProducts();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleEdit = (p: CatalogProduct) => {
    setEditingId(p.id);
    setShowAddForm(true);
    setForm({
      model: p.model,
      name_th: p.name_th || "",
      description: (p as any).description || "",
      category: p.category,
      subcategory: p.subcategory || "",
      brand: (p as any).brand || "",
      base_price: p.base_price,
      min_qty: p.min_qty,
      lead_days: p.lead_days,
      unit_label: (p as any).unit_label || "เครื่อง",
      warranty_terms: (p as any).warranty_terms || "1 ปี Carry-in",
      is_active: p.is_active,
      notes: p.notes || "",
      specs: p.specs || {},
    });
    setShowAllSpecs(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบสินค้านี้?")) return;
    await (supabase.from as any)("product_catalog").delete().eq("id", id);
    toast({ title: "ลบสินค้าแล้ว" });
    fetchProducts();
  };

  const handleCancel = () => {
    setEditingId(null); setShowAddForm(false); setForm(emptyForm); setShowAllSpecs(false);
  };

  const updateSpec = (key: string, value: string) => {
    setForm((f) => ({ ...f, specs: { ...f.specs, [key]: value } }));
  };

  const filtered = products.filter((p) => {
    const matchSearch = !searchQuery ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.name_th || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((p as any).description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const fp = (n: number) => new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 }).format(n);
  const specSummary = (specs: Record<string, string>) => {
    return Object.entries(specs).filter(([, v]) => v && v !== "No").slice(0, 4).map(([k, v]) => `${k}: ${v}`).join(" | ");
  };

  // Primary specs shown first (always visible)
  const PRIMARY_SPECS = ["cpu", "ram", "storage", "com", "usb", "lan", "display"];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Package size={18} className="text-primary" /> สินค้าทั้งหมด ({products.length})
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={fetchProducts} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> รีเฟรช
          </button>
          <button onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setForm(emptyForm); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
            <Plus size={14} /> เพิ่มสินค้า
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${inp} pl-9`} placeholder="ค้นหารุ่น ชื่อ หรือรายละเอียด..." />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={`${inp} w-auto max-w-[200px]`}>
          <option value="all">ทุกหมวดหมู่</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* ═══ Add/Edit Form ═══ */}
      {showAddForm && (
        <div className="card-surface rounded-xl p-5 space-y-4 animate-fade-in">
          <h4 className="text-sm font-bold text-foreground">{editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h4>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className={lbl}>รุ่น (Model) *</label>
              <input value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} className={inp} placeholder="GT9000" />
            </div>
            <div>
              <label className={lbl}>ชื่อภาษาไทย</label>
              <input value={form.name_th} onChange={(e) => setForm((f) => ({ ...f, name_th: e.target.value }))} className={inp} placeholder="มินิพีซี รุ่น..." />
            </div>
            <div>
              <label className={lbl}>หมวดหมู่ *</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inp}>
                <option value="">เลือก</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>แบรนด์</label>
              <input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className={inp} placeholder="GITASHI, Volktek..." />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={lbl}>คำอธิบายสินค้า (แสดงในใบเสนอราคา)</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={`${inp} resize-none`} rows={3}
              placeholder="รายละเอียดสินค้า เช่น Mini PC Fanless GT1300 — 3 HDMI 6 COM GPIO&#10;- เป็น License จากโรงงานผู้ผลิตสินค้า&#10;- รองรับ Windows 10/11 Pro" />
          </div>

          {/* Pricing & Settings */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div>
              <label className={lbl}>ราคาพื้นฐาน (฿) *</label>
              <input type="number" value={form.base_price} onChange={(e) => setForm((f) => ({ ...f, base_price: parseFloat(e.target.value) || 0 }))} className={inp} />
            </div>
            <div>
              <label className={lbl}>หน่วย</label>
              <select value={form.unit_label} onChange={(e) => setForm((f) => ({ ...f, unit_label: e.target.value }))} className={inp}>
                <option value="เครื่อง">เครื่อง</option>
                <option value="ชิ้น">ชิ้น</option>
                <option value="ชุด">ชุด</option>
                <option value="ตัว">ตัว</option>
                <option value="License">License</option>
                <option value="อัน">อัน</option>
              </select>
            </div>
            <div>
              <label className={lbl}>สั่งขั้นต่ำ</label>
              <input type="number" value={form.min_qty} onChange={(e) => setForm((f) => ({ ...f, min_qty: parseInt(e.target.value) || 1 }))} className={inp} />
            </div>
            <div>
              <label className={lbl}>Lead time (วัน)</label>
              <input type="number" value={form.lead_days} onChange={(e) => setForm((f) => ({ ...f, lead_days: parseInt(e.target.value) || 7 }))} className={inp} />
            </div>
            <div>
              <label className={lbl}>การรับประกัน</label>
              <input value={form.warranty_terms} onChange={(e) => setForm((f) => ({ ...f, warranty_terms: e.target.value }))} className={inp} placeholder="1 ปี Carry-in" />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="rounded border-border text-primary w-4 h-4" />
              <span className="text-xs text-muted-foreground">เปิดขาย</span>
            </div>
          </div>

          {/* Specs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${lbl} mb-0`}>สเปกสินค้า</label>
              <button onClick={() => setShowAllSpecs(!showAllSpecs)} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                {showAllSpecs ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                {showAllSpecs ? "ซ่อน" : `แสดงทั้งหมด (${SPEC_KEYS.length})`}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(showAllSpecs ? SPEC_KEYS : SPEC_KEYS.filter((s) => PRIMARY_SPECS.includes(s.key))).map((s) => (
                <div key={s.key}>
                  <label className="text-[10px] text-muted-foreground">{s.label}</label>
                  <input value={form.specs[s.key] || ""} onChange={(e) => updateSpec(s.key, e.target.value)}
                    className={`${inp} text-xs py-1.5`} placeholder={s.placeholder} />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={lbl}>หมายเหตุ (ภายใน ไม่แสดงลูกค้า)</label>
            <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className={inp} placeholder="หมายเหตุสำหรับ admin" />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {editingId ? "อัปเดต" : "บันทึก"}
            </button>
            <button onClick={handleCancel} className="px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* ═══ Product Table ═══ */}
      <div className="card-surface rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">{products.length === 0 ? "ยังไม่มีสินค้าในระบบ" : "ไม่พบสินค้าที่ค้นหา"}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">รุ่น / ชื่อ</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">หมวดหมู่</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">สเปก</th>
                  <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">ราคา</th>
                  <th className="text-center px-4 py-2.5 text-muted-foreground font-medium w-16">หน่วย</th>
                  <th className="text-center px-4 py-2.5 text-muted-foreground font-medium w-16">สถานะ</th>
                  <th className="text-center px-4 py-2.5 text-muted-foreground font-medium w-20">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <>
                    <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors cursor-pointer"
                      onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}>
                      <td className="px-4 py-3">
                        <span className="font-bold text-foreground">{p.model}</span>
                        {(p as any).brand && <span className="text-[10px] ml-1.5 text-muted-foreground">({(p as any).brand})</span>}
                        {p.name_th && <span className="block text-xs text-muted-foreground">{p.name_th}</span>}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">{p.category}</td>
                      <td className="px-4 py-2.5 text-muted-foreground text-[11px]">{specSummary(p.specs || {}) || "—"}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-foreground">{fp(p.base_price)}</td>
                      <td className="px-4 py-2.5 text-center text-xs text-muted-foreground">{(p as any).unit_label || "เครื่อง"}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                          p.is_active ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border"
                        }`}>{p.is_active ? "เปิด" : "ปิด"}</span>
                      </td>
                      <td className="px-4 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleEdit(p)} className="p-1.5 rounded hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors">
                            <Edit3 size={12} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded Row — show description + all specs */}
                    {expandedRow === p.id && (
                      <tr key={`${p.id}-detail`} className="bg-secondary/10">
                        <td colSpan={7} className="px-6 py-3">
                          <div className="space-y-2">
                            {(p as any).description && (
                              <div>
                                <span className="text-[10px] font-medium text-muted-foreground uppercase">คำอธิบาย:</span>
                                <p className="text-xs text-foreground/80 whitespace-pre-line mt-0.5">{(p as any).description}</p>
                              </div>
                            )}
                            {p.specs && Object.keys(p.specs).length > 0 && (
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {Object.entries(p.specs).filter(([, v]) => v && v !== "No").map(([k, v]) => (
                                  <span key={k} className="text-[11px] text-muted-foreground">
                                    <span className="font-medium text-foreground/60">{k}:</span> {v}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-4 text-[10px] text-muted-foreground">
                              {(p as any).warranty_terms && <span>ประกัน: {(p as any).warranty_terms}</span>}
                              <span>Lead: {p.lead_days} วัน</span>
                              <span>ขั้นต่ำ: {p.min_qty}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductCatalog;
