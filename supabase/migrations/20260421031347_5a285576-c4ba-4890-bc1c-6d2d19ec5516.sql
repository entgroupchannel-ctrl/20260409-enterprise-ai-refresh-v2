-- Add chat.message_received event to registry
INSERT INTO public.notification_events (
  event_key, category, display_name, description, priority,
  notify_customer_email, notify_customer_in_app, notify_admin_email, notify_admin_in_app,
  is_critical, is_active
) VALUES (
  'chat.message_received', 'chat', 'มีข้อความใหม่ในแชท', 'แจ้งเตือนเมื่อมีข้อความใหม่ในห้องสนทนา', 'P2',
  false, true, false, true,
  false, true
) ON CONFLICT (event_key) DO NOTHING;