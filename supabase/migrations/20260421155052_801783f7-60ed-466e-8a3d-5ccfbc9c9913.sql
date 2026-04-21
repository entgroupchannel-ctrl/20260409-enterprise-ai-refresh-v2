-- Phase 1a: Insert 5 missing notification events as inactive placeholders
-- Context: dispatch-notification edge function will route these via 'legacy' strategy
-- (bypass registry config). is_active=false signals "registry not authoritative yet".
-- Phase 2 will activate these and flip routing to 'registry' with proper config.

INSERT INTO public.notification_events (
  event_key, category, priority, is_critical, is_active,
  notify_admin_in_app, notify_admin_email,
  notify_customer_in_app, notify_customer_email,
  email_template, display_name
) VALUES
  ('invoice.cancelled',    'invoice',     'P2', false, false,
   false, false, false, false, NULL, 'Invoice cancelled (legacy-routed, Phase 1a placeholder)'),
  ('receipt.cancelled',    'receipt',     'P2', false, false,
   false, false, false, false, NULL, 'Receipt cancelled (legacy-routed, Phase 1a placeholder)'),
  ('quote.cancelled',      'quote',       'P2', false, false,
   false, false, false, false, NULL, 'Quote cancelled (legacy-routed, Phase 1a placeholder)'),
  ('tax_invoice.created',  'tax_invoice', 'P2', false, false,
   false, false, false, false, NULL, 'Tax invoice created (legacy-routed, Phase 1a placeholder)'),
  ('credit_note.created',  'credit_note', 'P2', false, false,
   false, false, false, false, NULL, 'Credit note created (legacy-routed, Phase 1a placeholder)')
ON CONFLICT (event_key) DO NOTHING;

COMMENT ON TABLE public.notification_events IS
  'Event registry for notification dispatcher. is_active=false means legacy caller path handles email (registry config not yet authoritative). Phase 2 migration will activate these rows and flip routing strategy to ''registry''.';