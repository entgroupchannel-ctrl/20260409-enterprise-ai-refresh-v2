import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart, ArrowLeft, X, Share2, Link2, Check, FileText, Trash2 } from "lucide-react";
import { useWishlist, WishlistItem } from "@/hooks/useWishlist";
import { toast } from "sonner";
import FooterCompact from "@/components/FooterCompact";
import QuoteDialog from "@/components/QuoteDialog";
import SEOHead from "@/components/SEOHead";
import logo from "@/assets/logo-entgroup.avif";
import ThemeToggle from "@/components/ThemeToggle";
import QuoteCartButton from "@/components/QuoteCartButton";

const WishlistPage = () => {
  const { items, remove, clear } = useWishlist();
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  // Shared view via ?items=JSON
  const sharedData = searchParams.get("items");
  const isSharedView = !!sharedData;
  let displayItems: WishlistItem[] = items;

  if (isSharedView) {
    try {
      displayItems = JSON.parse(decodeURIComponent(sharedData!));
    } catch {
      displayItems = [];
    }
  }

  const shareWishlist = async () => {
    const encoded = encodeURIComponent(JSON.stringify(displayItems.map(({ id, name, category, image, href }) => ({ id, name, category, image, href }))));
    const url = `${window.location.origin}/wishlist?items=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("คัดลอกลิงก์แล้ว! แชร์ให้เพื่อนร่วมงานได้เลย");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("คัดลอกไม่สำเร็จ");
    }
  };

  const quoteProductName = displayItems.map((i) => `${i.name} (${i.category})`).join(", ");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="สินค้าที่ถูกใจ — Wishlist"
        description="รายการสินค้า Mini PC, Panel PC, Industrial Computer ที่คุณสนใจ พร้อมขอใบเสนอราคาได้ทันที"
        path="/wishlist"
      />

      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="ENT GROUP" className="h-8 w-auto" />
            </Link>
            <span className="text-border">/</span>
            <span className="text-sm font-semibold text-foreground">สินค้าที่ถูกใจ</span>
          </div>
          <div className="flex items-center gap-2">
            <QuoteCartButton />
            <ThemeToggle />
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Heart size={20} className="fill-destructive text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {isSharedView ? "รายการที่แชร์" : "สินค้าที่ถูกใจ"}
              </h1>
              <p className="text-sm text-muted-foreground">{displayItems.length} รายการ</p>
            </div>
          </div>

          {displayItems.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={shareWishlist}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors"
              >
                {copied ? <Check size={14} className="text-primary" /> : <Link2 size={14} />}
                {copied ? "คัดลอกแล้ว!" : "แชร์ลิงก์"}
              </button>
              <button
                onClick={() => setQuoteOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                <FileText size={14} /> ขอใบเสนอราคาทั้งหมด
              </button>
              {!isSharedView && (
                <button
                  onClick={() => {
                    clear();
                    toast.success("ล้างรายการถูกใจทั้งหมดแล้ว");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-destructive/30 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={14} /> ล้างทั้งหมด
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {displayItems.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Heart size={48} className="mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">
              ยังไม่มีสินค้าที่ถูกใจ กดไอคอนหัวใจที่สินค้าเพื่อบันทึกไว้ที่นี่
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              ดูสินค้าทั้งหมด
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayItems.map((item) => (
              <div key={item.id} className="relative group card-surface rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all">
                {/* Remove button */}
                {!isSharedView && (
                  <button
                    onClick={() => {
                      remove(item.id);
                      toast.success(`ลบ ${item.name} ออกจากรายการแล้ว`);
                    }}
                    className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-destructive/80 backdrop-blur-sm border border-destructive/30 flex items-center justify-center hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                    title="ลบออก"
                  >
                    <X size={14} className="text-destructive-foreground" />
                  </button>
                )}

                <Link to={item.href} className="block">
                  {/* Image */}
                  <div className="aspect-[4/3] bg-secondary/30 flex items-center justify-center p-4 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-muted-foreground/30 text-4xl font-bold">{item.name.charAt(0)}</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-primary">{item.category}</span>
                    <h3 className="text-sm font-bold text-foreground mt-1">{item.name}</h3>
                    {item.specs && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.specs}</p>
                    )}
                  </div>
                </Link>

                {/* Quote button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => setQuoteOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    <FileText size={12} /> ขอใบเสนอราคา
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FooterCompact />

      <QuoteDialog
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        productName={quoteProductName}
        productCategory="Wishlist"
      />
    </div>
  );
};

export default WishlistPage;
