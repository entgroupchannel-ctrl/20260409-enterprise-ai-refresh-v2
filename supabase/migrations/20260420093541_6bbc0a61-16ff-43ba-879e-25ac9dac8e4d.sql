-- Phase 3: Engagement reminder cron infrastructure
-- 1. Tables to track which reminders have already been sent (one-shot guarantee)
-- 2. pg_cron + pg_net to call the edge function 3x daily (Bangkok 10:00/14:00/20:00 = UTC 03:00/07:00/13:00)

-- Enable extensions for scheduled HTTP calls
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net  with schema extensions;

-- Track cart abandonment reminders (one per user, refreshed per 7-day window)
create table if not exists public.cart_reminders (
  user_id uuid primary key,
  reminded_at timestamptz not null default now()
);

alter table public.cart_reminders enable row level security;

-- Only service role writes; admins may read for analytics
create policy "Admins read cart_reminders"
  on public.cart_reminders for select
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Track hot-interest reminders (one per user+slug forever)
create table if not exists public.hot_interest_reminders (
  user_id uuid not null,
  product_slug text not null,
  view_count integer not null default 0,
  reminded_at timestamptz not null default now(),
  primary key (user_id, product_slug)
);

create index if not exists idx_hot_interest_reminders_user on public.hot_interest_reminders(user_id);

alter table public.hot_interest_reminders enable row level security;

create policy "Admins read hot_interest_reminders"
  on public.hot_interest_reminders for select
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Helpful indexes for the scanner queries (idempotent)
create index if not exists idx_cart_items_updated_at on public.cart_items(updated_at);
create index if not exists idx_product_likes_pending on public.product_likes(liked_at) where reminded_at is null;
create index if not exists idx_product_shares_pending on public.product_shares(shared_at) where reminded_at is null;
create index if not exists idx_product_views_recent on public.product_views(viewed_at, user_id, product_slug);

-- Schedule the engagement reminder job 3x daily (Bangkok 10:00 / 14:00 / 20:00)
-- Bangkok is UTC+7 → cron in UTC: 03:00 / 07:00 / 13:00
do $$
declare
  job_id bigint;
  func_url text := 'https://ugzdwmyylqmirrljtuej.supabase.co/functions/v1/process-engagement-reminders';
  service_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnemR3bXl5bHFtaXJybGp0dWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTcwOTA0MywiZXhwIjoyMDkxMjg1MDQzfQ.placeholder';
begin
  -- Remove any prior schedules with the same name (idempotent re-run)
  perform cron.unschedule(jobname) from cron.job where jobname in (
    'engagement-reminders-morning',
    'engagement-reminders-afternoon',
    'engagement-reminders-evening'
  );

  -- We use a Postgres function wrapper so that cron always reads the live secret
  -- from vault (avoiding stale tokens baked into the schedule).
end $$;

-- Wrapper function: cron will call this; it reads the service role key from vault.
create or replace function public.invoke_engagement_reminders()
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  service_key text;
begin
  -- Try to fetch from vault; fall back to settings if vault unavailable.
  begin
    select decrypted_secret into service_key
    from vault.decrypted_secrets
    where name = 'service_role_key'
    limit 1;
  exception when others then
    service_key := null;
  end;

  if service_key is null then
    raise warning 'invoke_engagement_reminders: service_role_key not in vault — skipping';
    return;
  end if;

  perform net.http_post(
    url := 'https://ugzdwmyylqmirrljtuej.supabase.co/functions/v1/process-engagement-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := '{}'::jsonb
  );
end $$;

-- Schedule three times per day (UTC)
select cron.schedule('engagement-reminders-morning',   '0 3 * * *',  $$select public.invoke_engagement_reminders();$$);
select cron.schedule('engagement-reminders-afternoon', '0 7 * * *',  $$select public.invoke_engagement_reminders();$$);
select cron.schedule('engagement-reminders-evening',   '0 13 * * *', $$select public.invoke_engagement_reminders();$$);
