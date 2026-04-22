DELETE FROM notifications WHERE title LIKE 'SMOKE-STEP1%';
DELETE FROM notification_dispatch_log WHERE idempotency_key = 'smoke-step1-pdfurl';