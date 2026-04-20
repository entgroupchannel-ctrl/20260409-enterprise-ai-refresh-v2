// Edge Function: process-engagement-reminders
// Runs on a cron schedule (10:00 / 14:00 / 20:00 Bangkok = 03:00 / 07:00 / 13:00 UTC).
// Scans 4 engagement signals and enqueues marketing reminder emails:
//   1. cart-abandoned    — cart_items idle > 1h, not yet reminded
//   2. liked-reminder    — product_likes > 7 days old, not yet reminded
//   3. hot-interest      — >= 3 product_views of same slug within 7 days, not yet reminded
//   4. shared-followup   — product_shares > 1 day old, not yet reminded
//
// Each path marks a `reminded_at` timestamp to guarantee one-shot delivery.
// Suppression + unsubscribe is handled by send-transactional-email downstream.

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://www.entgroup.co.th'
const HOT_INTEREST_THRESHOLD = 3
const HOT_INTEREST_WINDOW_DAYS = 7
const LIKED_REMINDER_DAYS = 7
const SHARED_FOLLOWUP_HOURS = 24
const CART_ABANDONED_HOURS = 1
const BATCH_LIMIT = 50 // safety cap per signal per run

interface UserLite { id: string; email: string; full_name: string | null }

async function fetchUser(supabase: any, userId: string): Promise<UserLite | null> {
  const { data } = await supabase
    .from('users')
    .select('id, email, full_name, is_active')
    .eq('id', userId)
    .maybeSingle()
  if (!data || !data.email || data.is_active === false) return null
  return { id: data.id, email: data.email, full_name: data.full_name }
}

