SELECT cron.schedule(
  'po-sla-detect',
  '*/15 * * * *',
  $$SELECT public.detect_po_sla_breaches();$$
);