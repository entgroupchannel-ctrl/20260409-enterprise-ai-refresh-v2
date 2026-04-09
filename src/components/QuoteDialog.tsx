import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";
import {
  FileText, Send, ShoppingCart, Plus, Trash2, Minus,
  Loader2, Camera, Sparkles, LogIn, UserPlus,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const productCategories = [
  "เลือกหมวดหมู่",
  "GT Series — Mini PC", "GB Series — Compact", "EPC Series",
  "EPC Box Series", "GK Series — Panel PC", "Panel PC GTG/GTY",
  "UTC Series", "Smart Display & KIOSK", "Rugged Tablet / Notebook",
  "Volktek Switch", "Mini PC Firewall", "vCloudPoint",
  "Waterproof PC IP69K", "อื่นๆ",
];

const categoryModels: Record<string, string[]> = {
  "GT Series — Mini PC": ["GT1000", "GT1200", "GT1300", "GT1400", "GT2000", "GT3000", "GT4000", "GT4500", "GT5000", "GT6000", "GT7000", "GT8000", "GT9000"],
  "GB Series — Compact": ["GB1000", "GB2000", "GB4000 v1", "GB4000 v2", "GB5000"],
  "EPC Series": ["EPC-102A", "EPC-106A", "EPC-107A", "EPC-109A", "EPC-202A", "EPC-206A", "EPC-207A", "EPC-209A", "EPC-302A", "EPC-306A", "EPC-307A", "EPC-309A"],
  "EPC Box Series": ["EPC-10XA", "EPC-20XA", "EPC-30XA"],
  "GK Series — Panel PC": ["GK1004", "GK1501", "GK1506", "GK1901", "GK2101"],
  "Panel PC GTG/GTY": ["GTY101T", "GTY104T", "GTY121T", "GTY133T", "GTY150T", "GTY156T", "GTY170T", "GTY185T", "GTY190T", "GTY215T", "GTG238T", "GTG270T", "GTG320T"],
  "Mini PC Firewall": ["K8-F12", "K8-F18"],
  "vCloudPoint": ["vCloudPoint S100", "vCloudPoint S200"],
};

const callbackTimes = [
  "เลือก", "เช้า (9:00-12:00)", "บ่าย (13:00-16:00)",
  "เย็น (16:00-18:00)", "เวลาใดก็ได้",
];

type CatalogData = { name_th: string; description: string; base_price: number; specs: Record<string, string> };
type ProductItem = { category: string; model: string; qty: number; _catalogData?: CatalogData | null };

interface QuoteDialogProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
  productCategory?: string;
  initialProducts?: { category: string; model: string; qty: number }[];
}

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

