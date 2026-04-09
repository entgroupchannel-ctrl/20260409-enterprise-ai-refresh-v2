-- Sale Assignment FIFO System

ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS assigned_to UUID;

CREATE INDEX IF NOT EXISTS idx_quote_requests_assigned_to ON quote_requests(assigned_to);

CREATE TABLE IF NOT EXISTS public.sale_assignment_config (
  id TEXT PRIMARY KEY DEFAULT 'fifo',
  last_assigned_user_id UUID,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO sale_assignment_config (id) VALUES ('fifo') ON CONFLICT DO NOTHING;

ALTER TABLE sale_assignment_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read sale config"
  ON sale_assignment_config FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage sale config"
  ON sale_assignment_config FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.get_next_sales_person()
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _last UUID;
  _next UUID;
BEGIN
  SELECT last_assigned_user_id INTO _last
  FROM sale_assignment_config WHERE id = 'fifo';

  SELECT ur.user_id INTO _next
  FROM user_roles ur
  WHERE ur.role IN ('super_admin', 'admin')
    AND (_last IS NULL OR ur.user_id > _last)
  ORDER BY ur.user_id ASC
  LIMIT 1;

  IF _next IS NULL THEN
    SELECT ur.user_id INTO _next
    FROM user_roles ur
    WHERE ur.role IN ('super_admin', 'admin')
    ORDER BY ur.user_id ASC
    LIMIT 1;
  END IF;

  IF _next IS NOT NULL THEN
    UPDATE sale_assignment_config
    SET last_assigned_user_id = _next, updated_at = now()
    WHERE id = 'fifo';
  END IF;

  RETURN _next;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_assign_quote()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'new' AND (NEW.assigned_to IS NULL) THEN
    NEW.assigned_to := public.get_next_sales_person();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_assign_quote_insert ON quote_requests;
CREATE TRIGGER trg_auto_assign_quote_insert
  BEFORE INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_quote();

DROP TRIGGER IF EXISTS trg_auto_assign_quote_update ON quote_requests;
CREATE TRIGGER trg_auto_assign_quote_update
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'new')
  EXECUTE FUNCTION public.auto_assign_quote();

CREATE OR REPLACE FUNCTION public.reassign_quote(_quote_id UUID, _new_admin_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Only super_admin can reassign quotes';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = _new_admin_id AND role IN ('super_admin', 'admin')) THEN
    RAISE EXCEPTION 'Target user is not an admin';
  END IF;
  UPDATE quote_requests SET assigned_to = _new_admin_id WHERE id = _quote_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_sales_team()
RETURNS TABLE(user_id UUID, email TEXT, full_name TEXT, role TEXT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY
  SELECT
    ur.user_id,
    u.email::TEXT,
    COALESCE(p.full_name, u.raw_user_meta_data ->> 'full_name', u.email::TEXT) AS full_name,
    ur.role::TEXT
  FROM user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  LEFT JOIN profiles p ON p.id = ur.user_id
  WHERE ur.role IN ('super_admin', 'admin')
  ORDER BY ur.role DESC, full_name ASC;
END;
$$;