INSERT INTO public.notification_events
  (event_key, display_name, description, category, is_critical, is_active,
   notify_admin_in_app, notify_admin_email,
   notify_customer_in_app, notify_customer_email,
   priority)
VALUES
  ('transfer.approval_requested',
   'คำขอโอนเงินต่างประเทศรออนุมัติ',
   'แอดมินส่งคำขอโอนเงินต่างประเทศและรอการอนุมัติจาก Super Admin',
   'transfer', true, true,
   true,  false,
   false, false,
   'P1')
ON CONFLICT (event_key) DO NOTHING;