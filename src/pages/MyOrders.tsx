import { useState, useEffect } from "react";
import {
  Package, Truck, CheckCircle, Clock, MapPin, Loader2, RefreshCw,
  FileText, ChevronUp, ExternalLink, Copy, Box, XCircle,
  CreditCard, Download,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import DocumentCrossReference from "@/components/admin/DocumentCrossReference";

/* ─── Types ─── */
interface SalesOrder {
  id: string;
  order_number: string;
  quote_id: string;
  customer_name: string;
  customer_company: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  po_number: string | null;
  po_file_url: string | null;
  subtotal: number;
  discount_amount: number;
  grand_total: number;
  payment_terms: string | null;
  delivery_terms: string | null;
  warranty_terms: string | null;
  status: string;
  tracking_number: string | null;
  shipping_provider: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  admin_notes: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  model: string;
  name_th: string | null;
  description: string | null;
  category: string | null;
  qty: number;
  unit_label: string | null;
  unit_price: number;
  discount_percent: number;
  line_total: number;
  warranty_terms: string | null;
}

/* ─── Constants ─── */
const STATUS_CFG: Record<string, { label: string; color: string; icon: any; desc: string }> = {
  confirmed: { label: "ยืนยันแล้ว", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: CheckCircle, desc: "คำสั่งซื้อได้รับการยืนยัน กำลังเตรียมสินค้า" },
  processing: { label: "กำลังจัดเตรียม", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Package, desc: "ทีมงานกำลังจัดเตรียมสินค้าให้ท่าน" },
  shipped: { label: "จัดส่งแล้ว", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", icon: Truck, desc: "สินค้าถูกจัดส่งแล้ว รอรับสินค้า" },
  delivered: { label: "ส่งมอบแล้ว", color: "bg-teal-500/10 text-teal-600 border-teal-500/20", icon: MapPin, desc: "สินค้าถูกส่งมอบเรียบร้อย" },
  completed: { label: "เสร็จสมบูรณ์", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle, desc: "คำสั่งซื้อเสร็จสมบูรณ์" },
  cancelled: { label: "ยกเลิก", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle, desc: "คำสั่งซื้อถูกยกเลิก" },
};

const PIPELINE = ["confirmed", "processing", "shipped", "delivered", "completed"];

const MyOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await (supabase.from as any)("sales_orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setOrders(data);
    } catch {
      // silent — no toast
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (orderId: string) => {
    if (orderItems[orderId]) return;
    try {
      const { data } = await (supabase.from as any)("sales_order_items")
        .select("*").eq("order_id", orderId).order("sort_order");
      if (data) setOrderItems((prev) => ({ ...prev, [orderId]: data }));
    } catch {}
  };

  useEffect(() => { fetchOrders(); }, [user]);


  const handleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      fetchItems(id);
    }
  };

  const fp = (n: number) => new Intl.NumberFormat("th-TH").format(Math.round(n));
  const fpd = (n: number) => new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2 }).format(n);
  const fd = (d: string) => new Date(d).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });
  const fdt = (d: string) => new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const activeOrders = orders.filter((o) => !["completed", "cancelled"].includes(o.status));
  const pastOrders = orders.filter((o) => ["completed", "cancelled"].includes(o.status));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Package size={20} className="text-primary" /> คำสั่งซื้อของฉัน
        </h2>
        <button onClick={fetchOrders} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> รีเฟรช
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
      ) : orders.length === 0 ? (
        <div className="card-surface rounded-xl p-12 text-center">
          <Box size={40} className="mx-auto mb-3 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">ยังไม่มีคำสั่งซื้อ</p>
          <p className="text-xs text-muted-foreground/60 mt-1">เมื่อ PO ได้รับการอนุมัติ คำสั่งซื้อจะปรากฏที่นี่</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Clock size={14} className="text-primary" /> กำลังดำเนินการ ({activeOrders.length})
              </h3>
              <div className="space-y-3">
                {activeOrders.map((order) => renderOrderCard(order))}
              </div>
            </div>
          )}

          {/* Past Orders */}
          {pastOrders.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" /> เสร็จสิ้น ({pastOrders.length})
              </h3>
              <div className="space-y-3">
                {pastOrders.map((order) => renderOrderCard(order))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  function renderOrderCard(order: SalesOrder) {
    const st = STATUS_CFG[order.status] || STATUS_CFG.confirmed;
    const StIcon = st.icon;
    const isExpanded = expandedId === order.id;
    const items = orderItems[order.id] || [];
    const currentIdx = PIPELINE.indexOf(order.status);

    return (
      <div key={order.id} className="card-surface rounded-xl overflow-hidden">
        {/* Order Header — click to expand */}
        <button onClick={() => handleExpand(order.id)} className="w-full text-left p-4 hover:bg-secondary/20 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-base font-bold text-foreground">{order.order_number}</span>
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${st.color}`}>
                  <StIcon size={12} /> {st.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{st.desc}</p>

              {/* Mini Pipeline */}
              <div className="flex items-center gap-1 mt-3">
                {PIPELINE.map((s, i) => {
                  const isActive = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  const cfg = STATUS_CFG[s];
                  const Icon = cfg.icon;
                  return (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isCurrent ? "bg-primary/10 text-primary ring-2 ring-primary/20" :
                        isActive ? "bg-primary text-primary-foreground" :
                        "bg-secondary text-muted-foreground/30"
                      }`} title={cfg.label}>
                        <Icon size={10} />
                      </div>
                      {i < PIPELINE.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-0.5 rounded ${i < currentIdx ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-primary">฿{fp(order.grand_total)}</p>
              <p className="text-[11px] text-muted-foreground">{fd(order.created_at)}</p>
              {order.po_number && <p className="text-[10px] text-muted-foreground">PO: {order.po_number}</p>}
            </div>
          </div>
        </button>

        {/* Expanded Detail */}
        {isExpanded && (
          <div className="border-t border-border p-4 bg-secondary/5 animate-fade-in space-y-4">
            {/* Tracking Info */}
            {order.status === "shipped" && order.tracking_number && (
              <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                <h4 className="text-xs font-bold text-indigo-500 mb-2 flex items-center gap-1.5">
                  <Truck size={13} /> ข้อมูลจัดส่ง
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {order.shipping_provider && (
                    <div><span className="text-xs text-muted-foreground">ผู้ให้บริการ:</span> <span className="font-medium">{order.shipping_provider}</span></div>
                  )}
                  <div>
                    <span className="text-xs text-muted-foreground">เลข Tracking:</span>{" "}
                    <span className="font-medium font-mono">{order.tracking_number}</span>
                    <button onClick={() => { navigator.clipboard.writeText(order.tracking_number || ""); toast({ title: "คัดลอก Tracking แล้ว" }); }}
                      className="ml-1.5 text-primary hover:underline"><Copy size={11} /></button>
                  </div>
                  {order.shipped_at && <div><span className="text-xs text-muted-foreground">จัดส่งเมื่อ:</span> <span className="font-medium">{fdt(order.shipped_at)}</span></div>}
                </div>
              </div>
            )}

            {/* Delivery confirmation */}
            {order.delivered_at && (
              <div className="p-3 rounded-lg bg-teal-500/5 border border-teal-500/15 text-xs text-teal-700 flex items-center gap-2">
                <MapPin size={13} /> ส่งมอบเมื่อ {fdt(order.delivered_at)}
              </div>
            )}

            {/* Completed */}
            {order.completed_at && (
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/15 text-xs text-green-700 flex items-center gap-2">
                <CheckCircle size={13} /> เสร็จสมบูรณ์เมื่อ {fdt(order.completed_at)}
              </div>
            )}

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {order.payment_terms && (
                <div className="p-2 rounded-lg bg-secondary/30">
                  <span className="text-muted-foreground block"><CreditCard size={11} className="inline mr-1" />เงื่อนไขชำระ</span>
                  <span className="font-medium text-foreground">{order.payment_terms}</span>
                </div>
              )}
              {order.delivery_terms && (
                <div className="p-2 rounded-lg bg-secondary/30">
                  <span className="text-muted-foreground block"><Truck size={11} className="inline mr-1" />เงื่อนไขจัดส่ง</span>
                  <span className="font-medium text-foreground">{order.delivery_terms}</span>
                </div>
              )}
            </div>

            {/* PO reference */}
            {order.po_file_url && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/20 text-xs">
                <FileText size={13} className="text-teal-500" />
                <span className="text-muted-foreground">PO: {order.po_number || "—"}</span>
                <a href={order.po_file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 ml-auto">
                  <ExternalLink size={11} /> ดูไฟล์ PO
                </a>
              </div>
            )}

            {/* Document Cross Reference */}
            <DocumentCrossReference
              currentDoc={{ type: 'so', number: order.order_number, id: order.id }}
              relatedDocs={[
                ...(order.quote_id ? [{ type: 'quote' as const, number: `Quote`, id: order.quote_id }] : []),
                ...(order.po_number ? [{ type: 'po' as const, number: order.po_number, id: order.id }] : []),
                { type: 'so' as const, number: order.order_number, id: order.id },
              ]}
            />
            {/* Line Items */}
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">รายการสินค้า</h4>
              {items.length === 0 ? (
                <div className="py-3 text-center"><Loader2 size={14} className="animate-spin text-muted-foreground mx-auto" /></div>
              ) : (
                <div className="space-y-1.5">
                  {items.map((item, i) => (
                    <div key={item.id} className="p-2.5 rounded-lg border border-border bg-background flex items-start gap-2">
                      <span className="text-xs text-muted-foreground font-bold w-4 pt-0.5">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-bold text-foreground">{item.model}</span>
                        {item.category && <span className="text-[10px] ml-1.5 px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{item.category}</span>}
                        {item.name_th && <p className="text-xs text-muted-foreground mt-0.5">{item.name_th}</p>}
                        {item.description && <p className="text-[10px] text-muted-foreground/70 mt-0.5 line-clamp-2">{item.description}</p>}
                        {item.warranty_terms && <p className="text-[10px] text-green-600 mt-0.5">ประกัน: {item.warranty_terms}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs text-muted-foreground">{item.qty} {item.unit_label || "เครื่อง"}</span>
                        <p className="text-sm font-bold text-primary">฿{fp(item.line_total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-border pt-3 max-w-xs ml-auto">
              <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">รวม</span><span>฿{fpd(order.subtotal)}</span></div>
              {order.discount_amount > 0 && <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">ส่วนลด</span><span className="text-red-400">-฿{fpd(order.discount_amount)}</span></div>}
              <div className="flex justify-between text-base font-bold pt-1 border-t border-border"><span>ยอดรวม</span><span className="text-primary">฿{fpd(order.grand_total)}</span></div>
            </div>

            {/* Close */}
            <div className="flex items-center justify-center">
              <button onClick={() => setExpandedId(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto">
                <ChevronUp size={12} /> ปิด
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default MyOrders;
