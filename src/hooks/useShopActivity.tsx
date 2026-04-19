import { useCallback, useEffect, useState } from 'react';

/* ──────────────────────────────────────────────────────────────────
   Storage keys (shared across the shop experience)
   - WISHLIST_KEY: NEW — list of product slugs the user "saved for later"
   - RECENT_SEARCH_KEY: NEW — last search queries from /shop
   - COMPARE_KEY: existing — list managed by ShopStorefront
   - RECENTLY_VIEWED_KEY: existing — managed by RelatedProducts.addToRecentlyViewed
   ────────────────────────────────────────────────────────────────── */
export const WISHLIST_KEY = 'shopWishlist';
export const RECENT_SEARCH_KEY = 'shopRecentSearch';
export const COMPARE_KEY = 'shopCompareList';
export const RECENTLY_VIEWED_KEY = 'recentlyViewed';

const MAX_WISHLIST = 24;
const MAX_RECENT_SEARCH = 8;

/* ── Storage helpers ── */
function readJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Notify same-tab listeners (storage event only fires on other tabs)
    window.dispatchEvent(new CustomEvent('shop-activity-change', { detail: { key } }));
  } catch {
    /* ignore quota errors */
  }
}

/* ── Wishlist API ── */
export function getWishlist(): string[] {
  return readJSON<string[]>(WISHLIST_KEY, []);
}

export function setWishlist(slugs: string[]) {
  writeJSON(WISHLIST_KEY, slugs.slice(0, MAX_WISHLIST));
}

export function toggleWishlist(slug: string): string[] {
  const list = getWishlist();
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list];
  setWishlist(next);
  return next.slice(0, MAX_WISHLIST);
}

export function clearWishlist() {
  setWishlist([]);
}

/* ── Recent search API ── */
export interface RecentSearchEntry {
  q: string;
  at: number;
}

export function getRecentSearches(): RecentSearchEntry[] {
  return readJSON<RecentSearchEntry[]>(RECENT_SEARCH_KEY, []);
}

export function pushRecentSearch(q: string) {
  const term = q.trim();
  if (!term) return;
  const existing = getRecentSearches().filter((e) => e.q.toLowerCase() !== term.toLowerCase());
  const next = [{ q: term, at: Date.now() }, ...existing].slice(0, MAX_RECENT_SEARCH);
  writeJSON(RECENT_SEARCH_KEY, next);
}

export function clearRecentSearches() {
  writeJSON(RECENT_SEARCH_KEY, []);
}

/* ── Compare helpers (read-only mirror of ShopStorefront's storage) ── */
export function getCompareList(): string[] {
  return readJSON<string[]>(COMPARE_KEY, []);
}

export function clearCompareList() {
  writeJSON(COMPARE_KEY, []);
}

/* ── Recently viewed helpers (read-only mirror) ── */
export interface RecentlyViewedItem {
  id: string;
  slug: string;
  model: string;
  thumbnail_url: string | null;
  image_url?: string | null;
  unit_price: number;
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  return readJSON<RecentlyViewedItem[]>(RECENTLY_VIEWED_KEY, []);
}

export function clearRecentlyViewed() {
  writeJSON(RECENTLY_VIEWED_KEY, []);
}

/* ── Aggregated reactive hook ── */
export interface ShopActivitySnapshot {
  wishlist: string[];
  compare: string[];
  recentSearches: RecentSearchEntry[];
  recentlyViewed: RecentlyViewedItem[];
}

export function useShopActivity(): ShopActivitySnapshot & {
  refresh: () => void;
} {
  const [snapshot, setSnapshot] = useState<ShopActivitySnapshot>(() => ({
    wishlist: getWishlist(),
    compare: getCompareList(),
    recentSearches: getRecentSearches(),
    recentlyViewed: getRecentlyViewed(),
  }));

  const refresh = useCallback(() => {
    setSnapshot({
      wishlist: getWishlist(),
      compare: getCompareList(),
      recentSearches: getRecentSearches(),
      recentlyViewed: getRecentlyViewed(),
    });
  }, []);

  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener('shop-activity-change', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('shop-activity-change', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [refresh]);

  return { ...snapshot, refresh };
}
