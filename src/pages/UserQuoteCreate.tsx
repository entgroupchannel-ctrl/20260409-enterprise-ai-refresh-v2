import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Plus, Minus, Trash2, FileText, Send, Loader2,
  ShoppingCart, Package, ChevronDown, HelpCircle, X,
  ChevronRight, ArrowLeft, CheckCircle, Lightbulb, MousePointer,
  Save, FilePlus, FolderOpen, Clock, MessageSquare, DollarSign,
  Truck, Shield, Info,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";
import { useQuoteCart } from "@/hooks/useQuoteCart";
import QuoteTimeline from "@/components/QuoteTimeline";
import { notifyQuoteStatus, getSaleInfo, productSummaryText } from "@/utils/notifyQuoteStatus";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ─── Types ───
interface CatalogProduct {
  id: string;
  model: string;
  name_th: string | null;
  description: string | null;
  category: string;
  base_price: number;
  specs: Record<string, string>;
  min_qty: number;
  lead_days: number;
}

interface CartItem {
  product: CatalogProduct | null;
  customModel: string;
  customCategory: string;
  qty: number;
  unitPrice: number;
  notes: string;
  discountPercent?: number;
  lineTotal?: number;
}

// ─── Quote Status Config ───
const STATUS_CONFIG: Record<string, { label: string; color: string; step: number }> = {
  draft: { label: "แบบร่าง", color: "bg-gray-400", step: 0 },
  new: { label: "ส่งแล้ว", color: "bg-blue-500", step: 1 },
  reviewing: { label: "กำลังตรวจสอบ", color: "bg-yellow-500", step: 2 },
  quoted: { label: "เสนอราคาแล้ว", color: "bg-indigo-500", step: 3 },
  negotiating: { label: "กำลังเจรจา", color: "bg-amber-500", step: 3 },
  won: { label: "ตกลงราคา", color: "bg-green-500", step: 4 },
  lost: { label: "ยกเลิก", color: "bg-red-500", step: 4 },
};

const MILESTONE_STEPS = [
  { key: "draft", label: "สร้าง", icon: FileText },
  { key: "new", label: "ส่ง Admin", icon: Send },
  { key: "reviewing", label: "ตรวจสอบ", icon: Search },
  { key: "quoted", label: "เสนอราคา", icon: DollarSign },
  { key: "done", label: "สำเร็จ", icon: CheckCircle },
];

// ─── Onboarding Tutorial ───
const TUTORIAL_STEPS = [
  {
    title: "ยินดีต้อนรับ!",
    desc: "ระบบสร้างใบเสนอราคาช่วยให้คุณเลือกสินค้าและส่งขอราคาได้ง่ายๆ ทีมขายจะตรวจสอบและส่งราคาสุดท้ายให้คุณ",
    icon: Lightbulb,
    target: null,
  },
  {
    title: "ค้นหาสินค้า",
    desc: "พิมพ์ชื่อรุ่นในช่องค้นหา หรือกด 'เรียกดูทั้งหมด' เพื่อเลือกจากรายการสินค้า ถ้าไม่เจอรุ่นที่ต้องการ สามารถเพิ่มเองได้",
    icon: Search,
    target: "search-area",
  },
  {
    title: "เพิ่มสินค้าลงรายการ",
    desc: "คลิกที่สินค้าเพื่อเพิ่มลงรายการ ปรับจำนวน ราคา (ใส่หรือเว้นว่างก็ได้) ระบบจะดึงราคาจากฐานข้อมูลให้อัตโนมัติ",
    icon: ShoppingCart,
    target: "cart-area",
  },
  {
    title: "ตรวจสอบและส่ง",
    desc: "ตรวจสอบรายการ เพิ่มหมายเหตุถ้ามี แล้วกด 'ส่งขอใบเสนอราคา' — ทีมขายจะอนุมัติและส่งราคาสุดท้ายให้ภายใน 2 ชม.",
    icon: Send,
    target: "summary-area",
  },
];

const TUTORIAL_KEY = "ent_quote_tutorial_done";

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

