DROP TABLE IF EXISTS public.smoke_test_results_p02;
DELETE FROM public.notifications WHERE title LIKE 'SMOKE-%';
DELETE FROM public.notification_dispatch_log
WHERE event_key IN ('quote.requested','quote.sent','po.uploaded','nonexistent.event.key')
  AND created_at > now() - interval '10 minutes'
  AND payload->>'title' LIKE 'SMOKE-%';