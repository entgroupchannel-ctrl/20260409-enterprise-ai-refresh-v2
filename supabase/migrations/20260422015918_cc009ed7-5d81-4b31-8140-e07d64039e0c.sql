-- Cleanup smoke test records for File #5 ContactUs
DELETE FROM notifications WHERE title LIKE 'SMOKE-1b-5%';

DELETE FROM notification_dispatch_log WHERE idempotency_key = 'smoke-1b-5';