DELETE FROM public.notifications WHERE title LIKE 'SMOKE-1b-9%';
DELETE FROM public.notification_dispatch_log WHERE idempotency_key LIKE 'smoke-1b-9%';