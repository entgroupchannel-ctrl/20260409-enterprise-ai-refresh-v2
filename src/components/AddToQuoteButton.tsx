import { useState } from "react";
import { FileText, Check, ShoppingCart, Loader2, Plus } from "lucide-react";
import { useQuoteCart } from "@/hooks/useQuoteCart";
import { useToast } from "@/hooks/use-toast";

interface AddToQuoteButtonProps {
  model: string;
  category: string;
  productName: string;
  qty?: number;
  variant?: "primary" | "outline" | "compact";
  className?: string;
}

const AddToQuoteButton = ({
  model,
  category,
  productName,
  qty = 1,
  variant = "primary",
  className = "",
}: AddToQuoteButtonProps) => {
  const { addProduct, items } = useQuoteCart();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const isInCart = items.some((item) => item.model.toLowerCase() === model.toLowerCase());
  const cartCount = items.length;

  const handleAdd = async () => {
    if (isInCart) {
      toast({
        title: `${model} อยู่ในรายการแล้ว (${cartCount} รุ่น)`,
        description: "เลือกสินค้ารุ่นอื่นเพิ่มได้ หรือกดแถบด้านล่างเพื่อสร้างใบเสนอราคา",
      });
      return;
    }
    setAdding(true);
    try {
      await addProduct(model, category, productName, qty);
      setAdded(true);
      toast({
        title: `เพิ่ม ${model} แล้ว`,
        description: `รวม ${cartCount + 1} รุ่นในรายการ — เลือกรุ่นอื่นเพิ่มได้อีก หรือกดแถบด้านล่างเพื่อสร้างใบเสนอราคารวม`,
      });
      setTimeout(() => setAdded(false), 3000);
    } catch {
      toast({ title: "เกิดข้อผิดพลาด", variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  // ── Label logic ──
  const getLabel = () => {
    if (adding) return "กำลังเพิ่ม...";
    if (added) return "เพิ่มแล้ว! เลือกรุ่นอื่นเพิ่มได้";
    if (isInCart) return `อยู่ในรายการแล้ว (${cartCount} รุ่น)`;
    return cartCount > 0 ? `เพิ่มลงใบเสนอราคา (+${cartCount} รุ่น)` : "ขอใบเสนอราคา";
  };

  const getIcon = () => {
    if (adding) return <Loader2 size={16} className="animate-spin" />;
    if (added) return <Check size={16} className="text-green-400" />;
    if (isInCart) return <Check size={16} />;
    return cartCount > 0 ? <Plus size={16} /> : <FileText size={16} />;
  };

  const getIconSm = () => {
    if (adding) return <Loader2 size={14} className="animate-spin" />;
    if (added) return <Check size={14} className="text-green-500" />;
    if (isInCart) return <Check size={14} className="text-green-500" />;
    return cartCount > 0 ? <Plus size={14} /> : <ShoppingCart size={14} />;
  };

  const getLabelCompact = () => {
    if (adding) return "กำลังเพิ่ม...";
    if (added) return "เพิ่มแล้ว!";
    if (isInCart) return "อยู่ในรายการแล้ว";
    return cartCount > 0 ? "เพิ่มลงรายการ" : "เพิ่มลงใบเสนอราคา";
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleAdd}
        disabled={adding}
        className={`flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors ${className}`}
      >
        {getIconSm()}
        {getLabelCompact()}
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        onClick={handleAdd}
        disabled={adding}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-primary/30 text-sm font-bold text-primary hover:bg-primary/5 transition-colors disabled:opacity-60 ${className}`}
      >
        {getIconSm()}
        {getLabelCompact()}
      </button>
    );
  }

  // Primary (default)
  return (
    <button
      onClick={handleAdd}
      disabled={adding}
      className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-colors disabled:opacity-60 flex-1 ${
        added
          ? "bg-green-500 text-white"
          : isInCart
          ? "bg-secondary text-foreground border border-border"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      } ${className}`}
    >
      {getIcon()}
      {getLabel()}
    </button>
  );
};

export default AddToQuoteButton;
