DELETE FROM notifications WHERE title LIKE 'SMOKE-1b-2%';
DELETE FROM notification_dispatch_log WHERE idempotency_key = 'smoke-1b-2';