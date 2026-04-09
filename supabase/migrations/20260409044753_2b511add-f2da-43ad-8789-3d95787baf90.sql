
-- Fix search_path for all functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.generate_quote_number() SET search_path = public;
ALTER FUNCTION public.set_sla_timestamps() SET search_path = public;
ALTER FUNCTION public.create_quote_notification() SET search_path = public;
