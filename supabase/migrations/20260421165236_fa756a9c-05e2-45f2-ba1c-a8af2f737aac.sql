DELETE FROM notifications WHERE title LIKE 'SMOKE-1b-3%';
DELETE FROM notification_dispatch_log WHERE idempotency_key = 'smoke-1b-3';
DELETE FROM email_send_log WHERE subject LIKE '%SMOKE-1b-3%' OR (template_name='quote-status-po.uploaded' AND subject LIKE '%QT-SMOKE-PO-003%');