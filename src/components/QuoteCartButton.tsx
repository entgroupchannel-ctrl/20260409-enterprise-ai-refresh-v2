import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useQuoteCart } from "@/hooks/useQuoteCart";

const QuoteCartButton = () => {
  const { items, totalItems } = useQuoteCart();

  if (items.length === 0) return null;

  return (
    <Link
      to="/my-account"
      onClick={() => {
        try { sessionStorage.setItem("ent_myaccount_tab", "quote_create"); } catch {}
      }}
      className="relative p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
      aria-label="ตะกร้าใบเสนอราคา"
      title="ตะกร้าใบเสนอราคา"
    >
      <ShoppingCart size={18} />
      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none px-1">
        {totalItems}
      </span>
    </Link>
  );
};

export default QuoteCartButton;
