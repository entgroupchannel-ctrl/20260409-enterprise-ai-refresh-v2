DELETE FROM public.notifications
 WHERE title LIKE 'SMOKE-1%' 
    OR title LIKE 'SMOKE-2%' 
    OR title LIKE 'SMOKE-3%'
    OR title LIKE 'SMOKE-4%';

DELETE FROM public.notification_dispatch_log
 WHERE idempotency_key IN (
   'smoke-1-admin-only',
   'smoke-2-customer-userid',
   'smoke-3-customer-email'
 );