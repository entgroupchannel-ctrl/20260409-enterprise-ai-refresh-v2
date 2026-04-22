DELETE FROM notifications WHERE title LIKE 'SMOKE-2a-2%';
DELETE FROM notification_dispatch_log WHERE idempotency_key = 'smoke-2a-2';
DELETE FROM email_send_log WHERE recipient_email = 'therdpoom@entgroup.co.th' AND created_at > now() - interval '5 minutes' AND (subject ILIKE '%SMOKE-2a-2%' OR subject ILIKE '%SO-2A-2%');