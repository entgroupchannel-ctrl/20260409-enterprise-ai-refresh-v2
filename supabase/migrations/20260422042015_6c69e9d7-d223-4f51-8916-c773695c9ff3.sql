DELETE FROM public.notifications WHERE title = 'EMERGENCY-RESTORE production verify';
DELETE FROM public.notification_dispatch_log WHERE idempotency_key IN ('emergency-restore-verify','resume-verify-tm');
DELETE FROM public.email_send_log WHERE created_at > now() - interval '15 minutes' AND template_name = 'quote-status-payment.slip_uploaded';