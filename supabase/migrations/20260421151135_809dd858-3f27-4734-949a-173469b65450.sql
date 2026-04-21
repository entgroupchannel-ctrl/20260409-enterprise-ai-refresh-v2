-- ════════════════════════════════════════════════════════════
-- Fix A: SECURITY DEFINER RPC for admin emails (bypass RLS)
-- ════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.get_admin_emails()
RETURNS TABLE(email text)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT u.email
    FROM public.users u
   WHERE u.role IN ('admin','super_admin')
     AND u.is_active = true
     AND u.email IS NOT NULL;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_emails() TO authenticated, anon;

COMMENT ON FUNCTION public.get_admin_emails IS
  'Returns admin emails bypassing RLS. Used by notifyAdminsByEmail from customer/guest clients.';

-- ════════════════════════════════════════════════════════════
-- Fix B: Drop duplicate notification triggers on quote_requests
-- Verified: both trigger functions are notification-only (no side effects)
-- Frontend dispatcher (notifyAdmins → quote.requested) is now the single source of truth
-- ════════════════════════════════════════════════════════════
DROP TRIGGER IF EXISTS trg_notify_new_quote ON public.quote_requests;
DROP TRIGGER IF EXISTS trg_notify_quote_created ON public.quote_requests;

-- Functions left intact (harmless, can be cleaned later if confirmed unused elsewhere)