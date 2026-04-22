DELETE FROM notifications WHERE title LIKE 'SMOKE-2a-3%';
DELETE FROM notification_dispatch_log WHERE idempotency_key = 'smoke-2a-3';
DELETE FROM email_send_log
 WHERE created_at > now() - interval '10 minutes'
   AND (subject ILIKE '%SMOKE-2a-3%' OR subject ILIKE '%CN-2A-3%');