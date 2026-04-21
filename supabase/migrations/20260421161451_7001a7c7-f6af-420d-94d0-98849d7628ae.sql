DELETE FROM public.notifications WHERE title = 'SMOKE-FIX-1';
DELETE FROM public.notification_dispatch_log WHERE idempotency_key = 'smoke-fix-1';