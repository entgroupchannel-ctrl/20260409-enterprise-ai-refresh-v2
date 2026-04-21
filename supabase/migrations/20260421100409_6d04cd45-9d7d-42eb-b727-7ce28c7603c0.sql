-- Phase A: Fix notification routing gaps

-- 1) Enable admin in-app for quote.sent so admins keep receiving in-app via dispatcher
UPDATE public.notification_events
SET notify_admin_in_app = true,
    updated_at = now()
WHERE event_key = 'quote.sent';

-- 2) Drop legacy notify_admins overload (text link_id, no exclude_user_id)
DROP FUNCTION IF EXISTS public.notify_admins(
  p_type text,
  p_title text,
  p_message text,
  p_priority text,
  p_action_url text,
  p_action_label text,
  p_link_type text,
  p_link_id text
);

-- 3) Register missing events used by legacy call sites
INSERT INTO public.notification_events
  (event_key, display_name, description, category, is_critical, is_active,
   notify_admin_in_app, notify_admin_email,
   notify_customer_in_app, notify_customer_email,
   priority)
VALUES
  ('receipt.created',
   'สร้างใบเสร็จรับเงิน',
   'แอดมินสร้างใบเสร็จรับเงินจากการชำระเงิน',
   'receipt', false, true,
   true,  false,
   true,  false,
   'P2'),
  ('tax_invoice.cancelled',
   'ยกเลิกใบกำกับภาษี',
   'มีการยกเลิกใบกำกับภาษี',
   'tax_invoice', true, true,
   true,  false,
   true,  false,
   'P1')
ON CONFLICT (event_key) DO NOTHING;