INSERT INTO public.notifications (user_id, type, title, message, priority, action_url, action_label, link_type, link_id)
SELECT u.id,
       'payment_slip_uploaded',
       'ลูกค้าส่งสลิปการชำระเงินใหม่',
       'INV202604190003 • ฿23,433.00 • รอการตรวจสอบ',
       'high',
       '/admin/invoices/52b6cd70-aa46-4aa4-85d2-4ee44bd3fec0',
       'ตรวจสอบสลิป',
       'invoice',
       '52b6cd70-aa46-4aa4-85d2-4ee44bd3fec0'
FROM public.users u
WHERE u.role IN ('admin','super_admin')
  AND COALESCE(u.is_active, true) = true;