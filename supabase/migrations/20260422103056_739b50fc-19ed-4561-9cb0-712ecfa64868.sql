DELETE FROM public.notification_events
 WHERE event_key IN ('credit_note.created', 'quote.cancelled')
   AND is_active = false;