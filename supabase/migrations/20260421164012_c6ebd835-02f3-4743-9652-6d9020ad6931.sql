DELETE FROM notifications WHERE title LIKE 'SMOKE-TM%' OR title LIKE 'SMOKE-1b-1%';
DELETE FROM notification_dispatch_log WHERE idempotency_key IN ('smoke-tm-verify','smoke-1b-1');