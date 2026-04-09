
SELECT cron.schedule('detect-sla-breaches', '*/5 * * * *', 'SELECT public.detect_sla_breaches()');
SELECT cron.schedule('send-followup-reminders', '0 8 * * *', 'SELECT public.send_followup_reminders()');
