import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

interface QuoteButtonProps {
  productName: string;
  productCategory?: string;
  className?: string;
  variant?: "default" | "compact";
}

const QuoteButton = ({ productName, productCategory, className = "", variant = "default" }: QuoteButtonProps) => {
  const params = new URLSearchParams({ product: productName });
  if (productCategory) params.set("category", productCategory);

  if (variant === "compact") {
    return (
      <Link
        to={`/quote?${params.toString()}`}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors ${className}`}
      >
        <FileText size={12} />
        ขอใบเสนอราคา
      </Link>
    );
  }

  return (
    <Link
      to={`/quote?${params.toString()}`}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors ${className}`}
    >
      <FileText size={16} />
      ขอใบเสนอราคา
    </Link>
  );
};

export default QuoteButton;
