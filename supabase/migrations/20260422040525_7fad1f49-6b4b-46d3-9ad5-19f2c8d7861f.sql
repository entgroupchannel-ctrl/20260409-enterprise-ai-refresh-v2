DELETE FROM notifications WHERE title LIKE 'SMOKE-2a-1%';
DELETE FROM notification_dispatch_log WHERE idempotency_key = 'smoke-2a-1';