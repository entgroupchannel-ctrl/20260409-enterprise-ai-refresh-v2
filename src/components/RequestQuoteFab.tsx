import { useLocation, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Floating "ขอใบเสนอราคา" CTA — collapsed circle that expands to pill on hover.
 * Auto-hides on admin / cart / auth / request-quote routes.
 * Pre-fills product slug from current pathname when on a series/product page.
 */
const HIDDEN_PREFIXES = [
  "/admin", "/dashboard", "/profile", "/cart", "/login", "/register",
  "/forgot-password", "/reset-password", "/accept-invite",
  "/request-quote", "/my-", "/my/", "/notifications",
  "/affiliate/dashboard", "/affiliate/apply", "/payment", "/checkout",
];

const RequestQuoteFab = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const handleClick = () => {
    // Pre-fill source: pass current path as referrer hint
    const params = new URLSearchParams();
    const seg = pathname.replace(/^\//, "").split("/")[0];
    if (seg && seg !== "shop") params.set("from", seg);
    navigate(`/request-quote${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title="ขอใบเสนอราคา"
      className={cn(
        "fixed z-40",
        "bottom-24 right-6 md:bottom-28",
        "flex items-center justify-center w-12 h-12",
        "rounded-full bg-primary text-primary-foreground shadow-xl",
        "hover:shadow-2xl hover:scale-105 transition-all duration-300",
        "ring-2 ring-primary/20 hover:ring-primary/40",
      )}
      aria-label="ขอใบเสนอราคา"
    >
      <FileText size={20} />
    </button>
  );
};

export default RequestQuoteFab;
