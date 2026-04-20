
-- ============================================================
-- 1. product_likes — server-side wishlist tracking
-- ============================================================
CREATE TABLE public.product_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  product_id UUID,
  product_model TEXT,
  product_name TEXT,
  liked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reminded_at TIMESTAMPTZ,
  UNIQUE(user_id, product_slug)
);

CREATE INDEX idx_product_likes_user ON public.product_likes(user_id);
CREATE INDEX idx_product_likes_liked_at ON public.product_likes(liked_at DESC);
CREATE INDEX idx_product_likes_pending_reminder
  ON public.product_likes(liked_at)
  WHERE reminded_at IS NULL;

ALTER TABLE public.product_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own likes"
  ON public.product_likes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own likes"
  ON public.product_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON public.product_likes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all likes"
  ON public.product_likes FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 2. product_views — track views for Hot Interest detection
-- ============================================================
CREATE TABLE public.product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  product_id UUID,
  product_model TEXT,
  product_name TEXT,
  duration_seconds INTEGER DEFAULT 0,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_views_user_product
  ON public.product_views(user_id, product_slug, viewed_at DESC);
CREATE INDEX idx_product_views_recent
  ON public.product_views(viewed_at DESC);

ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own views"
  ON public.product_views FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own views"
  ON public.product_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all views"
  ON public.product_views FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 3. product_shares — track social shares
-- ============================================================
CREATE TABLE public.product_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  product_id UUID,
  product_model TEXT,
  product_name TEXT,
  channel TEXT,
  shared_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reminded_at TIMESTAMPTZ
);

CREATE INDEX idx_product_shares_user ON public.product_shares(user_id);
CREATE INDEX idx_product_shares_pending_reminder
  ON public.product_shares(shared_at)
  WHERE reminded_at IS NULL;

ALTER TABLE public.product_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shares"
  ON public.product_shares FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shares"
  ON public.product_shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all shares"
  ON public.product_shares FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 4. reminder_send_log — audit + frequency cap enforcement
-- ============================================================
CREATE TABLE public.reminder_send_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('cart_abandoned','liked','hot_interest','shared')),
  product_slug TEXT,
  product_model TEXT,
  product_name TEXT,
  template_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','failed','skipped')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reminder_log_user ON public.reminder_send_log(user_id, sent_at DESC);
CREATE INDEX idx_reminder_log_user_product
  ON public.reminder_send_log(user_id, product_slug, trigger_type, sent_at DESC);
CREATE INDEX idx_reminder_log_recent ON public.reminder_send_log(sent_at DESC);

ALTER TABLE public.reminder_send_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all reminder logs"
  ON public.reminder_send_log FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own reminder logs"
  ON public.reminder_send_log FOR SELECT
  USING (auth.uid() = user_id);

-- (No INSERT policy — only service role inserts via Edge Function)

-- ============================================================
-- 5. Frequency cap helper function
--    Rules: 1 reminder/product/7 days, max 3 reminders/week per user
-- ============================================================
CREATE OR REPLACE FUNCTION public.should_send_reminder(
  _user_id UUID,
  _product_slug TEXT,
  _trigger_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  product_recent_count INTEGER;
  weekly_count INTEGER;
BEGIN
  -- Cap 1: same product + same trigger sent within last 7 days?
  SELECT COUNT(*) INTO product_recent_count
  FROM reminder_send_log
  WHERE user_id = _user_id
    AND product_slug = _product_slug
    AND trigger_type = _trigger_type
    AND status = 'sent'
    AND sent_at > now() - INTERVAL '7 days';

  IF product_recent_count > 0 THEN
    RETURN FALSE;
  END IF;

  -- Cap 2: max 3 reminder emails/week per user (any product, any trigger)
  SELECT COUNT(*) INTO weekly_count
  FROM reminder_send_log
  WHERE user_id = _user_id
    AND status = 'sent'
    AND sent_at > now() - INTERVAL '7 days';

  IF weekly_count >= 3 THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;
