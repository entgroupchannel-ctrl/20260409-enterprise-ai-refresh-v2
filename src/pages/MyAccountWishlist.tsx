import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, FileText, ExternalLink, Share2, Link2, Check } from "lucide-react";
import { useWishlist, WishlistItem } from "@/hooks/useWishlist";
import { toast } from "sonner";
import QuoteDialog from "@/components/QuoteDialog";

const MyAccountWishlist = () => {
  const { items, remove, clear } = useWishlist();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareData = encodeURIComponent(JSON.stringify(items));
    const shareUrl = `${window.location.origin}/wishlist?items=${shareData}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("คัดลอกลิงก์ Wishlist แล้ว");
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Heart size={20} className="text-primary" /> รายการถูกใจ
          {items.length > 0 && (
            <span className="text-xs text-muted-foreground font-normal">({items.length} รายการ)</span>
          )}
        </h2>
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Share2 size={12} />}
              {copied ? "คัดลอกแล้ว" : "แชร์"}
            </button>
            <button
              onClick={() => setQuoteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
            >
              <FileText size={12} /> ขอราคาทั้งหมด
            </button>
          </div>
        )}
      </div>

      <div className="card-surface rounded-xl p-5">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={32} className="mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">ยังไม่มีรายการถูกใจ</p>
            <Link to="/" className="text-xs text-primary hover:underline mt-2 inline-block">ดูสินค้า →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/20 transition-colors">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-contain bg-secondary/30 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <Link to={item.href} className="text-xs font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-[10px] text-muted-foreground">{item.category}</p>
                  {item.specs && <p className="text-[10px] text-muted-foreground/60 line-clamp-1">{item.specs}</p>}
                </div>
                <Link to={item.href} className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                  <ExternalLink size={14} />
                </Link>
                <button
                  onClick={() => { remove(item.id); toast.success("ลบออกจากรายการถูกใจแล้ว"); }}
                  className="text-muted-foreground/40 hover:text-destructive transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {/* Clear all */}
            <div className="pt-3 border-t border-border flex justify-end">
              <button
                onClick={() => { clear(); toast.success("ล้างรายการถูกใจทั้งหมดแล้ว"); }}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                ล้างทั้งหมด
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quote Dialog */}
      {quoteOpen && (
        <QuoteDialog
          open={true}
          onClose={() => setQuoteOpen(false)}
          initialProducts={items.map((i) => ({ category: i.category, model: i.name, qty: 1 }))}
        />
      )}
    </div>
  );
};

export default MyAccountWishlist;