async function sendEmail(
  supabaseUrl: string,
  serviceKey: string,
  templateName: string,
  recipientEmail: string,
  templateData: Record<string, any>,
  idempotencyKey: string,
) {
  const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({
      templateName,
      recipientEmail,
      idempotencyKey,
      templateData,
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`send-transactional-email failed (${res.status}): ${body}`)
  }
  return res.json()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  const stats = { cart: 0, liked: 0, hot: 0, shared: 0, errors: 0 }
  const nowIso = new Date().toISOString()

  /* ───────── 1. CART ABANDONED ───────── */
  try {
    const cutoff = new Date(Date.now() - CART_ABANDONED_HOURS * 3600 * 1000).toISOString()
    // Group by user_id — a single reminder per user with item summary.
    const { data: cartRows } = await supabase
      .from('cart_items')
      .select('user_id, product_name, product_model, updated_at')
      .lt('updated_at', cutoff)
      .order('updated_at', { ascending: false })
      .limit(500)

    if (cartRows && cartRows.length > 0) {
      // Check which users have already been reminded recently (last 7 days)
      // We track via `cart_reminders` table (created in migration).
      const userIds = Array.from(new Set(cartRows.map((r: any) => r.user_id)))
      const reminderCutoff = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
      const { data: recentReminders } = await supabase
        .from('cart_reminders')
        .select('user_id')
        .in('user_id', userIds)
        .gt('reminded_at', reminderCutoff)
      const remindedSet = new Set((recentReminders || []).map((r: any) => r.user_id))

      const byUser = new Map<string, any[]>()
      for (const row of cartRows) {
        if (remindedSet.has(row.user_id)) continue
        const arr = byUser.get(row.user_id) || []
        arr.push(row)
        byUser.set(row.user_id, arr)
      }

      let processed = 0
      for (const [uid, items] of byUser) {
        if (processed >= BATCH_LIMIT) break
        const user = await fetchUser(supabase, uid)
        if (!user) continue
        try {
          await sendEmail(supabaseUrl, serviceKey, 'cart-abandoned', user.email, {
            customerName: user.full_name || undefined,
            itemCount: items.length,
            firstItemName: items[0].product_name || items[0].product_model,
            cartUrl: `${SITE_URL}/cart`,
          }, `cart-abandoned:${uid}:${nowIso.slice(0, 10)}`)
          await supabase.from('cart_reminders').upsert({ user_id: uid, reminded_at: nowIso }, { onConflict: 'user_id' })
          stats.cart++
          processed++
        } catch (e) {
          console.error('cart-abandoned send failed', uid, e)
          stats.errors++
        }
      }
    }
  } catch (e) {
    console.error('cart-abandoned scan failed', e)
    stats.errors++
  }

  /* ───────── 2. LIKED REMINDER ───────── */
  try {
    const cutoff = new Date(Date.now() - LIKED_REMINDER_DAYS * 24 * 3600 * 1000).toISOString()
    const { data: likeRows } = await supabase
      .from('product_likes')
      .select('id, user_id, product_slug, product_name, product_model')
      .lt('liked_at', cutoff)
      .is('reminded_at', null)
      .limit(BATCH_LIMIT)

    for (const row of likeRows || []) {
      const user = await fetchUser(supabase, row.user_id)
      if (!user) {
        await supabase.from('product_likes').update({ reminded_at: nowIso }).eq('id', row.id)
        continue
      }
      try {
        await sendEmail(supabaseUrl, serviceKey, 'liked-reminder', user.email, {
          customerName: user.full_name || undefined,
          productName: row.product_name || row.product_model || row.product_slug,
          productUrl: `${SITE_URL}/shop/${row.product_slug}`,
        }, `liked:${row.id}`)
        await supabase.from('product_likes').update({ reminded_at: nowIso }).eq('id', row.id)
        stats.liked++
      } catch (e) {
        console.error('liked-reminder send failed', row.id, e)
        stats.errors++
      }
    }
  } catch (e) {
    console.error('liked-reminder scan failed', e)
    stats.errors++
  }

  /* ───────── 3. HOT INTEREST (>= 3 views / 7 days, never reminded) ───────── */
  try {
    const since = new Date(Date.now() - HOT_INTEREST_WINDOW_DAYS * 24 * 3600 * 1000).toISOString()
    // Pull recent views, then aggregate in JS (Supabase REST has no GROUP BY).
    const { data: viewRows } = await supabase
      .from('product_views')
      .select('user_id, product_slug, product_name, product_model, viewed_at')
      .gt('viewed_at', since)
      .limit(2000)

    if (viewRows && viewRows.length > 0) {
      const counts = new Map<string, { user_id: string; slug: string; name: string | null; model: string | null; n: number }>()
      for (const v of viewRows as any[]) {
        const key = `${v.user_id}::${v.product_slug}`
        const cur = counts.get(key)
        if (cur) {
          cur.n++
        } else {
          counts.set(key, { user_id: v.user_id, slug: v.product_slug, name: v.product_name, model: v.product_model, n: 1 })
        }
      }

      const hot = Array.from(counts.values()).filter((c) => c.n >= HOT_INTEREST_THRESHOLD)
      if (hot.length > 0) {
        // Filter out (user, slug) pairs already reminded
        const { data: existingReminders } = await supabase
          .from('hot_interest_reminders')
          .select('user_id, product_slug')
          .in('user_id', hot.map((h) => h.user_id))
        const sentSet = new Set((existingReminders || []).map((r: any) => `${r.user_id}::${r.product_slug}`))

        let processed = 0
        for (const h of hot) {
          if (processed >= BATCH_LIMIT) break
          if (sentSet.has(`${h.user_id}::${h.slug}`)) continue
          const user = await fetchUser(supabase, h.user_id)
          if (!user) continue
          try {
            await sendEmail(supabaseUrl, serviceKey, 'hot-interest', user.email, {
              customerName: user.full_name || undefined,
              productName: h.name || h.model || h.slug,
              viewCount: h.n,
              productUrl: `${SITE_URL}/shop/${h.slug}`,
            }, `hot:${h.user_id}:${h.slug}:${nowIso.slice(0, 10)}`)
            await supabase.from('hot_interest_reminders').upsert(
              { user_id: h.user_id, product_slug: h.slug, reminded_at: nowIso, view_count: h.n },
              { onConflict: 'user_id,product_slug' },
            )
            stats.hot++
            processed++
          } catch (e) {
            console.error('hot-interest send failed', h, e)
            stats.errors++
          }
        }
      }
    }
  } catch (e) {
    console.error('hot-interest scan failed', e)
    stats.errors++
  }

  /* ───────── 4. SHARED FOLLOW-UP ───────── */
  try {
    const cutoff = new Date(Date.now() - SHARED_FOLLOWUP_HOURS * 3600 * 1000).toISOString()
    const { data: shareRows } = await supabase
      .from('product_shares')
      .select('id, user_id, product_slug, product_name, product_model')
      .lt('shared_at', cutoff)
      .is('reminded_at', null)
      .limit(BATCH_LIMIT)

    for (const row of shareRows || []) {
      const user = await fetchUser(supabase, row.user_id)
      if (!user) {
        await supabase.from('product_shares').update({ reminded_at: nowIso }).eq('id', row.id)
        continue
      }
      try {
        await sendEmail(supabaseUrl, serviceKey, 'shared-followup', user.email, {
          customerName: user.full_name || undefined,
          productName: row.product_name || row.product_model || row.product_slug,
          productUrl: `${SITE_URL}/shop/${row.product_slug}`,
        }, `shared:${row.id}`)
        await supabase.from('product_shares').update({ reminded_at: nowIso }).eq('id', row.id)
        stats.shared++
      } catch (e) {
        console.error('shared-followup send failed', row.id, e)
        stats.errors++
      }
    }
  } catch (e) {
    console.error('shared-followup scan failed', e)
    stats.errors++
  }

  console.log('process-engagement-reminders complete', stats)

  return new Response(JSON.stringify({ success: true, stats, ranAt: nowIso }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
