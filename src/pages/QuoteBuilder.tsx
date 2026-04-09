import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Search, Plus, Minus, Trash2, FileText,
  Send, Loader2, ShoppingCart, Package, ChevronDown, MessageSquare,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";
import SEOHead from "@/components/SEOHead";
import FooterCompact from "@/components/FooterCompact";

interface CatalogProduct {
  id: string;
  model: string;
  name_th: string | null;
  category: string;
  base_price: number;
  specs: Record<string, string>;
  min_qty: number;
  lead_days: number;
}

interface CartItem {
  product: CatalogProduct;
  qty: number;
  notes: string;
}

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

const QuoteBuilder = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useEngagementTracker();

  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCatalog, setShowCatalog] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [generalNotes, setGeneralNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin-login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  // Fetch catalog
  useEffect(() => {
    (async () => {
      try {
        const { data } = await (supabase.from as any)("product_catalog")
          .select("id, model, name_th, category, base_price, specs, min_qty, lead_days")
          .eq("is_active", true)
          .order("category")
          .order("model");
        if (data) setCatalog(data);
      } catch { /* silent */ }
      setCatalogLoading(false);
    })();
  }, []);

  // Get unique categories
  const categories = [...new Set(catalog.map((p) => p.category))].sort();

  // Filter catalog
  const filteredCatalog = catalog.filter((p) => {
    const matchSearch = !searchQuery ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.name_th || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Cart operations
  const addToCart = (product: CatalogProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: Math.max(1, product.min_qty), notes: "" }];
    });
    setShowCatalog(false);
    setSearchQuery("");
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.base_price * item.qty, 0);
  const vat = subtotal * 0.07;
  const grandTotal = subtotal + vat;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("th-TH", { minimumFractionDigits: 0 }).format(Math.round(n));

  // Submit
  const handleSubmit = async () => {
    if (!user || cart.length === 0) return;
    setSubmitting(true);
    try {
      // Get profile for auto-fill
      let profileData: any = {};
      try {
        const { data } = await (supabase.from as any)("profiles").select("*").eq("id", user.id).maybeSingle();
        if (data) profileData = data;
      } catch { /* silent */ }

      // Insert quote_request
      const products = cart.map((item) => ({
        category: item.product.category,
        model: item.product.model,
        qty: item.qty,
      }));

      const { data: quoteData, error } = await (supabase.from as any)("quote_requests").insert({
        user_id: user.id,
        name: profileData.full_name || user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: profileData.phone || user.user_metadata?.phone || null,
        company: profileData.company_name || user.user_metadata?.company || null,
        products,
        details: generalNotes || null,
        subtotal,
        grand_total: grandTotal,
      }).select("id").single();

      if (error) throw error;

      // Insert line items
      if (quoteData?.id) {
        const lineItems = cart.map((item, i) => ({
          quote_id: quoteData.id,
          product_id: item.product.id,
          model: item.product.model,
          category: item.product.category,
          qty: item.qty,
          unit_price: item.product.base_price,
          discount_percent: 0,
          custom_specs: item.product.specs || {},
          admin_notes: item.notes || null,
          sort_order: i,
        }));

        const { error: lineError } = await (supabase.from as any)("quote_line_items").insert(lineItems);
        if (lineError) {
          console.error("Failed to save line items:", lineError);
          // Rollback: delete orphaned quote_request
          await (supabase.from as any)("quote_requests").delete().eq("id", quoteData.id);
          throw new Error("ไม่สามารถบันทึกรายการสินค้าได้ กรุณาลองใหม่อีกครั้ง");
        }
      }

      // Track engagement
      cart.forEach((item) => {
        trackEvent({
          eventType: "quote_request",
          productId: item.product.model,
          productCategory: item.product.category,
          productName: item.product.name_th || item.product.model,
          metadata: { qty: item.qty, price: item.product.base_price },
        });
      });

      setSubmitted(true);
      setStep(3);
      toast({ title: "ส่งคำขอใบเสนอราคาเรียบร้อย!", description: "ทีมขายจะตรวจสอบและติดต่อกลับภายใน 2 ชั่วโมง" });
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="สร้างใบเสนอราคา — ENT Group" description="เลือกสินค้าและขอใบเสนอราคาออนไลน์" path="/quote-builder" />

      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xs text-primary hover:underline flex items-center gap-1">
                <ArrowLeft size={12} /> กลับหน้าหลัก
              </Link>
              <h1 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <FileText size={20} className="text-primary" /> สร้างใบเสนอราคา
              </h1>
            </div>
            {/* Steps */}
            <div className="hidden sm:flex items-center gap-2">
              {[
                { num: 1, label: "เลือกสินค้า" },
                { num: 2, label: "ตรวจสอบ" },
                { num: 3, label: "ส่งคำขอ" },
              ].map((s) => (
                <span
                  key={s.num}
                  className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors ${
                    step >= s.num
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/60 text-muted-foreground"
                  }`}
                >
                  {s.num}. {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-6 py-6">
        {submitted ? (
          /* ═══ Step 3: Success ═══ */
          <div className="card-surface rounded-xl p-8 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-green-500" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">ส่งคำขอเรียบร้อย!</h2>
            <p className="text-sm text-muted-foreground mb-1">ทีมฝ่ายขายจะตรวจสอบราคาและส่งใบเสนอราคาอย่างเป็นทางการให้คุณ</p>
            <p className="text-xs text-muted-foreground mb-6">ตรวจสอบสถานะได้ที่ "ใบเสนอราคาของฉัน" ในบัญชีของคุณ</p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/my-account/quotes"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                ดูใบเสนอราคา
              </Link>
              <Link
                to="/"
                className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        ) : (
          /* ═══ Step 1-2: Builder ═══ */
          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Left: Product selection */}
            <div className="flex-1 min-w-0">
              {/* Search bar */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowCatalog(true); }}
                    onFocus={() => setShowCatalog(true)}
                    className={`${inputClass} pl-9`}
                    placeholder="พิมพ์ชื่อรุ่น เช่น GT9000, GK1506, EPC..."
                  />
                </div>
                <button
                  onClick={() => setShowCatalog(!showCatalog)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  <Package size={14} /> เรียกดูทั้งหมด <ChevronDown size={12} />
                </button>
              </div>

              {/* Catalog dropdown */}
              {showCatalog && (
                <div className="card-surface rounded-xl mb-4 max-h-80 overflow-y-auto animate-fade-in">
                  {/* Category filter */}
                  <div className="flex gap-1 p-3 border-b border-border overflow-x-auto">
                    <button
                      onClick={() => setCategoryFilter("all")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                        categoryFilter === "all" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/60"
                      }`}
                    >
                      ทั้งหมด ({catalog.length})
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategoryFilter(c)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                          categoryFilter === c ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/60"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  {catalogLoading ? (
                    <div className="p-3 space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                          <div className="w-9 h-9 rounded-lg bg-secondary/60 shrink-0" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-3 bg-secondary/60 rounded w-24" />
                            <div className="h-2.5 bg-secondary/40 rounded w-40" />
                          </div>
                          <div className="h-3 bg-secondary/60 rounded w-16 shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : filteredCatalog.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      {catalog.length === 0 ? "ยังไม่มีสินค้าในระบบ" : "ไม่พบสินค้าที่ค้นหา"}
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredCatalog.map((product) => {
                        const inCart = cart.some((item) => item.product.id === product.id);
                        return (
                          <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            disabled={inCart}
                            className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                              inCart ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary/30"
                            }`}
                          >
                            <div className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                              <Package size={14} className="text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-foreground">{product.model}</span>
                                <span className="text-[10px] text-muted-foreground">{product.category}</span>
                              </div>
                              {product.name_th && (
                                <p className="text-[11px] text-muted-foreground truncate">{product.name_th}</p>
                              )}
                              {product.specs?.cpu && (
                                <p className="text-[10px] text-muted-foreground/60">{product.specs.cpu}</p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-foreground">฿{formatPrice(product.base_price)}</span>
                              {product.lead_days > 0 && (
                                <p className="text-[9px] text-muted-foreground">{product.lead_days} วัน</p>
                              )}
                            </div>
                            {inCart ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 shrink-0">เพิ่มแล้ว</span>
                            ) : (
                              <Plus size={14} className="text-primary shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Cart / Line items */}
              <div className="card-surface rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingCart size={14} className="text-primary" /> รายการสินค้า ({cart.length})
                  </h3>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <ShoppingCart size={32} className="mx-auto mb-3 opacity-20" />
                    <p>ยังไม่มีสินค้า</p>
                    <button
                      onClick={() => { setShowCatalog(true); }}
                      className="mt-2 px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                    >
                      <Package size={12} className="inline mr-1" /> เลือกสินค้า
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 text-muted-foreground font-medium">#</th>
                          <th className="text-left py-2 text-muted-foreground font-medium">สินค้า</th>
                          <th className="text-center py-2 text-muted-foreground font-medium">จำนวน</th>
                          <th className="text-right py-2 text-muted-foreground font-medium">ราคา/หน่วย</th>
                          <th className="text-right py-2 text-muted-foreground font-medium">รวม</th>
                          <th className="w-8"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item, i) => (
                          <tr key={item.product.id} className="border-b border-border/50">
                            <td className="py-2.5 text-muted-foreground">{i + 1}</td>
                            <td className="py-2.5">
                              <span className="font-bold text-foreground">{item.product.model}</span>
                              <span className="block text-[10px] text-muted-foreground">
                                {item.product.category}
                                {item.product.specs?.cpu && ` · ${item.product.specs.cpu}`}
                              </span>
                              {/* Notes per item */}
                              <div className="mt-1">
                                <div className="flex items-center gap-1">
                                  <MessageSquare size={9} className="text-muted-foreground/50" />
                                  <input
                                    value={item.notes}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setCart((prev) =>
                                        prev.map((c) =>
                                          c.product.id === item.product.id ? { ...c, notes: val } : c
                                        )
                                      );
                                    }}
                                    className="w-full text-[10px] bg-transparent border-b border-transparent focus:border-primary/30 text-muted-foreground placeholder:text-muted-foreground/30 outline-none py-0.5 transition-colors"
                                    placeholder="หมายเหตุสำหรับรายการนี้..."
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 text-center">
                              <div className="inline-flex items-center gap-0.5 border border-border rounded-lg">
                                <button
                                  onClick={() => updateQty(item.product.id, -1)}
                                  className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-l-lg transition-colors"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="w-8 text-center text-xs font-bold">{item.qty}</span>
                                <button
                                  onClick={() => updateQty(item.product.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-r-lg transition-colors"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 text-right text-muted-foreground">฿{formatPrice(item.product.base_price)}</td>
                            <td className="py-2.5 text-right font-bold text-foreground">฿{formatPrice(item.product.base_price * item.qty)}</td>
                            <td className="py-2.5 text-center">
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-muted-foreground/40 hover:text-destructive transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Summary sidebar */}
            <div className="lg:w-64 shrink-0">
              <div className="card-surface rounded-xl p-4 sticky top-20">
                <h3 className="text-sm font-bold text-foreground mb-3">สรุปใบเสนอราคา</h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">รายการ ({cart.length})</span>
                    <span className="text-foreground">{totalItems} ชิ้น</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">รวมก่อน VAT</span>
                    <span className="text-foreground">฿{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VAT 7%</span>
                    <span className="text-foreground">฿{formatPrice(vat)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="text-foreground font-bold">ยอดรวมสุทธิ</span>
                    <span className="text-primary font-bold text-base">฿{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[11px] text-muted-foreground mb-1">หมายเหตุ / ความต้องการเพิ่มเติม</label>
                  <textarea
                    value={generalNotes}
                    onChange={(e) => setGeneralNotes(e.target.value)}
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="เช่น ต้องการ RAM เพิ่ม, OS พิเศษ, จำนวนมาก..."
                  />
                </div>

                <p className="text-[10px] text-muted-foreground mt-3 mb-2">
                  * ราคาเป็นราคาเบื้องต้น ทีมขายจะตรวจสอบและยืนยันราคาสุดท้ายให้
                </p>

                <button
                  onClick={() => { setStep(2); handleSubmit(); }}
                  disabled={cart.length === 0 || submitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <><Loader2 size={14} className="animate-spin" /> กำลังส่ง...</>
                  ) : (
                    <><Send size={14} /> ส่งขอใบเสนอราคา</>
                  )}
                </button>

                <p className="text-[9px] text-muted-foreground/60 text-center mt-2">
                  ทีมขายจะตรวจสอบและอนุมัติภายใน 2 ชม.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Summary Bar */}
      {!submitted && cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-3 z-40">
          <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground">{cart.length} รุ่น · {totalItems} ชิ้น</p>
              <p className="text-sm font-bold text-primary">฿{formatPrice(grandTotal)}</p>
            </div>
            <button
              onClick={() => { setStep(2); handleSubmit(); }}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
            >
              {submitting ? (
                <><Loader2 size={14} className="animate-spin" /> กำลังส่ง...</>
              ) : (
                <><Send size={14} /> ส่งคำขอ</>
              )}
            </button>
          </div>
        </div>
      )}

      <FooterCompact />
    </div>
  );
};

export default QuoteBuilder;
