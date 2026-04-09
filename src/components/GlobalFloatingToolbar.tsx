import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useQuoteCart } from "@/hooks/useQuoteCart";

const GlobalFloatingToolbar = () => {
  const { items, totalItems } = useQuoteCart();
  const location = useLocation();

  // Hide on admin pages
  const hiddenPaths = ["/admin"];
  const shouldHide = hiddenPaths.some((p) => location.pathname.startsWith(p));
  if (shouldHide) return null;

  // Only show if cart has items
  if (items.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col gap-2">
      {/* Quote Cart Button */}
      <Link
        to="/my-account"
        onClick={() => {
          try { sessionStorage.setItem("ent_myaccount_tab", "quote_create"); } catch {}
        }}
        className="group relative w-10 h-10 rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        aria-label="ตะกร้าใบเสนอราคา"
        title="ตะกร้าใบเสนอราคา"
      >
        <ShoppingCart size={18} />
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none px-1">
          {totalItems}
        </span>
        <span className="absolute right-full mr-2 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-md border border-border">
          ตะกร้า ({totalItems})
        </span>
      </Link>
    </div>
  );
};

export default GlobalFloatingToolbar;
