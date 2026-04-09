import { useState, useEffect, useCallback } from "react";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  image?: string;
  href: string;
  specs?: string;
}

const STORAGE_KEY = "ent_wishlist";

function getWishlist(): WishlistItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveWishlist(items: WishlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("wishlist-updated"));
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(getWishlist);
  const { trackEvent } = useEngagementTracker();

  useEffect(() => {
    const handler = () => setItems(getWishlist());
    window.addEventListener("wishlist-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("wishlist-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const isLiked = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const toggle = useCallback(
    (item: WishlistItem) => {
      const current = getWishlist();
      const exists = current.some((i) => i.id === item.id);
      const next = exists
        ? current.filter((i) => i.id !== item.id)
        : [...current, item];
      saveWishlist(next);
      setItems(next);

      trackEvent({
        eventType: exists ? "wishlist_remove" : "wishlist_add",
        productId: item.id,
        productCategory: item.category,
        productName: item.name,
      });
    },
    [trackEvent]
  );

  const remove = useCallback((id: string) => {
    const next = getWishlist().filter((i) => i.id !== id);
    saveWishlist(next);
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    saveWishlist([]);
    setItems([]);
  }, []);

  return { items, isLiked, toggle, remove, clear, count: items.length };
}
