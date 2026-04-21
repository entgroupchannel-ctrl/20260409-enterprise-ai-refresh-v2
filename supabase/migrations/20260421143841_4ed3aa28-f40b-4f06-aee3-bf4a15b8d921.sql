-- Temporary results table (will inspect via read_query)
DROP TABLE IF EXISTS public.smoke_test_results_p02;
CREATE TABLE public.smoke_test_results_p02 (
  test_name text PRIMARY KEY,
  recipients_count integer,
  enqueued_count integer,
  skipped_count integer,
  dispatch_id uuid,
  ran_at timestamptz DEFAULT now()
);

-- S1: admin role broadcast (expect recipients=5)
WITH r AS (
  SELECT * FROM public.dispatch_notification_event(
    p_event_key := 'quote.requested',
    p_recipient_role := 'admin',
    p_title := 'SMOKE-S1-admin-broadcast',
    p_message := 'D-lite test S1',
    p_link_type := 'quote',
    p_link_id := gen_random_uuid()::text
  )
)
INSERT INTO public.smoke_test_results_p02
SELECT 'S1_admin_role', recipients_count, enqueued_count, skipped_count, dispatch_id FROM r;

-- S2: super_admin role (expect recipients=1)
WITH r AS (
  SELECT * FROM public.dispatch_notification_event(
    p_event_key := 'quote.sent',
    p_recipient_role := 'super_admin',
    p_title := 'SMOKE-S2-super-admin',
    p_message := 'D-lite test S2',
    p_link_type := 'quote',
    p_link_id := gen_random_uuid()::text
  )
)
INSERT INTO public.smoke_test_results_p02
SELECT 'S2_super_admin_role', recipients_count, enqueued_count, skipped_count, dispatch_id FROM r;

-- S3: specific user_id (expect recipients=1)
WITH r AS (
  SELECT * FROM public.dispatch_notification_event(
    p_event_key := 'po.uploaded',
    p_recipient_user_id := '32dca526-8026-4188-bcd4-852bc7acdc2c'::uuid,
    p_title := 'SMOKE-S3-specific-user',
    p_message := 'D-lite test S3',
    p_link_type := 'po',
    p_link_id := gen_random_uuid()::text
  )
)
INSERT INTO public.smoke_test_results_p02
SELECT 'S3_specific_user', recipients_count, enqueued_count, skipped_count, dispatch_id FROM r;

-- S4: invalid event_key with safe_mode=true (expect 0,0,0 + WARNING in postgres logs, no exception)
WITH r AS (
  SELECT * FROM public.dispatch_notification_event(
    p_event_key := 'nonexistent.event.key',
    p_recipient_role := 'admin',
    p_title := 'SMOKE-S4-invalid-event',
    p_safe_mode := true
  )
)
INSERT INTO public.smoke_test_results_p02
SELECT 'S4_invalid_event_safemode', recipients_count, enqueued_count, skipped_count, dispatch_id FROM r;

-- S5: non-UUID link_id with valid event (Layer 5 stress test — expect cast→NULL, no error)
WITH r AS (
  SELECT * FROM public.dispatch_notification_event(
    p_event_key := 'quote.requested',
    p_recipient_role := 'super_admin',
    p_title := 'SMOKE-S5-nonuuid-linkid',
    p_message := 'Layer 5 stress test',
    p_link_type := 'quote',
    p_link_id := 'not-a-uuid-at-all'
  )
)
INSERT INTO public.smoke_test_results_p02
SELECT 'S5_nonuuid_link_id', recipients_count, enqueued_count, skipped_count, dispatch_id FROM r;