const QuoteDialog = ({ open, onClose, productName = "", productCategory = "", initialProducts }: QuoteDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { trackEvent } = useEngagementTracker();

  const defaultProducts = initialProducts && initialProducts.length > 0
    ? initialProducts
    : [{ category: productCategory, model: productName, qty: 1 }];

  const [products, setProducts] = useState<ProductItem[]>(defaultProducts);

  // Sync products when dialog opens with new initialProducts
  useEffect(() => {
    if (open) {
      setProducts(initialProducts && initialProducts.length > 0
        ? initialProducts
        : [{ category: productCategory, model: productName, qty: 1 }]);
    }
  }, [open]);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    lineId: "", whatsapp: "", callbackTime: "", details: "",
    subscribe: true,
  });

  // Auto-fill from user profile when dialog opens
  useEffect(() => {
    if (open && user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.user_metadata?.full_name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.user_metadata?.phone || "",
        company: prev.company || user.user_metadata?.company || "",
      }));
    }
  }, [open, user]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const [memberForm, setMemberForm] = useState({
    timeline: "",
    budget: "",
    quantity: "",
    requirements: "",
  });

  // Validation for Member Mode form
  const memberValidationErrors: { timeline?: string; quantity?: string; products?: string } = {};
  if (user && !memberForm.timeline) {
    memberValidationErrors.timeline = "กรุณาเลือกระยะเวลาที่ต้องการ";
  }
  if (user && (!memberForm.quantity || parseInt(memberForm.quantity) < 1)) {
    memberValidationErrors.quantity = "กรุณากรอกจำนวนที่ต้องการ";
  }
  const validProducts = products.filter((p) => p.category || p.model);
  if (user && validProducts.length === 0) {
    memberValidationErrors.products = "กรุณาเลือกสินค้าอย่างน้อย 1 รายการ";
  }
  const isMemberFormValid = Object.keys(memberValidationErrors).length === 0;

  // Login form state
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "" });
  const [authLoading2, setAuthLoading2] = useState(false);

  // Reset when dialog opens with new product
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      // Reset states after close animation
      setTimeout(() => {
        setSubmitted(false);
        setProducts(defaultProducts);
      }, 300);
    }
  };

  // Pre-fill email from auth
  const emailValue = form.email || user?.email || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductChange = async (index: number, field: keyof ProductItem, value: string | number) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    // Fetch catalog data when model changes
    if (field === "model" && typeof value === "string" && value) {
      try {
        const { data } = await (supabase.from as any)("product_catalog")
          .select("name_th, description, base_price, specs")
          .eq("is_active", true)
          .ilike("model", value)
          .limit(1);
        const catalogData = data && data.length > 0 ? data[0] : null;
        setProducts((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], model: value, _catalogData: catalogData };
          return updated;
        });
      } catch { /* silent */ }
    }
  };

  const addProduct = () => setProducts([...products, { category: "", model: "", qty: 1 }]);
  const removeProduct = (i: number) => products.length > 1 && setProducts(products.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    // Member mode validation guard
    if (user && !isMemberFormValid) {
      const firstError = Object.values(memberValidationErrors)[0];
      toast({ title: "กรุณากรอกข้อมูลให้ครบ", description: firstError, variant: "destructive" });
      setLoading(false);
      submittingRef.current = false;
      return;
    }
    try {
      const { error } = await (supabase.from as any)("quote_requests").insert({
        user_id: user?.id || null,
        name: form.name || user?.user_metadata?.full_name || "",
        email: emailValue,
        phone: form.phone || null,
        company: form.company || null,
        line_id: form.lineId || null,
        whatsapp: form.whatsapp || null,
        callback_time: form.callbackTime || null,
        products: products.filter((p) => p.category || p.model),
        details: user
          ? `[timeline: ${memberForm.timeline}] [qty: ${memberForm.quantity}] [budget: ${memberForm.budget}] ${memberForm.requirements}`
          : form.details || null,
      });
      if (error) throw error;

      if (form.subscribe && emailValue) {
        await (supabase.from as any)("subscribers").insert({
          email: emailValue,
          name: form.name || user?.user_metadata?.full_name || null,
          source: "quote_request",
        }).then(() => {});
      }

      // Send auto-reply email (best-effort)
      supabase.functions.invoke('send-auto-reply', {
        body: {
          type: 'quote',
          name: form.name || user?.user_metadata?.full_name || '',
          email: emailValue,
          products: products.filter((p) => p.category || p.model),
        },
      }).catch((err) => console.warn('Auto-reply email failed:', err));

      setSubmitted(true);
      toast({ title: "ส่งคำขอเรียบร้อย!", description: "ทีมฝ่ายขายจะติดต่อกลับภายใน 24 ชม." });

      // ── Engagement Tracking ──
      products.filter((p) => p.category || p.model).forEach((p) => {
        trackEvent({
          eventType: "quote_request",
          productId: p.model || undefined,
          productCategory: p.category || undefined,
          productName: p.model || undefined,
          metadata: { qty: p.qty, email: emailValue },
        });
      });
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading2(true);
    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });
        if (error) throw error;
        toast({ title: "เข้าสู่ระบบสำเร็จ!" });
      } else {
        const { error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: { data: { full_name: authForm.name } },
        });
        if (error) throw error;
        toast({ title: "สมัครสำเร็จ!", description: "กรุณายืนยันอีเมลก่อนเข้าใช้งาน" });
      }
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally {
      setAuthLoading2(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            ขอใบเสนอราคา
          </DialogTitle>
          <DialogDescription>
            {productName ? `สินค้า: ${productName}` : "เลือกสินค้าและกรอกข้อมูลเพื่อรับใบเสนอราคา"}
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          /* ─── Not Logged In ─── */
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
              <LogIn size={28} className="mx-auto mb-2 text-primary" />
              <p className="text-sm font-semibold text-foreground mb-1">กรุณาเข้าสู่ระบบก่อน</p>
              <p className="text-xs text-muted-foreground">เพื่อความสะดวกในการติดตามใบเสนอราคาของคุณ</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === "register" && (
                <input
                  type="text" placeholder="ชื่อ-นามสกุล" required
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className={inputClass}
                />
              )}
              <input
                type="email" placeholder="อีเมล" required
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className={inputClass}
              />
              <input
                type="password" placeholder="รหัสผ่าน" required minLength={6}
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className={inputClass}
              />
              <button
                type="submit" disabled={authLoading2}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {authLoading2 ? <Loader2 size={14} className="animate-spin" /> : (authMode === "login" ? <LogIn size={14} /> : <UserPlus size={14} />)}
                {authMode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
              </button>
            </form>

            <button
              type="button" onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              เข้าสู่ระบบด้วย Google
            </button>

            <p className="text-center text-xs text-muted-foreground">
              {authMode === "login" ? (
                <>ยังไม่มีบัญชี? <button type="button" onClick={() => setAuthMode("register")} className="text-primary hover:underline font-medium">สมัครสมาชิก</button></>
              ) : (
                <>มีบัญชีแล้ว? <button type="button" onClick={() => setAuthMode("login")} className="text-primary hover:underline font-medium">เข้าสู่ระบบ</button></>
              )}
            </p>
          </div>
        ) : submitted ? (
          /* ─── Success ─── */
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">ส่งคำขอเรียบร้อย!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              ทีมฝ่ายขายจะจัดทำใบเสนอราคาและติดต่อกลับภายใน 24 ชั่วโมง
            </p>
            <button onClick={() => handleOpenChange(false)} className="text-sm text-primary hover:underline">
              ปิด
            </button>
          </div>
        ) : (
          /* ─── Quote Form (Logged In) ─── */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Products */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart size={16} className="text-primary" />
                <span className="text-sm font-bold text-foreground">สินค้าที่ต้องการ</span>
              </div>
              <div className="space-y-2">
                {products.map((product, index) => (
                  <div key={index}>
                  <div className="flex gap-2 items-center group">
                    <span className="w-4 text-xs text-muted-foreground/60 text-right shrink-0">{index + 1}.</span>
                    <div className="flex-1 grid grid-cols-[1fr_1fr_80px] gap-2">
                      <select
                        value={product.category}
                        onChange={(e) => {
                          handleProductChange(index, "category", e.target.value);
                          handleProductChange(index, "model", "");
                        }}
                        className={inputClass}
                      >
                        {productCategories.map((c) => (
                          <option key={c} value={c === "เลือกหมวดหมู่" ? "" : c}>{c}</option>
                        ))}
                      </select>
                      {(() => {
                        const models = product.category ? categoryModels[product.category] : null;
                        if (models) {
                          const inList = models.includes(product.model);
                          return (
                            <select
                              value={inList ? product.model : ""}
                              onChange={(e) => handleProductChange(index, "model", e.target.value)}
                              className={inputClass}
                            >
                              <option value="">เลือกรุ่น</option>
                              {models.map((m) => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                          );
                        }
                        return (
                          <input
                            type="text" placeholder="รุ่น / Model"
                            value={product.model}
                            onChange={(e) => handleProductChange(index, "model", e.target.value)}
                            className={inputClass}
                          />
                        );
                      })()}
                      <div className="flex items-center gap-0.5">
                        <button type="button" onClick={() => handleProductChange(index, "qty", Math.max(1, product.qty - 1))}
                          className="w-7 h-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted transition-colors">
                          <Minus size={12} />
                        </button>
                        <input
                          type="number" min="1" value={product.qty}
                          onChange={(e) => handleProductChange(index, "qty", Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-10 text-center px-0.5 py-1.5 rounded border border-border bg-background text-sm focus:outline-none"
                        />
                        <button type="button" onClick={() => handleProductChange(index, "qty", product.qty + 1)}
                          className="w-7 h-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    {products.length > 1 && (
                      <button type="button" onClick={() => removeProduct(index)}
                        className="text-muted-foreground/40 hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  {/* Product detail from catalog */}
                  {product.model && product._catalogData && (
                    <div className="ml-6 mt-1 mb-2 p-2.5 rounded-lg bg-secondary/30 border border-border/50 text-xs space-y-1.5">
                      <p className="font-medium text-foreground">{product._catalogData.name_th || product.model}</p>
                      {product._catalogData.description && (
                        <p className="text-muted-foreground line-clamp-2">{product._catalogData.description}</p>
                      )}
                      {product._catalogData.specs && Object.keys(product._catalogData.specs).length > 0 && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground">
                          {Object.entries(product._catalogData.specs).map(([key, val]) => {
                            if (!val || val === "No" || (val === "Yes" && key !== "fanless" && key !== "gpio" && key !== "sim")) return null;
                            const labels: Record<string, string> = {
                              cpu: "CPU", ram: "RAM", storage: "Storage", display: "จอ",
                              com: "COM", usb: "USB", lan: "LAN", gpio: "GPIO", sim: "SIM",
                              gen: "Gen", fanless: "Fanless", ip_rating: "IP",
                            };
                            const label = labels[key] || key;
                            const display = val === "Yes" ? "✓" : val;
                            return (
                              <span key={key} className="inline-flex items-center gap-0.5">
                                <span className="font-medium text-foreground/60">{label}:</span> {display}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {product._catalogData.base_price > 0 && (
                        <p className="text-primary font-bold">ราคาเริ่มต้น ฿{product._catalogData.base_price.toLocaleString()}</p>
                      )}
                    </div>
                  )}
                </div>
                ))}
              </div>
              <button type="button" onClick={addProduct}
                className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                <Plus size={12} /> เพิ่มสินค้า
              </button>
            </div>

            {/* Member Quick Form */}
            <div className="space-y-3">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                สวัสดีคุณ <span className="font-semibold">{user?.user_metadata?.full_name || user?.email}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  ระยะเวลาที่ต้องการ <span className="text-red-500">*</span>
                </label>
                <select
                  value={memberForm.timeline}
                  onChange={(e) => setMemberForm({ ...memberForm, timeline: e.target.value })}
                  className={`${inputClass} ${memberValidationErrors.timeline ? "border-red-500" : ""}`}
                >
                  <option value="">เลือกระยะเวลา</option>
                  <option value="เร่งด่วน (ภายใน 1 สัปดาห์)">เร่งด่วน (ภายใน 1 สัปดาห์)</option>
                  <option value="1-2 สัปดาห์">1-2 สัปดาห์</option>
                  <option value="1 เดือน">1 เดือน</option>
                  <option value="ยังไม่แน่ใจ">ยังไม่แน่ใจ</option>
                </select>
                {memberValidationErrors.timeline && (
                  <p className="text-xs text-red-500 mt-1">{memberValidationErrors.timeline}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  จำนวนที่ต้องการ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" min="1" placeholder="จำนวนหน่วย"
                  value={memberForm.quantity}
                  onChange={(e) => setMemberForm({ ...memberForm, quantity: e.target.value })}
                  className={`${inputClass} ${memberValidationErrors.quantity ? "border-red-500" : ""}`}
                />
                {memberValidationErrors.quantity && (
                  <p className="text-xs text-red-500 mt-1">{memberValidationErrors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">งบประมาณโดยประมาณ</label>
                <select
                  value={memberForm.budget}
                  onChange={(e) => setMemberForm({ ...memberForm, budget: e.target.value })}
                  className={inputClass}
                >
                  <option value="">ไม่ระบุ</option>
                  <option value="ต่ำกว่า 50,000 บาท">ต่ำกว่า 50,000 บาท</option>
                  <option value="50,000 - 200,000 บาท">50,000 - 200,000 บาท</option>
                  <option value="200,000 - 500,000 บาท">200,000 - 500,000 บาท</option>
                  <option value="มากกว่า 500,000 บาท">มากกว่า 500,000 บาท</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">ความต้องการอื่นๆ / สเปคเพิ่มเติม</label>
                <textarea
                  rows={3} placeholder="เช่น ต้องการ RAM เพิ่ม, ระบบปฏิบัติการพิเศษ, การรับประกัน ฯลฯ"
                  value={memberForm.requirements}
                  onChange={(e) => setMemberForm({ ...memberForm, requirements: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Subscribe */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.subscribe}
                onChange={(e) => setForm({ ...form, subscribe: e.target.checked })}
                className="rounded border-border text-primary focus:ring-primary/30 w-4 h-4"
              />
              <span className="text-xs text-muted-foreground">สมัครรับข่าวสาร โปรโมชั่น และอัปเดตจาก ENT Group</span>
            </label>

            {memberValidationErrors.products && (
              <p className="text-xs text-red-500">{memberValidationErrors.products}</p>
            )}
            <button type="submit" disabled={loading || (!!user && !isMemberFormValid)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {loading ? "กำลังส่ง..." : "ส่งคำขอใบเสนอราคา"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
