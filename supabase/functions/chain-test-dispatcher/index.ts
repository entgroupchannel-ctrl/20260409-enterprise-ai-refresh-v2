// Temporary diagnostic function — runs 7-stage notification chain test
// Invoke once, then DELETE this function. Admin-only (verify_jwt enforced via config).
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Stage {
  event_key: string
  recipient_role?: 'admin' | 'super_admin'
  recipient_user_id?: string
  title: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  // Pick a real customer for customer-targeted stages
  const { data: customer } = await supabase
    .from('users')
    .select('id, email')
    .eq('role', 'member')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  const ts = Date.now().toString()
  const customerId = customer?.id ?? null

  const stages: Stage[] = [
    { event_key: 'quote.requested',       recipient_role: 'admin', title: 'CHAIN-1 RFQ' },
    { event_key: 'quote.sent',            recipient_user_id: customerId ?? undefined, title: 'CHAIN-2 Quote sent' },
    { event_key: 'po.uploaded',           recipient_role: 'admin', title: 'CHAIN-3 PO uploaded' },
    { event_key: 'po.approved',           recipient_user_id: customerId ?? undefined, title: 'CHAIN-4 PO approved' },
    { event_key: 'invoice.created',       recipient_user_id: customerId ?? undefined, title: 'CHAIN-5 Invoice' },
    { event_key: 'payment.confirmed',     recipient_user_id: customerId ?? undefined, title: 'CHAIN-6 Payment' },
    { event_key: 'receipt.issued',        recipient_user_id: customerId ?? undefined, title: 'CHAIN-7 Receipt' },
  ]

  const results: any[] = []
  for (let i = 0; i < stages.length; i++) {
    const s = stages[i]
    const idem = `chain-${i + 1}-${ts}`
    const { data, error } = await supabase.rpc('dispatch_notification_event', {
      p_event_key: s.event_key,
      p_recipient_user_id: s.recipient_user_id ?? null,
      p_recipient_role: s.recipient_role ?? null,
      p_title: s.title,
      p_message: `Chain test stage ${i + 1}`,
      p_action_url: null,
      p_action_label: null,
      p_link_type: 'quote',
      p_link_id: `chain-test-${ts}`,
      p_metadata: { chain_test: true, stage: i + 1 },
      p_actor_id: null,
      p_entity_type: 'quote',
      p_entity_id: `chain-test-${ts}`,
      p_idempotency_key: idem,
      p_safe_mode: false,
    })
    results.push({ stage: i + 1, event_key: s.event_key, idem, dispatch_result: data, error: error?.message ?? null })
  }

  // Wait briefly for log writes
  await new Promise((r) => setTimeout(r, 500))

  // Pull dispatch_log + email_send_log + config matrix
  const { data: dispatchRows } = await supabase
    .from('notification_dispatch_log')
    .select('event_key, idempotency_key, admin_in_app_status, admin_email_status, customer_in_app_status, customer_email_status, error_message, created_at')
    .like('idempotency_key', `chain-%-${ts}`)
    .order('created_at', { ascending: true })

  const sinceIso = new Date(Date.now() - 5 * 60_000).toISOString()
  const { data: emailRows } = await supabase
    .from('email_send_log')
    .select('template_name, recipient_email, status, error_message, created_at')
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: cfg } = await supabase
    .from('notification_events')
    .select('event_key, notify_admin_in_app, notify_admin_email, notify_customer_in_app, notify_customer_email, email_template')
    .in('event_key', stages.map((s) => s.event_key))

  return new Response(
    JSON.stringify({
      ts,
      customer_used: customer?.email ?? null,
      stages: results,
      dispatch_log: dispatchRows,
      email_log: emailRows,
      config: cfg,
    }, null, 2),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
