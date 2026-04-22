-- Cleanup smoke test records for File #7 QuickRFQForm
DELETE FROM notifications WHERE title LIKE 'SMOKE-1b-7%';

DELETE FROM notification_dispatch_log WHERE idempotency_key = 'smoke-1b-7';