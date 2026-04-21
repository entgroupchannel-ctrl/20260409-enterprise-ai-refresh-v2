-- ─────────────────────────────────────────────────────────
-- notification_preferences: ลูกค้าเลือกปิด/เปิด event ที่ไม่ critical
-- ─────────────────────────────────────────────────────────
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_key TEXT NOT NULL REFERENCES public.notification_events(event_key) ON DELETE CASCADE,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  in_app_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_key)
);

CREATE INDEX idx_notification_prefs_user ON public.notification_preferences(user_id);

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own preferences"
  ON public.notification_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins read all preferences"
  ON public.notification_preferences FOR SELECT
  TO authenticated
  USING (public.is_admin_or_above(auth.uid()));

-- ─────────────────────────────────────────────────────────
-- Helper: เช็คว่า user เปิดรับ event นี้ทางช่องทางนี้ไหม
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.notification_is_enabled_for_user(
  p_user_id UUID,
  p_event_key TEXT,
  p_channel TEXT  -- 'email' หรือ 'in_app'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_critical BOOLEAN;
  v_pref RECORD;
BEGIN
  SELECT is_critical INTO v_is_critical
  FROM public.notification_events
  WHERE event_key = p_event_key AND is_active = true;

  IF v_is_critical IS NULL THEN RETURN false; END IF;
  IF v_is_critical THEN RETURN true; END IF;  -- ปิดไม่ได้

  SELECT email_enabled, in_app_enabled INTO v_pref
  FROM public.notification_preferences
  WHERE user_id = p_user_id AND event_key = p_event_key;

  IF NOT FOUND THEN RETURN true; END IF;  -- default opt-in

  IF p_channel = 'email'  THEN RETURN v_pref.email_enabled;  END IF;
  IF p_channel = 'in_app' THEN RETURN v_pref.in_app_enabled; END IF;
  RETURN true;
END;
$$;