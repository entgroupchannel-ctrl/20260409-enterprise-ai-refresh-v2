ALTER TABLE public.notification_dispatch_log
  ALTER COLUMN admin_email_status DROP DEFAULT,
  ALTER COLUMN customer_email_status DROP DEFAULT,
  ALTER COLUMN admin_in_app_status DROP DEFAULT,
  ALTER COLUMN customer_in_app_status DROP DEFAULT;