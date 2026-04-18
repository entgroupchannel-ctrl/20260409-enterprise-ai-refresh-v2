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
      className={cn(
        "group fixed z-40",
        "bottom-24 right-6 md:bottom-28",
        "flex items-center gap-2 h-12 pl-3.5 pr-3.5",
        "rounded-full bg-primary text-primary-foreground shadow-xl",
        "hover:pr-5 hover:shadow-2xl transition-all duration-300",
        "ring-2 ring-primary/20 hover:ring-primary/40",
      )}
      aria-label="ขอใบเสนอราคา"
    >
      <FileText size={20} className="shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 group-hover:max-w-[180px] group-hover:opacity-100 transition-all duration-300">
        ขอใบเสนอราคา
      </span>
    </button>
  );
};

export default RequestQuoteFab;
