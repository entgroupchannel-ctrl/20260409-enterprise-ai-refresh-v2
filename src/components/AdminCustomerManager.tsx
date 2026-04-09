import { useState, useEffect } from "react";
import {
  Users, Search, Save, Loader2, RefreshCw, Building2,
  CreditCard, Percent, UserCheck, ChevronDown, Filter,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CustomerProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  customer_tier: string;
  credit_terms: string | null;
  discount_percent: number | null;
  account_manager_id: string | null;
}

interface SalesUser {
  user_id: string;
  email: string;
  full_name: string;
}

const TIERS = [
  { value: "regular", label: "Regular", color: "bg-secondary text-secondary-foreground" },
  { value: "dealer", label: "Dealer", color: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  { value: "vip", label: "VIP", color: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  { value: "premium", label: "Premium", color: "bg-primary/15 text-primary border-primary/30" },
];

const CREDIT_OPTIONS = [
  { value: "COD", label: "COD (เงินสด)" },
  { value: "7_days", label: "เครดิต 7 วัน" },
  { value: "15_days", label: "เครดิต 15 วัน" },
  { value: "30_days", label: "เครดิต 30 วัน" },
  { value: "45_days", label: "เครดิต 45 วัน" },
  { value: "60_days", label: "เครดิต 60 วัน" },
  { value: "90_days", label: "เครดิต 90 วัน" },
];

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-border bg-background text-base font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";

const AdminCustomerManager = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [salesTeam, setSalesTeam] = useState<SalesUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");

  // Edit dialog
  const [editCustomer, setEditCustomer] = useState<CustomerProfile | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    customer_tier: "regular",
    credit_terms: "COD",
    discount_percent: 0,
    account_manager_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch profiles + sales team + admin user IDs in parallel
      const [profilesRes, salesRes, adminRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, company_name, phone, customer_tier, credit_terms, discount_percent, account_manager_id")
          .order("company_name", { ascending: true }),
        supabase.rpc("get_sales_team"),
        supabase.rpc("get_admin_users"),
      ]);

      if (profilesRes.error) throw profilesRes.error;

      setSalesTeam((salesRes.data as SalesUser[]) || []);

      // Build set of admin user IDs to exclude
      const adminIds = new Set(
        ((adminRes.data as any[]) || []).map((a: any) => a.user_id)
      );

      // Filter out admin/super_admin users — show only real customers
      setCustomers(
        (profilesRes.data || [])
          .filter((p: any) => !adminIds.has(p.id))
          .map((p: any) => ({
            ...p,
            email: "",
          }))
      );
    } catch (err: any) {
      toast({ title: "โหลดข้อมูลไม่สำเร็จ", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (c: CustomerProfile) => {
    setEditCustomer(c);
    setEditForm({
      customer_tier: c.customer_tier || "regular",
      credit_terms: c.credit_terms || "COD",
      discount_percent: c.discount_percent || 0,
      account_manager_id: c.account_manager_id || "",
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!editCustomer) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          customer_tier: editForm.customer_tier,
          credit_terms: editForm.credit_terms,
          discount_percent: editForm.discount_percent,
          account_manager_id: editForm.account_manager_id || null,
        } as any)
        .eq("id", editCustomer.id);
      if (error) throw error;

      toast({ title: `อัปเดตข้อมูล ${editCustomer.full_name || editCustomer.company_name || "ลูกค้า"} สำเร็จ` });
      setEditOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "บันทึกไม่สำเร็จ", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const getTierConfig = (tier: string) =>
    TIERS.find((t) => t.value === tier) || TIERS[0];

  const getManagerName = (id: string | null) => {
    if (!id) return "-";
    const found = salesTeam.find((s) => s.user_id === id);
    return found ? found.full_name || found.email : id.slice(0, 8) + "...";
  };

  // Filter
  const filtered = customers.filter((c) => {
    const matchSearch =
      !search ||
      (c.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.company_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || "").includes(search);
    const matchTier = filterTier === "all" || c.customer_tier === filterTier;
    return matchSearch && matchTier;
  });

  if (!isAdmin) {
    return (
      <div className="card-surface rounded-xl p-14 text-center text-base text-muted-foreground font-medium">
        <Users size={40} className="mx-auto mb-4 opacity-25" />
        <p>เฉพาะ Admin เท่านั้นที่จัดการข้อมูลลูกค้าได้</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2.5">
          <Building2 size={22} className="text-primary" /> จัดการลูกค้า ({filtered.length} ราย)
        </h3>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> รีเฟรช
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-10`}
            placeholder="ค้นหาชื่อ, บริษัท, เบอร์โทร..."
          />
        </div>
        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className={`${inputClass} w-auto min-w-[160px]`}
        >
          <option value="all">ทุก Tier</option>
          {TIERS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Customer List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-surface rounded-xl p-12 text-center text-base text-muted-foreground">
          ไม่พบลูกค้า
        </div>
      ) : (
        <div className="grid gap-2">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-2.5 text-sm font-bold text-muted-foreground uppercase tracking-wide">
            <div className="col-span-3">ชื่อ / บริษัท</div>
            <div className="col-span-2 text-center">Tier</div>
            <div className="col-span-2 text-center">เครดิต</div>
            <div className="col-span-1 text-center">ส่วนลด</div>
            <div className="col-span-2 text-center">ผู้ดูแล</div>
            <div className="col-span-2 text-center">จัดการ</div>
          </div>

          {filtered.map((c) => {
            const tierCfg = getTierConfig(c.customer_tier);
            return (
              <div
                key={c.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-4 md:px-5 md:py-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/[0.02] transition-all"
              >
                {/* Name + Company */}
                <div className="col-span-3">
                  <p className="text-base font-bold text-foreground truncate">
                    {c.full_name || "ไม่ระบุชื่อ"}
                  </p>
                  {c.company_name && (
                    <p className="text-sm text-muted-foreground truncate">{c.company_name}</p>
                  )}
                  {c.phone && (
                    <p className="text-xs text-muted-foreground md:hidden">{c.phone}</p>
                  )}
                </div>

                {/* Tier */}
                <div className="col-span-2 text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold border ${tierCfg.color}`}>
                    {tierCfg.label}
                  </span>
                </div>

                {/* Credit */}
                <div className="col-span-2 text-center">
                  <span className="text-sm font-medium text-foreground">
                    {CREDIT_OPTIONS.find((co) => co.value === c.credit_terms)?.label || c.credit_terms || "COD"}
                  </span>
                </div>

                {/* Discount */}
                <div className="col-span-1 text-center">
                  <span className={`text-sm font-bold ${(c.discount_percent || 0) > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                    {(c.discount_percent || 0) > 0 ? `-${c.discount_percent}%` : "-"}
                  </span>
                </div>

                {/* Account Manager */}
                <div className="col-span-2 text-center">
                  <span className="text-sm font-medium text-muted-foreground truncate">
                    {getManagerName(c.account_manager_id)}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 text-center">
                  <button
                    onClick={() => openEdit(c)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
                  >
                    <UserCheck size={14} /> ตั้งค่า
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tier Legend */}
      <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
        <span className="font-bold">ระดับสิทธิ์เอกสาร:</span>
        <span>Regular = เอกสาร public</span>
        <span>Dealer/VIP/Premium = เอกสาร public + vip + dealer</span>
        <span>Private = ต้อง grant รายบุคคล</span>
      </div>

      {/* ═══ Edit Dialog ═══ */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <UserCheck size={20} className="text-primary" />
              ตั้งค่าลูกค้า
            </DialogTitle>
          </DialogHeader>

          {editCustomer && (
            <div className="space-y-5 pt-2">
              {/* Customer Info (read-only) */}
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-base font-bold text-foreground">{editCustomer.full_name || "ไม่ระบุชื่อ"}</p>
                {editCustomer.company_name && (
                  <p className="text-sm text-muted-foreground">{editCustomer.company_name}</p>
                )}
              </div>

              {/* Tier */}
              <div>
                <label className="block text-base font-bold text-foreground mb-2 flex items-center gap-2">
                  <Users size={16} className="text-primary" /> ระดับลูกค้า (Tier)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TIERS.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setEditForm((f) => ({ ...f, customer_tier: t.value }))}
                      className={`py-2.5 rounded-lg text-sm font-bold border-2 transition-all ${
                        editForm.customer_tier === t.value
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  กำหนดสิทธิ์เข้าถึงเอกสาร: Dealer/VIP/Premium เข้าถึงเอกสาร vip + dealer ได้
                </p>
              </div>

              {/* Credit Terms */}
              <div>
                <label className="block text-base font-bold text-foreground mb-2 flex items-center gap-2">
                  <CreditCard size={16} className="text-primary" /> เงื่อนไขเครดิต
                </label>
                <select
                  value={editForm.credit_terms}
                  onChange={(e) => setEditForm((f) => ({ ...f, credit_terms: e.target.value }))}
                  className={inputClass}
                >
                  {CREDIT_OPTIONS.map((co) => (
                    <option key={co.value} value={co.value}>{co.label}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                  ใช้เป็นค่าเริ่มต้นในใบเสนอราคา/ใบแจ้งหนี้อัตโนมัติ
                </p>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-base font-bold text-foreground mb-2 flex items-center gap-2">
                  <Percent size={16} className="text-primary" /> ส่วนลดเริ่มต้น (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  step={0.5}
                  value={editForm.discount_percent}
                  onChange={(e) => setEditForm((f) => ({ ...f, discount_percent: parseFloat(e.target.value) || 0 }))}
                  className={inputClass}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  ส่วนลดเริ่มต้นเมื่อสร้างใบเสนอราคาให้ลูกค้ารายนี้
                </p>
              </div>

              {/* Account Manager */}
              <div>
                <label className="block text-base font-bold text-foreground mb-2 flex items-center gap-2">
                  <UserCheck size={16} className="text-primary" /> ผู้ดูแลบัญชี (Account Manager)
                </label>
                <select
                  value={editForm.account_manager_id}
                  onChange={(e) => setEditForm((f) => ({ ...f, account_manager_id: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">— ไม่ระบุ —</option>
                  {salesTeam.map((s) => (
                    <option key={s.user_id} value={s.user_id}>
                      {s.full_name || s.email} ({s.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                  Sales Person ที่รับผิดชอบดูแลลูกค้ารายนี้
                </p>
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-extrabold hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-sm"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                บันทึก
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomerManager;