const UserQuoteCreate = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useEngagementTracker();
  const globalCart = useQuoteCart();

  // Tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Catalog
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCatalog, setShowCatalog] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [generalNotes, setGeneralNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  // Draft management
  const [savedDrafts, setSavedDrafts] = useState<{ id: string; quote_number: string; products: any[]; created_at: string; grand_total: number; status?: string }[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [currentDraftStatus, setCurrentDraftStatus] = useState<string>("draft");
  const [currentQuoteNumber, setCurrentQuoteNumber] = useState<string>("");
  const [savingDraft, setSavingDraft] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);

  // Timeline toggle
  const [showTimeline, setShowTimeline] = useState(false);

  // Fetch saved drafts
  const fetchDrafts = async () => {
    if (!user) return;
    try {
      const { data } = await (supabase.from as any)("quote_requests")
        .select("id, quote_number, products, created_at, grand_total, details, status")
        .eq("user_id", user.id)
        .eq("status", "draft")
        .order("created_at", { ascending: false });
      if (data) setSavedDrafts(data);
    } catch {}
  };

  useEffect(() => { fetchDrafts(); }, [user]);

  // Auto-load draft from MyAccountQuotes navigation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (catalogLoading) return;
    if (!user) return;
    let cancelled = false;
    const tryLoadFromSession = async () => {
      let draftId: string | null = null;
      try {
        draftId = sessionStorage.getItem("ent_edit_draft_id");
      } catch { return; }
      if (!draftId) return;
      try {
        sessionStorage.removeItem("ent_edit_draft_id");
      } catch { /* silent */ }
      try {
        const { data } = await (supabase.from as any)("quote_requests")
          .select("id, quote_number, products, created_at, grand_total, details, status")
          .eq("id", draftId)
          .single();
        if (cancelled || !data) return;
        await handleLoadDraft(data);
      } catch (err) {
        console.error("auto-load draft error:", err);
      }
    };
    tryLoadFromSession();
    return () => { cancelled = true; };
  }, [catalogLoading, user]);

  // Save as draft (without sending)
  const handleSaveDraft = async () => {
    if (!user || cart.length === 0) return;
    setSavingDraft(true);
    try {
      let profileData: any = {};
      try {
        const { data } = await (supabase.from as any)("profiles").select("*").eq("id", user.id).maybeSingle();
        if (data) profileData = data;
      } catch {}

      const products = cart.map((item) => ({
        category: item.customCategory || item.product?.category || "",
        model: item.customModel || item.product?.model || "",
        qty: item.qty,
      }));

      if (currentDraftId) {
        // Update existing draft
        const { error: updateErr } = await (supabase.from as any)("quote_requests").update({
          products,
          details: generalNotes || null,
          subtotal: subtotal,
          grand_total: subtotal,
        }).eq("id", currentDraftId);
        if (updateErr) throw updateErr;

        // Update line items
        await (supabase.from as any)("quote_line_items").delete().eq("quote_id", currentDraftId);
        const lineItems = cart.map((item, i) => ({
          quote_id: currentDraftId,
          product_id: item.product?.id || null,
          model: item.customModel || item.product?.model || "",
          category: item.customCategory || item.product?.category || "",
          qty: item.qty,
          unit_price: item.unitPrice || 0,
          discount_percent: 0,
          custom_specs: item.product?.specs || {},
          admin_notes: item.notes || null,
          sort_order: i,
        }));
        const { error: liErr } = await (supabase.from as any)("quote_line_items").insert(lineItems);
        if (liErr) throw new Error(`บันทึกรายการสินค้าไม่สำเร็จ: ${liErr.message}`);

        toast({ title: "บันทึก Draft สำเร็จ", description: "ใบเสนอราคาถูกอัพเดทแล้ว" });
      } else {
        // Create new draft
        const { data: quoteData, error } = await (supabase.from as any)("quote_requests").insert({
          user_id: user.id,
          name: profileData.full_name || user.user_metadata?.full_name || "",
          email: user.email || "",
          phone: profileData.phone || null,
          company: profileData.company_name || null,
          products,
          details: generalNotes || null,
          subtotal: subtotal,
          grand_total: subtotal,
          status: "draft",
        }).select("id, quote_number").single();

        if (error) throw error;

        if (quoteData?.id) {
          setCurrentDraftId(quoteData.id);
          setCurrentQuoteNumber(quoteData.quote_number || "");
          setCurrentDraftStatus("draft");
          const lineItems = cart.map((item, i) => ({
            quote_id: quoteData.id,
            product_id: item.product?.id || null,
            model: item.customModel || item.product?.model || "",
            category: item.customCategory || item.product?.category || "",
            qty: item.qty,
            unit_price: item.unitPrice || 0,
            discount_percent: 0,
            custom_specs: item.product?.specs || {},
            admin_notes: item.notes || null,
            sort_order: i,
          }));
          const { error: liErr } = await (supabase.from as any)("quote_line_items").insert(lineItems);
          if (liErr) throw new Error(`บันทึกรายการสินค้าไม่สำเร็จ: ${liErr.message}`);
        }
        toast({ title: "บันทึก Draft สำเร็จ", description: "สามารถกลับมาแก้ไขได้ภายหลัง" });
      }
      fetchDrafts();
    } catch (err: any) {
      toast({ title: "บันทึกไม่ได้", description: err.message, variant: "destructive" });
    }
    setSavingDraft(false);
  };

  // Load a draft
  const handleLoadDraft = async (draft: typeof savedDrafts[0]) => {
    try {
      // Load line items
      const { data: lineData } = await (supabase.from as any)("quote_line_items")
        .select("*").eq("quote_id", draft.id).order("sort_order");

      if (lineData && lineData.length > 0) {
        const loaded: CartItem[] = lineData.map((li: any) => ({
          product: li.product_id ? catalog.find((c) => c.id === li.product_id) || null : null,
          customModel: li.model || "",
          customCategory: li.category || "",
          qty: li.qty || 1,
          unitPrice: li.unit_price || 0,
          notes: li.admin_notes || "",
          discountPercent: li.discount_percent || 0,
          lineTotal: li.line_total || 0,
        }));
        setCart(loaded);
      } else {
        // Fallback to products array
        const loaded: CartItem[] = (draft.products || []).map((p: any) => {
          const cat = catalog.find((c) => c.model === p.model);
          return {
            product: cat || null,
            customModel: p.model || "",
            customCategory: p.category || "",
            qty: p.qty || 1,
            unitPrice: cat?.base_price || 0,
            notes: "",
          };
        });
        setCart(loaded);
      }

      setCurrentDraftId(draft.id);
      setCurrentQuoteNumber(draft.quote_number || "");
      setCurrentDraftStatus(draft.status || "draft");
      setGeneralNotes((draft as any).details || "");
      setShowDrafts(false);
      toast({ title: `โหลด Draft สำเร็จ` });
    } catch (err: any) {
      toast({ title: "โหลดไม่ได้", description: err.message, variant: "destructive" });
    }
  };

  // Clear cart and start new
  const handleNewQuote = () => {
    setCart([]);
    setGeneralNotes("");
    setCurrentDraftId(null);
    setCurrentQuoteNumber("");
    setCurrentDraftStatus("draft");
    setShowDrafts(false);
    setShowTimeline(false);
  };

  // Delete draft
  const handleDeleteDraft = async (id: string) => {
    if (!confirm("ลบ Draft นี้?")) return;
    await (supabase.from as any)("quote_line_items").delete().eq("quote_id", id);
    await (supabase.from as any)("quote_requests").delete().eq("id", id);
    if (currentDraftId === id) { setCurrentDraftId(null); setCurrentQuoteNumber(""); setCurrentDraftStatus("draft"); setCart([]); setGeneralNotes(""); }
    fetchDrafts();
    toast({ title: "ลบ Draft แล้ว" });
  };

  // Pre-fill cart from global QuoteCart (items added from product pages)
  useEffect(() => {
    if (globalCart.items.length > 0 && cart.length === 0) {
      const prefilled: CartItem[] = globalCart.items.map((item) => ({
        product: item.catalogProductId ? {
          id: item.catalogProductId,
          model: item.model,
          name_th: item.productName,
          description: null,
          category: item.category,
          base_price: item.unitPrice,
          specs: item.specs,
          min_qty: 1,
          lead_days: 7,
        } : null,
        customModel: item.model,
        customCategory: item.category,
        qty: item.qty,
        unitPrice: item.unitPrice,
        notes: "",
      }));
      setCart(prefilled);
    }
  }, [globalCart.items]);

  // Check if first time
  useEffect(() => {
    try {
      const done = localStorage.getItem(TUTORIAL_KEY);
      if (!done) setShowTutorial(true);
    } catch { /* silent */ }
  }, []);

  const finishTutorial = () => {
    setShowTutorial(false);
    try { localStorage.setItem(TUTORIAL_KEY, "1"); } catch { /* silent */ }
  };

  // Fetch catalog — include description
  useEffect(() => {
    (async () => {
      try {
        const { data } = await (supabase.from as any)("product_catalog")
          .select("id, model, name_th, description, category, base_price, specs, min_qty, lead_days")
          .eq("is_active", true)
          .order("category")
          .order("model");
        if (data) setCatalog(data);
      } catch { /* silent */ }
      setCatalogLoading(false);
    })();
  }, []);

  const categories = [...new Set(catalog.map((p) => p.category))].sort();

  const filteredCatalog = catalog.filter((p) => {
    const matchSearch = !searchQuery ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.name_th || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Cart operations
  const addFromCatalog = (product: CatalogProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product?.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product?.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, {
        product,
        customModel: product.model,
        customCategory: product.category,
        qty: Math.max(1, product.min_qty),
        unitPrice: product.base_price,
        notes: "",
      }];
    });
    setShowCatalog(false);
    setSearchQuery("");
  };

  const addCustomItem = () => {
    setCart((prev) => [...prev, {
      product: null,
      customModel: "",
      customCategory: "",
      qty: 1,
      unitPrice: 0,
      notes: "",
    }]);
  };

  const updateCartItem = (index: number, field: keyof CartItem, value: any) => {
    setCart((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Totals
  const subtotal = cart.reduce((sum, item) => {
    // ถ้ามี lineTotal จาก DB (admin กำหนดราคาแล้ว) → ใช้ค่านั้น
    if (item.lineTotal && item.lineTotal > 0) {
      return sum + item.lineTotal;
    }
    // ถ้าไม่มี → คำนวณจาก unitPrice × qty × (1 - discount)
    const discount = (item.discountPercent || 0) / 100;
    return sum + (item.unitPrice || 0) * item.qty * (1 - discount);
  }, 0);
  const hasAnyPrice = cart.some((item) => item.unitPrice > 0);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("th-TH", { minimumFractionDigits: 0 }).format(Math.round(n));

  // Submit (send to admin)
  const handleSubmit = async () => {
    if (!user || cart.length === 0) return;
    const hasModel = cart.every((item) => item.customModel.trim());
    if (!hasModel) {
      toast({ title: "กรุณากรอกชื่อรุ่นสินค้าทุกรายการ", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    let quoteId: string | null = currentDraftId;
    try {
      let profileData: any = {};
      try {
        const { data } = await (supabase.from as any)("profiles").select("*").eq("id", user.id).maybeSingle();
        if (data) profileData = data;
      } catch { /* silent */ }

      const products = cart.map((item) => ({
        category: item.customCategory || item.product?.category || "",
        model: item.customModel || item.product?.model || "",
        qty: item.qty,
      }));

      quoteId = currentDraftId;

      if (currentDraftId) {
        // Update existing draft → change status to "new" (sent)
        const { error } = await (supabase.from as any)("quote_requests").update({
          products,
          details: generalNotes || null,
          subtotal: subtotal,
          grand_total: subtotal,
          status: "new",
          name: profileData.full_name || user.user_metadata?.full_name || "",
          email: user.email || "",
          phone: profileData.phone || null,
          company: profileData.company_name || null,
        }).eq("id", currentDraftId);
        if (error) throw error;

        // Replace line items
        await (supabase.from as any)("quote_line_items").delete().eq("quote_id", currentDraftId);
      } else {
        // Create new and send immediately
        const { data: quoteData, error } = await (supabase.from as any)("quote_requests").insert({
          user_id: user.id,
          name: profileData.full_name || user.user_metadata?.full_name || "",
          email: user.email || "",
          phone: profileData.phone || null,
          company: profileData.company_name || null,
          products,
          details: generalNotes || null,
          subtotal: subtotal,
          grand_total: subtotal,
          status: "new",
        }).select("id").single();

        if (error) throw error;
        quoteId = quoteData?.id;
      }

      // Insert line items
      if (quoteId) {
        const lineItems = cart.map((item, i) => ({
          quote_id: quoteId,
          product_id: item.product?.id || null,
          model: item.customModel || item.product?.model || "",
          category: item.customCategory || item.product?.category || "",
          qty: item.qty,
          unit_price: item.unitPrice || 0,
          discount_percent: 0,
          custom_specs: item.product?.specs || {},
          admin_notes: item.notes || null,
          sort_order: i,
        }));
        const { error: liErr } = await (supabase.from as any)("quote_line_items").insert(lineItems);
        if (liErr) throw new Error(`ส่งรายการสินค้าไม่สำเร็จ: ${liErr.message}`);
      }

      // Track
      cart.forEach((item) => {
        trackEvent({
          eventType: "quote_request",
          productId: item.customModel,
          productCategory: item.customCategory,
          metadata: { qty: item.qty, price: item.unitPrice },
        });
      });

      toast({ title: "ส่งคำขอใบเสนอราคาเรียบร้อย!", description: "ทีมขายจะตรวจสอบและอนุมัติให้" });

      // Send email notification (fire & forget)
      if (quoteId) {
        const { data: savedQuote } = await (supabase.from as any)("quote_requests")
          .select("quote_number, assigned_to").eq("id", quoteId).single();
        const saleInfo = await getSaleInfo(savedQuote?.assigned_to || null);
        notifyQuoteStatus({
          event: "new",
          quoteId: quoteId!,
          customerEmail: user.email || "",
          customerName: profileData.full_name || user.user_metadata?.full_name || "",
          quoteNumber: savedQuote?.quote_number || "",
          grandTotal: subtotal,
          products: productSummaryText(products),
          ...saleInfo,
        });
      }

      globalCart.clearCart();
      navigate("/my-account/quotes");
    } catch (err: any) {
      // Rollback: ถ้า quote ถูก update/insert ไปแล้ว แต่ line items fail
      try {
        if (currentDraftId) {
          // มี draft อยู่แล้ว — revert status กลับเป็น draft
          await (supabase.from as any)("quote_requests")
            .update({ status: "draft" })
            .eq("id", currentDraftId);
        } else if (quoteId) {
          // เพิ่งสร้างใหม่ — ลบ quote ที่สร้างค้างไว้
          await (supabase.from as any)("quote_requests")
            .delete()
            .eq("id", quoteId);
        }
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
      toast({
        title: "ส่งใบเสนอราคาไม่สำเร็จ",
        description: err.message + "\nกรุณาลองใหม่อีกครั้ง — ข้อมูลของคุณยังอยู่ในแบบร่าง",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Milestone step calculator ───
  const getMilestoneStep = (status: string): number => {
    if (status === "won") return 5;
    if (status === "lost") return 5;
    if (status === "negotiating") return 4;
    if (status === "quoted") return 3;
    if (status === "reviewing") return 2;
    if (status === "new") return 1;
    return 0; // draft
  };

  const currentMilestone = getMilestoneStep(currentDraftStatus);
  const isReadOnly = !!currentDraftId && currentDraftStatus !== "draft";

  return (
    <div className="space-y-6">
      {/* ═══ Tutorial Overlay ═══ */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => finishTutorial()}>
          <div
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const step = TUTORIAL_STEPS[tutorialStep];
              const StepIcon = step.icon;
              const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;
              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <StepIcon size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground">{step.title}</p>
                        <p className="text-xs text-muted-foreground">ขั้นตอน {tutorialStep + 1}/{TUTORIAL_STEPS.length}</p>
                      </div>
                    </div>
                    <button onClick={finishTutorial} className="text-muted-foreground hover:text-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{step.desc}</p>

                  {/* Progress dots */}
                  <div className="flex items-center justify-center gap-2 mb-5">
                    {TUTORIAL_STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === tutorialStep ? "bg-primary" : i < tutorialStep ? "bg-primary/40" : "bg-border"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {tutorialStep > 0 && (
                      <button
                        onClick={() => setTutorialStep((s) => s - 1)}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ย้อนกลับ
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (isLast) {
                          finishTutorial();
                        } else {
                          setTutorialStep((s) => s + 1);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
                    >
                      {isLast ? (
                        <><CheckCircle size={14} /> เริ่มใช้งาน</>
                      ) : (
                        <>ถัดไป <ChevronRight size={14} /></>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={finishTutorial}
                    className="w-full mt-3 text-center text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                  >
                    ข้ามทั้งหมด
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FileText size={20} className="text-primary" /> สร้างใบเสนอราคา
          {currentQuoteNumber && (
            <span className="text-sm font-normal text-muted-foreground ml-1">({currentQuoteNumber})</span>
          )}
        </h2>
        <button
          onClick={() => { setShowTutorial(true); setTutorialStep(0); }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <HelpCircle size={14} /> วิธีใช้งาน
        </button>
      </div>

      {/* ═══ Milestone Timeline (shown when editing existing quote) ═══ */}
      {currentDraftId && currentDraftStatus !== "draft" && (
        <div className="card-surface rounded-xl p-4 animate-fade-in">
          {/* Milestone Steps Bar */}
          <div className="flex items-center justify-between mb-4">
            {MILESTONE_STEPS.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = i <= currentMilestone;
              const isCurrent = i === currentMilestone;
              const isLost = currentDraftStatus === "lost" && i === MILESTONE_STEPS.length - 1;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isLost ? "bg-red-500/10 text-red-500 border-2 border-red-500/30" :
                      isCurrent ? "bg-primary/10 text-primary border-2 border-primary/30 ring-4 ring-primary/10" :
                      isActive ? "bg-primary text-primary-foreground" :
                      "bg-secondary text-muted-foreground/40 border border-border"
                    }`}>
                      <StepIcon size={14} />
                    </div>
                    <span className={`text-[10px] font-medium whitespace-nowrap ${
                      isLost ? "text-red-500" :
                      isCurrent ? "text-primary font-bold" :
                      isActive ? "text-foreground" :
                      "text-muted-foreground/40"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {i < MILESTONE_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mt-[-16px] rounded-full transition-all ${
                      i < currentMilestone ? "bg-primary" : "bg-border"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[currentDraftStatus]?.color || "bg-gray-400"}`} />
              <span className="text-xs font-medium text-foreground">
                สถานะ: {STATUS_CONFIG[currentDraftStatus]?.label || currentDraftStatus}
              </span>
            </div>
            {/* Toggle timeline conversation */}
            {currentDraftStatus !== "draft" && (
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
              >
                <MessageSquare size={13} />
                {showTimeline ? "ซ่อนสนทนา" : "ดูสนทนา / ต่อรอง"}
                <ChevronDown size={12} className={`transition-transform ${showTimeline ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>

          {/* Timeline Conversation (collapsible) */}
          {showTimeline && currentDraftId && user && (
            <div className="mt-4 border-t border-border pt-4">
              <QuoteTimeline
                quoteId={currentDraftId}
                quoteNumber={currentQuoteNumber || "Draft"}
                currentUserId={user.id}
                isAdmin={false}
                onQuoteUpdated={() => {
                  // Refresh status
                  (async () => {
                    try {
                      const { data } = await (supabase.from as any)("quote_requests")
                        .select("status").eq("id", currentDraftId).single();
                      if (data) setCurrentDraftStatus(data.status);
                    } catch {}
                  })();
                }}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* ═══ Left: Product selection ═══ */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Search */}
          <div id="search-area" className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowCatalog(true); }}
                onFocus={() => setShowCatalog(true)}
                className={`${inputClass} pl-9`}
                placeholder="พิมพ์ชื่อรุ่น เช่น GT9000, GK1506..."
                disabled={isReadOnly}
              />
            </div>
            <button
              onClick={() => setShowCatalog(!showCatalog)}
              disabled={isReadOnly}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              <Package size={14} /> เรียกดูทั้งหมด
            </button>
          </div>

          {/* Catalog dropdown */}
          {showCatalog && (
            <div className="card-surface rounded-xl max-h-72 overflow-y-auto animate-fade-in">
              <div className="flex gap-1 p-3 border-b border-border overflow-x-auto">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                    categoryFilter === "all" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/60"
                  }`}
                >
                  ทั้งหมด
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                      categoryFilter === c ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {catalogLoading ? (
                <div className="p-6 text-center"><Loader2 size={16} className="animate-spin text-muted-foreground mx-auto" /></div>
              ) : filteredCatalog.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  {catalog.length === 0 ? "ยังไม่มีสินค้าในระบบ — คุณสามารถเพิ่มรายการเองได้" : "ไม่พบสินค้าที่ค้นหา"}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredCatalog.map((product) => {
                    const inCart = cart.some((item) => item.product?.id === product.id);
                    return (
                      <button
                        key={product.id}
                        onClick={() => addFromCatalog(product)}
                        disabled={inCart}
                        className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                          inCart ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary/30"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                          <Package size={14} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-bold text-foreground">{product.model}</span>
                          <span className="text-xs text-muted-foreground ml-2">{product.category}</span>
                          {product.name_th && (
                            <p className="text-xs text-muted-foreground truncate">{product.name_th}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-foreground">฿{formatPrice(product.base_price)}</span>
                        </div>
                        {inCart ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">เพิ่มแล้ว</span>
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

          {/* ═══ Cart Table ═══ */}
          <div id="cart-area" className="card-surface rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShoppingCart size={14} className="text-primary" /> รายการสินค้า ({cart.length})
              </h3>
              {!isReadOnly && (
                <button
                  onClick={addCustomItem}
                  className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                >
                  <Plus size={14} /> เพิ่มรายการเอง
                </button>
              )}
            </div>

            {isReadOnly && (
              <div className="mb-3 px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                <FileText size={14} className="shrink-0 mt-0.5" />
                <span>
                  ใบเสนอราคานี้ส่งให้ทีมขายแล้ว — อยู่ในโหมดอ่านอย่างเดียว
                  ไม่สามารถแก้ไขรายการได้ หากต้องการเปลี่ยนแปลง กรุณาติดต่อทีมขายผ่านช่องทาง "สนทนา / ต่อรอง"
                </span>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart size={32} className="mx-auto mb-3 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">ยังไม่มีสินค้า</p>
                <p className="text-xs text-muted-foreground/60 mt-1">ค้นหาจากรายการด้านบน หรือกด "เพิ่มรายการเอง" เพื่อกรอกเอง</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border bg-secondary/5">
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-muted-foreground w-5 pt-2 shrink-0">{i + 1}.</span>
                      <div className="flex-1 space-y-2">
                        {/* Row 1: Model + Category */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">รุ่น / Model *</label>
                            <input
                              value={item.customModel}
                              onChange={(e) => updateCartItem(i, "customModel", e.target.value)}
                              className={inputClass}
                              placeholder="เช่น GT9000"
                              disabled={isReadOnly}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">หมวดหมู่</label>
                            <input
                              value={item.customCategory}
                              onChange={(e) => updateCartItem(i, "customCategory", e.target.value)}
                              className={inputClass}
                              placeholder="เช่น GT Series — Mini PC"
                              disabled={isReadOnly}
                            />
                          </div>
                        </div>

                        {/* ═══ Product Description (read-only, from DB) ═══ */}
                        {item.product?.description && (
                          <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                            <div className="flex items-start gap-1.5">
                              <Info size={12} className="text-blue-500 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-medium text-blue-600 mb-0.5">รายละเอียดสินค้า</p>
                                <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
                                  {item.product.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Specs hint from catalog (shown when no full description) */}
                        {!item.product?.description && item.product?.specs?.cpu && (
                          <p className="text-xs text-muted-foreground/60">
                            {item.product.specs.cpu}
                            {item.product.specs.ram && ` / ${item.product.specs.ram}`}
                            {item.product.specs.storage && ` / ${item.product.specs.storage}`}
                          </p>
                        )}

                        {/* Row 2: Qty + Price */}
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">จำนวน</label>
                            <div className="flex items-center border border-border rounded-lg">
                              <button
                                onClick={() => updateCartItem(i, "qty", Math.max(1, item.qty - 1))}
                                disabled={isReadOnly}
                                className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-l-lg disabled:opacity-50"
                              >
                                <Minus size={12} />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(e) => updateCartItem(i, "qty", Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full text-center text-sm font-bold bg-transparent border-none focus:outline-none"
                                disabled={isReadOnly}
                              />
                              <button
                                onClick={() => updateCartItem(i, "qty", item.qty + 1)}
                                disabled={isReadOnly}
                                className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-r-lg disabled:opacity-50"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">ราคา/หน่วย (ว่างได้)</label>
                            <input
                              type="number"
                              value={item.unitPrice || ""}
                              onChange={(e) => updateCartItem(i, "unitPrice", parseFloat(e.target.value) || 0)}
                              className={inputClass}
                              placeholder="ทีมขายจะกำหนดให้"
                              disabled={isReadOnly}
                            />
                          </div>
                          <div className="flex items-end">
                            <div className="flex-1">
                              <label className="text-xs text-muted-foreground">รวม</label>
                              <p className="text-sm font-bold text-primary py-2.5">
                                {item.unitPrice > 0 ? `฿${formatPrice(item.unitPrice * item.qty)}` : "รอราคา"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Specs badges (when description is shown, show specs separately) */}
                        {item.product?.description && item.product?.specs?.cpu && (
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(item.product.specs).slice(0, 4).map(([key, val]) => (
                              <span key={key} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                                {val}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeCartItem(i)}
                        disabled={isReadOnly}
                        className="text-muted-foreground/30 hover:text-destructive transition-colors pt-2 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══ Right: Summary ═══ */}
        <div id="summary-area" className="lg:w-64 shrink-0">
          <div className="card-surface rounded-xl p-4 sticky top-4">
            <h3 className="text-sm font-bold text-foreground mb-3">สรุปใบเสนอราคา</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">รายการ</span>
                <span className="text-foreground">{cart.length} รายการ, {cart.reduce((s, i) => s + i.qty, 0)} ชิ้น</span>
              </div>
              {hasAnyPrice && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">รวมเบื้องต้น</span>
                    <span className="text-foreground">฿{formatPrice(subtotal)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-bold">ยอดรวม</span>
                    <span className="text-primary font-bold text-base">฿{formatPrice(subtotal)}</span>
                  </div>
                </>
              )}
              {!hasAnyPrice && cart.length > 0 && (
                <div className="py-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 text-center">
                  ราคาจะถูกกำหนดโดยทีมขาย
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-xs text-muted-foreground mb-1.5">หมายเหตุ / ความต้องการเพิ่มเติม</label>
              <textarea
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="เช่น ต้องการ RAM เพิ่ม, OS พิเศษ, ส่วนลดกรณีซื้อจำนวนมาก..."
                disabled={isReadOnly}
              />
            </div>

            <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs text-primary font-medium mb-1">ราคาไม่แน่ใจ?</p>
              <p className="text-xs text-muted-foreground">ไม่จำเป็นต้องกรอกราคา — เว้นว่างได้ ทีมขายจะตรวจสอบและกำหนดราคาที่เหมาะสมให้</p>
            </div>

            {/* Draft info */}
            {currentDraftId && (
              <div className="mt-3 p-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-xs text-yellow-700 flex items-center gap-2">
                <FileText size={13} />
                <span>กำลังแก้ไข {currentDraftStatus === "draft" ? "Draft" : currentQuoteNumber || "ใบเสนอราคา"}</span>
              </div>
            )}

            {/* Save Draft Button — only for draft status */}
            {(!currentDraftId || currentDraftStatus === "draft") && (
              <button
                onClick={handleSaveDraft}
                disabled={cart.length === 0 || savingDraft}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
              >
                {savingDraft ? (
                  <><Loader2 size={14} className="animate-spin" /> กำลังบันทึก...</>
                ) : (
                  <><Save size={14} /> บันทึก Draft</>
                )}
              </button>
            )}

            {/* Send Button — only for draft or new */}
            {(!currentDraftId || currentDraftStatus === "draft") && (
              <button
                onClick={() => setConfirmSubmitOpen(true)}
                disabled={cart.length === 0 || submitting}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <><Loader2 size={14} className="animate-spin" /> กำลังส่ง...</>
                ) : (
                  <><Send size={14} /> ส่งให้ Admin ตรวจสอบ</>
                )}
              </button>
            )}
            {(!currentDraftId || currentDraftStatus === "draft") && (
              <p className="text-xs text-muted-foreground/50 text-center mt-2">
                ทีมขายจะตรวจสอบและอนุมัติภายใน 2 ชม.
              </p>
            )}

            {/* Drafts section */}
            {savedDrafts.length > 0 && (
              <div className="mt-4 border-t border-border pt-3">
                <button onClick={() => setShowDrafts(!showDrafts)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full">
                  <FolderOpen size={13} /> Draft ที่บันทึก ({savedDrafts.length})
                  <ChevronDown size={12} className={`ml-auto transition-transform ${showDrafts ? "rotate-180" : ""}`} />
                </button>
                {showDrafts && (
                  <div className="mt-2 space-y-1.5">
                    {savedDrafts.map((d) => (
                      <div key={d.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                        <button onClick={() => handleLoadDraft(d)} className="flex-1 text-left text-xs">
                          <span className="font-medium text-foreground">{d.quote_number || "Draft"}</span>
                          <span className="text-muted-foreground ml-1.5">{(d.products || []).length} รายการ</span>
                          {d.grand_total > 0 && <span className="text-primary ml-1.5">฿{formatPrice(d.grand_total)}</span>}
                        </button>
                        <button onClick={() => handleDeleteDraft(d.id)} className="p-1 rounded hover:bg-red-500/10 text-muted-foreground/40 hover:text-red-500">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* New Quote Button */}
            <button onClick={handleNewQuote}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
              <FilePlus size={13} /> สร้างใบเสนอราคาใหม่
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Submit AlertDialog */}
      <AlertDialog open={confirmSubmitOpen} onOpenChange={setConfirmSubmitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันส่งใบเสนอราคา?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>ใบเสนอราคานี้จะถูกส่งให้ทีมขายตรวจสอบ</p>
                <p className="mt-2 font-medium text-foreground">
                  จำนวน {cart.length} รายการ
                  {subtotal > 0 && (
                    <> · ยอดรวมเบื้องต้น ฿{formatPrice(subtotal)}</>
                  )}
                </p>
                <p className="mt-1 text-xs">ทีมขายจะตรวจสอบและอนุมัติให้ภายใน 2 ชั่วโมง</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (e) => {
                e.preventDefault();
                setConfirmSubmitOpen(false);
                await handleSubmit();
              }}
              disabled={submitting}
            >
              {submitting ? "กำลังส่ง..." : "ยืนยันส่ง"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserQuoteCreate;
