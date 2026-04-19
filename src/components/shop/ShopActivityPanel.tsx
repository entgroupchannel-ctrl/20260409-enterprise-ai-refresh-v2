import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, GitCompare, Search, Eye, FileText, Trash2, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useShopActivity,
  toggleWishlist,
  clearWishlist,
  clearRecentSearches,
  clearCompareList,
  clearRecentlyViewed,
  COMPARE_KEY,
} from '@/hooks/useShopActivity';

/**
 * ShopActivityPanel — reusable "your shop history" reminder panel.
 *
 * Shows 4 cards: Wishlist, Compare, Recent Searches, Recently Viewed.
 * Designed to be placed near the bottom of /shop, /shop/:slug and /shop/compare
 * to remind customers to come back and finish their RFQ.
 *
 * The panel auto-hides when there is nothing in any list (no empty noise).
 */
export default function ShopActivityPanel({
  className = '',
}: {
  className?: string;
}) {
  const { wishlist, compare, recentSearches, recentlyViewed } = useShopActivity();

  const hasAnything = useMemo(
    () =>
      wishlist.length > 0 ||
      compare.length > 0 ||
      recentSearches.length > 0 ||
      recentlyViewed.length > 0,
    [wishlist, compare, recentSearches, recentlyViewed],
  );

  if (!hasAnything) return null;

  // Build a single "request quote for everything" link combining wishlist + compare slugs
  const allSlugs = Array.from(new Set([...wishlist, ...compare]));
  const rfqHref =
    allSlugs.length > 0
      ? `/request-quote?products=${encodeURIComponent(allSlugs.join(','))}`
      : '/request-quote';

  return (
    <section
      className={`border-t border-border bg-muted/30 ${className}`}
      aria-labelledby="shop-activity-heading"
    >
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-end justify-between gap-3 mb-5">
          <div>
            <h2 id="shop-activity-heading" className="text-xl sm:text-2xl font-bold text-foreground">
              ประวัติการใช้งานของคุณ
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              สินค้าที่คุณดู เปรียบเทียบ และบันทึกไว้ — ขอใบเสนอราคาทั้งชุดได้ในคลิกเดียว
            </p>
          </div>
          {allSlugs.length > 0 && (
            <Button asChild size="sm" className="gap-2 shrink-0">
              <Link to={rfqHref}>
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">ขอใบเสนอราคาทั้งชุด</span>
                <span className="sm:hidden">ขอราคา</span>
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {allSlugs.length}
                </Badge>
              </Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Wishlist */}
          <ActivityCard
            icon={<Heart className="h-4 w-4 text-rose-500" />}
            title="รายการโปรด"
            count={wishlist.length}
            emptyText="ยังไม่ได้บันทึกรายการโปรด"
            viewAllHref="/shop?tab=wishlist"
            onClear={wishlist.length > 0 ? clearWishlist : undefined}
          >
            {wishlist.slice(0, 5).map((slug) => (
              <ChipLink key={slug} to={`/shop/${slug}`} onRemove={() => toggleWishlist(slug)}>
                {slug}
              </ChipLink>
            ))}
          </ActivityCard>

          {/* Compare */}
          <ActivityCard
            icon={<GitCompare className="h-4 w-4 text-primary" />}
            title="กำลังเปรียบเทียบ"
            count={compare.length}
            emptyText="ยังไม่ได้เลือกเปรียบเทียบ"
            viewAllHref={
              compare.length > 0 ? `/shop/compare?products=${compare.join(',')}` : '/shop'
            }
            onClear={
              compare.length > 0
                ? () => {
                    clearCompareList();
                    // ShopStorefront keeps its own state; reload guard handles UI.
                  }
                : undefined
            }
          >
            {compare.slice(0, 5).map((slug) => (
              <ChipLink key={slug} to={`/shop/${slug}`}>
                {slug}
              </ChipLink>
            ))}
          </ActivityCard>

          {/* Recent searches */}
          <ActivityCard
            icon={<Search className="h-4 w-4 text-amber-500" />}
            title="คำค้นล่าสุด"
            count={recentSearches.length}
            emptyText="ยังไม่มีการค้นหา"
            viewAllHref="/shop"
            onClear={recentSearches.length > 0 ? clearRecentSearches : undefined}
          >
            {recentSearches.slice(0, 6).map((s) => (
              <ChipLink key={s.q} to={`/shop?q=${encodeURIComponent(s.q)}`}>
                {s.q}
              </ChipLink>
            ))}
          </ActivityCard>

          {/* Recently viewed */}
          <ActivityCard
            icon={<Eye className="h-4 w-4 text-sky-500" />}
            title="เพิ่งดูล่าสุด"
            count={recentlyViewed.length}
            emptyText="ยังไม่มีสินค้าที่เพิ่งดู"
            viewAllHref="/shop"
            onClear={recentlyViewed.length > 0 ? clearRecentlyViewed : undefined}
          >
            {recentlyViewed.slice(0, 5).map((p) => (
              <ChipLink key={p.id} to={`/shop/${p.slug}`}>
                {p.model}
              </ChipLink>
            ))}
          </ActivityCard>
        </div>
      </div>
    </section>
  );
}

/* ── Sub-components ── */

function ActivityCard({
  icon,
  title,
  count,
  emptyText,
  viewAllHref,
  onClear,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  emptyText: string;
  viewAllHref: string;
  onClear?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 min-h-[180px]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {icon}
          <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
          {count > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {count}
            </Badge>
          )}
        </div>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] text-muted-foreground hover:text-destructive inline-flex items-center gap-1 transition-colors"
            aria-label={`ล้าง${title}`}
          >
            <Trash2 className="h-3 w-3" />
            ล้าง
          </button>
        )}
      </div>

      <div className="flex-1">
        {count === 0 ? (
          <p className="text-xs text-muted-foreground">{emptyText}</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">{children}</div>
        )}
      </div>

      <Link
        to={viewAllHref}
        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        ดูทั้งหมด <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function ChipLink({
  to,
  onRemove,
  children,
}: {
  to: string;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 max-w-full rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-foreground hover:border-primary/40 transition-colors">
      <Link to={to} className="truncate max-w-[140px]">
        {children}
      </Link>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive shrink-0"
          aria-label="เอาออก"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
