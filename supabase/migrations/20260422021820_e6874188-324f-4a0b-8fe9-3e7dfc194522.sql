DELETE FROM notifications WHERE title LIKE 'SMOKE-1c-1%';
DELETE FROM notification_dispatch_log WHERE idempotency_key LIKE 'smoke-1c-1%';