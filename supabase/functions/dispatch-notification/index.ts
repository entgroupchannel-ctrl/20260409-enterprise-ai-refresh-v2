// Phase 1a: Centralized notification dispatcher
// Single entry point for in-app + email notifications.
// Routes email via legacy path (notify-quote-status) for now.
// Phase 2 will flip routing to 'registry' (send-transactional-email) per event.
//
// TEST_MODE guard (NOTIFICATION_TEST_MODE env var) is preserved for
// future testing phases (Phase 2 template migration, Phase 4 business
// changes). When env var is unset/deleted = production behavior.
// To activate: set NOTIFICATION_TEST_MODE=true in Supabase secrets.

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type RoutingStrategy = 'admin-only-legacy' | 'legacy' | 'registry' | 'none'

// Phase 1a routing map. All entries default to legacy paths.
// Phase 2 will flip selected events to 'registry'.
const ROUTING_STRATEGY: Record<string, RoutingStrategy> = {
  // Customer-facing form submissions → notify admin only
  'quote.requested':       'admin-only-legacy',
  'po.uploaded':           'admin-only-legacy',
  'payment.slip_uploaded': 'admin-only-legacy',
  'repair.requested':      'admin-only-legacy',
  'contact.submitted':     'admin-only-legacy',
  'partner.applied':       'admin-only-legacy',

  // Admin actions → notify customer (uses legacy notify-quote-status)
  'quote.sent':            'legacy',
  'quote.accepted':        'legacy',
  'quote.rejected':        'legacy',
  'quote.revised':         'legacy',
  'quote.expired':         'legacy',
  'quote.cancelled':       'legacy',
  'po.approved':           'legacy',
  'po.rejected':           'legacy',
  'so.created':            'legacy',
  'so.shipped':            'legacy',
  'so.delivered':          'legacy',
  'invoice.created':       'legacy',
  'invoice.sent':          'legacy',
  'invoice.paid':          'legacy',
  'invoice.overdue':       'legacy',
  'invoice.voided':        'legacy',
  'invoice.cancelled':     'legacy',
  'payment.confirmed':     'legacy',
  'payment.refunded':      'legacy',
  'receipt.created':       'legacy',
  'receipt.issued':        'legacy',
  'receipt.cancelled':     'legacy',
  'tax_invoice.created':   'legacy',
  'tax_invoice.issued':    'legacy',
  'tax_invoice.cancelled': 'legacy',
  'credit_note.created':   'legacy',
  'credit_note.issued':    'legacy',
}

interface DispatchPayload {
  eventKey: string
  recipientUserId?: string | null
  recipientRole?: 'admin' | 'super_admin' | 'customer' | null
  recipientEmail?: string | null
  title: string
  message: string
  priority?: 'urgent' | 'high' | 'normal'
  actionUrl?: string | null
  actionLabel?: string | null
  linkType?: string | null
  linkId?: string | null
  entityType?: string | null
  entityId?: string | null
  metadata?: Record<string, unknown>
  actorId?: string | null
  idempotencyKey?: string | null
  // Legacy email params (passthrough to notify-quote-status)
  customerName?: string
  quoteNumber?: string
  invoiceNumber?: string
  amount?: string
  viewUrl?: string
  note?: string
  status?: string // overrides default status string for legacy email
  pdfUrl?: string // NEW — for quote.sent PDF attachment link
}

type EmailStatus = 'sent' | 'failed' | 'skipped' | 'not_applicable'

