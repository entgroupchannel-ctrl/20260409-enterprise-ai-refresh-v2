import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, ChevronRight, X, Plus } from "lucide-react";
import { useQuoteCart } from "@/hooks/useQuoteCart";

const FloatingQuoteBar = () => {
  const { items, totalItems, clearCart } = useQuoteCart();
  const location = useLocation();

  // Hide on my-account and admin pages
  const hiddenPaths = ["/my-account", "/admin", "/quote-builder"];
  const shouldHide = hiddenPaths.some((p) => location.pathname.startsWith(p));

  if (items.length === 0 || shouldHide) return null;

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("th-TH", { minimumFractionDigits: 0 }).format(Math.round(n));

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const modelNames = items.map((i) => i.model).join(", ");

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 max-w-lg w-[calc(100%-2rem)]">
      <div className="bg-primary text-primary-foreground rounded-2xl shadow-2xl px-5 py-3">
        {/* Main row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
              <ShoppingCart size={16} />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm">{items.length} รุ่น ({totalItems} ชิ้น)</span>
              {subtotal > 0 && (
                <span className="text-sm opacity-80 ml-1.5">฿{formatPrice(subtotal)}</span>
              )}
              <p className="text-[11px] opacity-60 truncate">{modelNames}</p>
            </div>
          </div>

          <Link
            to="/my-account"
            onClick={() => {
              try { sessionStorage.setItem("ent_myaccount_tab", "quote_create"); } catch {}
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-foreground text-primary text-sm font-bold hover:opacity-90 transition-opacity shrink-0"
          >
            สร้างใบเสนอราคา <ChevronRight size={14} />
          </Link>

          <button
            onClick={clearCart}
            className="p-1.5 hover:bg-primary-foreground/20 rounded-full transition-colors shrink-0"
            title="ล้างรายการ"
          >
            <X size={14} />
          </button>
        </div>

        {/* Hint text */}
        <p className="text-[11px] opacity-50 text-center mt-1.5">
          <Plus size={10} className="inline mr-0.5" />
          เลือกสินค้ารุ่นอื่นเพิ่มได้ แล้วค่อยกดสร้างใบเสนอราคารวมทีเดียว
        </p>
      </div>
    </div>
  );
};

export default FloatingQuoteBar;
