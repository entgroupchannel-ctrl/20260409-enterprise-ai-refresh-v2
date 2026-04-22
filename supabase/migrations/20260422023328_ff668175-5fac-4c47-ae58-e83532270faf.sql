DELETE FROM notifications WHERE title LIKE 'SMOKE-1c-3%';
DELETE FROM notification_dispatch_log WHERE idempotency_key = 'smoke-1c-3';