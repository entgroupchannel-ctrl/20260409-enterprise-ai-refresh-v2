DELETE FROM notifications WHERE title LIKE 'SMOKE-1c-5%';
DELETE FROM notification_dispatch_log WHERE idempotency_key LIKE 'smoke-1c-5%';
DELETE FROM email_send_log WHERE recipient_email = 'therdpoom@entgroup.co.th' AND created_at > now() - interval '10 minutes' AND (subject LIKE '%SMOKE-1c-5%' OR subject LIKE '%1C-5%');