interface EmailOutcome {
  adminStatus: EmailStatus
  customerStatus: EmailStatus
  errorMessage?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let payload: DispatchPayload
  try {
    payload = await req.json()
  } catch (_e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Minimal validation
  if (!payload.eventKey || typeof payload.eventKey !== 'string') {
    return new Response(JSON.stringify({ error: 'eventKey required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  if (!payload.title || !payload.message) {
    return new Response(JSON.stringify({ error: 'title and message required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  // Step 1: in-app dispatch + audit log
  const { data: rpcData, error: rpcError } = await supabase.rpc('dispatch_notification_event', {
    p_event_key: payload.eventKey,
    p_recipient_user_id: payload.recipientUserId ?? null,
    p_recipient_role: payload.recipientRole ?? null,
    p_title: payload.title,
    p_message: payload.message,
    p_action_url: payload.actionUrl ?? null,
    p_action_label: payload.actionLabel ?? null,
    p_link_type: payload.linkType ?? null,
    p_link_id: payload.linkId ?? null,
    p_metadata: payload.metadata ?? {},
    p_actor_id: payload.actorId ?? null,
    p_entity_type: payload.entityType ?? null,
    p_entity_id: payload.entityId ?? null,
    p_idempotency_key: payload.idempotencyKey ?? null,
    p_safe_mode: false,
  })

  if (rpcError) {
    console.error('[dispatch-notification] RPC error:', rpcError, 'event:', payload.eventKey)
    return new Response(
      JSON.stringify({ error: 'rpc_failed', detail: rpcError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const rpcRow = Array.isArray(rpcData) ? rpcData[0] : rpcData
  const dispatchId: string | null = rpcRow?.dispatch_id ?? null

  // Step 2: route email per strategy
  const strategy: RoutingStrategy = ROUTING_STRATEGY[payload.eventKey] ?? 'none'
  const outcome = await routeEmail(supabase, supabaseUrl, payload, strategy)

  // Step 3: persist email status to dispatch_log
  if (dispatchId) {
    const updates: Record<string, unknown> = {
      admin_email_status: outcome.adminStatus === 'not_applicable' ? null : outcome.adminStatus,
      customer_email_status: outcome.customerStatus === 'not_applicable' ? null : outcome.customerStatus,
    }
    if (outcome.errorMessage) {
      updates.error_message = outcome.errorMessage
    }
    if (Object.keys(updates).length > 0) {
      const { error: updErr } = await supabase
        .from('notification_dispatch_log')
        .update(updates)
        .eq('id', dispatchId)
      if (updErr) {
        console.error('[dispatch-notification] dispatch_log update failed:', updErr)
      }
    }
  }

  return new Response(
    JSON.stringify({
      ok: true,
      event_key: payload.eventKey,
      strategy,
      dispatch_id: dispatchId,
      rpc_result: rpcRow,
      email: outcome,
    }, null, 2),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})

async function routeEmail(
  supabase: ReturnType<typeof createClient>,
  _supabaseUrl: string,
  p: DispatchPayload,
  strategy: RoutingStrategy
): Promise<EmailOutcome> {
  if (strategy === 'none' || strategy === 'registry') {
    // Phase 1a: 'registry' is reserved for Phase 2; treat as no-op for now
    return { adminStatus: 'not_applicable', customerStatus: 'not_applicable' }
  }

  if (strategy === 'admin-only-legacy') {
    return await sendAdminLegacyEmails(supabase, p)
  }

  // strategy === 'legacy' → customer email
  return await sendCustomerLegacyEmail(supabase, p)
}

async function sendAdminLegacyEmails(
  supabase: ReturnType<typeof createClient>,
  p: DispatchPayload
): Promise<EmailOutcome> {
  const { data: admins, error: adminErr } = await supabase.rpc('get_admin_emails')
  if (adminErr) {
    console.error('[dispatch-notification] get_admin_emails error:', adminErr)
    return {
      adminStatus: 'failed',
      customerStatus: 'not_applicable',
      errorMessage: `get_admin_emails: ${adminErr.message}`,
    }
  }

  const emails: string[] = ((admins as Array<{ email?: string | null }>) || [])
    .map((u) => u?.email)
    .filter((e): e is string => !!e)

  if (!emails.length) {
    console.warn('[dispatch-notification] no admin emails for event:', p.eventKey)
    return {
      adminStatus: 'skipped',
      customerStatus: 'not_applicable',
      errorMessage: 'no_admin_emails',
    }
  }

  // TEST MODE: restrict to allowlist when NOTIFICATION_TEST_MODE=true
  const TEST_MODE = Deno.env.get('NOTIFICATION_TEST_MODE') === 'true'
  const TEST_ALLOWLIST = ['therdpoom@entgroup.co.th']
  const finalEmails = TEST_MODE
    ? emails.filter((e) => TEST_ALLOWLIST.includes(e.toLowerCase()))
    : emails
  if (TEST_MODE) {
    console.log(`[dispatch-notification] TEST_MODE active — filtered ${emails.length} → ${finalEmails.length} admin recipient(s)`)
  }

  let anyFailed = false
  let lastError: string | undefined

  for (let i = 0; i < finalEmails.length; i++) {
    const email = finalEmails[i]
    try {
      const { error } = await supabase.functions.invoke('notify-quote-status', {
        body: {
          recipientEmail: email,
          customerName: p.customerName,
          quoteNumber: p.quoteNumber,
          status: p.status ?? p.eventKey,
          invoiceNumber: p.invoiceNumber,
          amount: p.amount,
          viewUrl: p.viewUrl,
          note: p.note ?? p.message,
          pdfUrl: p.pdfUrl,
        },
      })
      if (error) {
        anyFailed = true
        lastError = error.message
        console.error(`[dispatch-notification] admin email failed (${email}):`, error)
      }
    } catch (e) {
      anyFailed = true
      lastError = e instanceof Error ? e.message : String(e)
      console.error(`[dispatch-notification] admin email exception (${email}):`, e)
    }
    // Throttle to respect Resend rate limit
    if (i < finalEmails.length - 1) {
      await new Promise((r) => setTimeout(r, 600))
    }
  }

  return {
    adminStatus: anyFailed ? 'failed' : 'sent',
    customerStatus: 'not_applicable',
    errorMessage: lastError,
  }
}

async function sendCustomerLegacyEmail(
  supabase: ReturnType<typeof createClient>,
  p: DispatchPayload
): Promise<EmailOutcome> {
  // Resolve recipient email
  let email = p.recipientEmail ?? null
  if (!email && p.recipientUserId) {
    const { data: userRow, error: userErr } = await supabase
      .from('users')
      .select('email')
      .eq('id', p.recipientUserId)
      .maybeSingle()
    if (userErr) {
      console.error('[dispatch-notification] user lookup error:', userErr)
      return {
        adminStatus: 'not_applicable',
        customerStatus: 'failed',
        errorMessage: `user_lookup: ${userErr.message}`,
      }
    }
    email = (userRow as { email?: string | null } | null)?.email ?? null
  }

  if (!email) {
    return {
      adminStatus: 'not_applicable',
      customerStatus: 'skipped',
      errorMessage: 'no_recipient_email',
    }
  }

  try {
    const { error } = await supabase.functions.invoke('notify-quote-status', {
      body: {
        recipientEmail: email,
        customerName: p.customerName,
        quoteNumber: p.quoteNumber,
        status: p.status ?? p.eventKey,
        invoiceNumber: p.invoiceNumber,
        amount: p.amount,
        viewUrl: p.viewUrl,
        note: p.note ?? p.message,
        pdfUrl: p.pdfUrl,
      },
    })
    if (error) {
      console.error('[dispatch-notification] customer email failed:', error)
      return {
        adminStatus: 'not_applicable',
        customerStatus: 'failed',
        errorMessage: error.message,
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[dispatch-notification] customer email exception:', e)
    return {
      adminStatus: 'not_applicable',
      customerStatus: 'failed',
      errorMessage: msg,
    }
  }

  return { adminStatus: 'not_applicable', customerStatus: 'sent' }
}
