/**
 * useEngagementTracking — Server-side engagement tracking for marketing automation.
 *
 * Tracks: product likes (wishlist), product views (with duration), product shares.
 * Only logs when user is logged in. Falls back silently for guests.
 *
 * Three exports:
 *   - useEngagementSync()           — call once at app root; syncs localStorage wishlist → DB on login
 *   - useProductViewTracker(meta)   — call on product detail page; logs view + duration
 *   - logProductLike(meta)          — call when user toggles wishlist ON
 *   - removeProductLike(slug)       — call when user toggles wishlist OFF
 *   - logProductShare(meta)         — call after a successful share
 */
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getWishlist } from '@/hooks/useShopActivity';

interface ProductMeta {
  slug: string;
  product_id?: string | null;
  model?: string | null;
  name?: string | null;
}

const SYNC_FLAG = 'ent_wishlist_synced_v1';

/* ─────────── 1. Wishlist (Likes) ─────────── */
export async function logProductLike(meta: ProductMeta) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await (supabase.from as any)('product_likes').upsert(
      {
        user_id: user.id,
        product_slug: meta.slug,
        product_id: meta.product_id ?? null,
        product_model: meta.model ?? null,
        product_name: meta.name ?? null,
        liked_at: new Date().toISOString(),
        reminded_at: null, // reset reminder window when re-liked
      },
      { onConflict: 'user_id,product_slug' }
    );
  } catch (e) {
    /* silent — tracking failures must not break UX */
  }
}

export async function removeProductLike(slug: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await (supabase.from as any)('product_likes')
      .delete()
      .eq('user_id', user.id)
      .eq('product_slug', slug);
  } catch (e) {
    /* silent */
  }
}

/* ─────────── 2. Shares ─────────── */
export async function logProductShare(meta: ProductMeta & { channel?: string }) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await (supabase.from as any)('product_shares').insert({
      user_id: user.id,
      product_slug: meta.slug,
      product_id: meta.product_id ?? null,
      product_model: meta.model ?? null,
      product_name: meta.name ?? null,
      channel: meta.channel ?? 'native',
    });
  } catch (e) {
    /* silent */
  }
}

/* ─────────── 3. Views (with duration) ─────────── */
export function useProductViewTracker(meta: ProductMeta | null) {
  const { user } = useAuth();
  const startedAtRef = useRef<number | null>(null);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (!user || !meta?.slug) return;
    startedAtRef.current = Date.now();
    loggedRef.current = false;

    const flush = async (durationSec: number) => {
      if (loggedRef.current) return;
      loggedRef.current = true;
      try {
        await (supabase.from as any)('product_views').insert({
          user_id: user.id,
          product_slug: meta.slug,
          product_id: meta.product_id ?? null,
          product_model: meta.model ?? null,
          product_name: meta.name ?? null,
          duration_seconds: Math.max(0, Math.round(durationSec)),
        });
      } catch (e) {
        /* silent */
      }
    };

    const onUnload = () => {
      const dur = startedAtRef.current ? (Date.now() - startedAtRef.current) / 1000 : 0;
      flush(dur);
    };

    window.addEventListener('beforeunload', onUnload);

    return () => {
      window.removeEventListener('beforeunload', onUnload);
      const dur = startedAtRef.current ? (Date.now() - startedAtRef.current) / 1000 : 0;
      flush(dur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, meta?.slug]);
}

/* ─────────── 4. Sync localStorage wishlist → DB on login ─────────── */
export function useEngagementSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const flagKey = `${SYNC_FLAG}:${user.id}`;
    if (localStorage.getItem(flagKey) === '1') return;

    (async () => {
      try {
        const slugs = getWishlist();
        if (slugs.length > 0) {
          const rows = slugs.map((slug) => ({
            user_id: user.id,
            product_slug: slug,
            liked_at: new Date().toISOString(),
            reminded_at: null,
          }));
          await (supabase.from as any)('product_likes').upsert(rows, {
            onConflict: 'user_id,product_slug',
            ignoreDuplicates: true,
          });
        }
        localStorage.setItem(flagKey, '1');
      } catch (e) {
        /* silent — will retry next login */
      }
    })();
  }, [user?.id]);
}
