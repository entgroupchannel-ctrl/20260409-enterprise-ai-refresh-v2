BEGIN;

-- PART 0: Fix therdpoom super_admin
UPDATE public.users SET role = 'super_admin' WHERE email = 'therdpoom@entgroup.co.th';

-- PART 1: audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  actor_role TEXT,
  action TEXT NOT NULL CHECK (action IN (
    'role_changed','user_activated','user_deactivated',
    'permission_override_added','permission_override_updated','permission_override_removed',
    'user_created','user_deleted','login_success','login_failed',
    'password_changed','settings_changed'
  )),
  target_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  target_email TEXT,
  table_name TEXT,
  record_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON public.audit_logs(target_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_super_admin_read" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "audit_logs_self_read" ON public.audit_logs FOR SELECT TO authenticated
  USING (target_user_id = auth.uid() OR actor_id = auth.uid());

-- PART 2: login_history table
CREATE TABLE IF NOT EXISTS public.login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_login_history_user ON public.login_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_history_created ON public.login_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_history_email ON public.login_history(email);

ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "login_history_super_admin_read" ON public.login_history FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "login_history_own_read" ON public.login_history FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "login_history_self_insert" ON public.login_history FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- PART 3: Audit helper function
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action TEXT,
  p_target_user_id UUID DEFAULT NULL,
  p_table_name TEXT DEFAULT NULL,
  p_record_id UUID DEFAULT NULL,
  p_old_value JSONB DEFAULT NULL,
  p_new_value JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_audit_id UUID;
  v_actor_email TEXT;
  v_actor_role TEXT;
  v_target_email TEXT;
BEGIN
  SELECT email, role INTO v_actor_email, v_actor_role FROM public.users WHERE id = auth.uid();
  IF p_target_user_id IS NOT NULL THEN
    SELECT email INTO v_target_email FROM public.users WHERE id = p_target_user_id;
  END IF;
  INSERT INTO public.audit_logs (
    actor_id, actor_email, actor_role, action,
    target_user_id, target_email, table_name, record_id,
    old_value, new_value, metadata
  ) VALUES (
    auth.uid(), v_actor_email, v_actor_role, p_action,
    p_target_user_id, v_target_email, p_table_name, p_record_id,
    p_old_value, p_new_value, COALESCE(p_metadata, '{}'::jsonb)
  ) RETURNING id INTO v_audit_id;
  RETURN v_audit_id;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'log_audit_event failed: %', SQLERRM;
  RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_audit_event TO authenticated;

-- PART 4: Auto-log triggers

CREATE OR REPLACE FUNCTION public.trg_audit_user_role_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    PERFORM public.log_audit_event('role_changed', NEW.id, 'users', NEW.id,
      jsonb_build_object('role', OLD.role), jsonb_build_object('role', NEW.role));
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_audit_user_role_change ON public.users;
CREATE TRIGGER trg_audit_user_role_change AFTER UPDATE OF role ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.trg_audit_user_role_change();

CREATE OR REPLACE FUNCTION public.trg_audit_user_active_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  IF OLD.is_active IS DISTINCT FROM NEW.is_active THEN
    PERFORM public.log_audit_event(
      CASE WHEN NEW.is_active THEN 'user_activated' ELSE 'user_deactivated' END,
      NEW.id, 'users', NEW.id,
      jsonb_build_object('is_active', OLD.is_active), jsonb_build_object('is_active', NEW.is_active));
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_audit_user_active_change ON public.users;
CREATE TRIGGER trg_audit_user_active_change AFTER UPDATE OF is_active ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.trg_audit_user_active_change();

CREATE OR REPLACE FUNCTION public.trg_audit_permission_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  PERFORM public.log_audit_event('permission_override_added', NEW.user_id, 'user_permissions', NEW.id,
    NULL, jsonb_build_object('module', NEW.module, 'permission', NEW.permission));
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_audit_permission_insert ON public.user_permissions;
CREATE TRIGGER trg_audit_permission_insert AFTER INSERT ON public.user_permissions
  FOR EACH ROW EXECUTE FUNCTION public.trg_audit_permission_insert();

CREATE OR REPLACE FUNCTION public.trg_audit_permission_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  IF OLD.permission IS DISTINCT FROM NEW.permission THEN
    PERFORM public.log_audit_event('permission_override_updated', NEW.user_id, 'user_permissions', NEW.id,
      jsonb_build_object('module', OLD.module, 'permission', OLD.permission),
      jsonb_build_object('module', NEW.module, 'permission', NEW.permission));
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_audit_permission_update ON public.user_permissions;
CREATE TRIGGER trg_audit_permission_update AFTER UPDATE ON public.user_permissions
  FOR EACH ROW EXECUTE FUNCTION public.trg_audit_permission_update();

CREATE OR REPLACE FUNCTION public.trg_audit_permission_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  PERFORM public.log_audit_event('permission_override_removed', OLD.user_id, 'user_permissions', OLD.id,
    jsonb_build_object('module', OLD.module, 'permission', OLD.permission), NULL);
  RETURN OLD;
END; $$;

DROP TRIGGER IF EXISTS trg_audit_permission_delete ON public.user_permissions;
CREATE TRIGGER trg_audit_permission_delete AFTER DELETE ON public.user_permissions
  FOR EACH ROW EXECUTE FUNCTION public.trg_audit_permission_delete();

-- PART 5: Client RPCs

CREATE OR REPLACE FUNCTION public.log_login_event(
  p_success BOOLEAN,
  p_failure_reason TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE v_id UUID; v_email TEXT;
BEGIN
  SELECT email INTO v_email FROM public.users WHERE id = auth.uid();
  IF v_email IS NULL THEN RETURN NULL; END IF;
  INSERT INTO public.login_history (user_id, email, success, failure_reason, ip_address, user_agent)
  VALUES (auth.uid(), v_email, p_success, p_failure_reason, p_ip_address, p_user_agent)
  RETURNING id INTO v_id;
  IF p_success THEN
    PERFORM public.log_audit_event('login_success', auth.uid(), 'auth', auth.uid(), NULL,
      jsonb_build_object('ip', p_ip_address, 'user_agent', p_user_agent));
  END IF;
  RETURN v_id;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'log_login_event failed: %', SQLERRM;
  RETURN NULL;
END; $$;

GRANT EXECUTE ON FUNCTION public.log_login_event TO authenticated;

CREATE OR REPLACE FUNCTION public.get_user_audit_logs(p_user_id UUID, p_limit INT DEFAULT 20)
RETURNS TABLE (
  id UUID, actor_id UUID, actor_email TEXT, actor_role TEXT,
  action TEXT, target_user_id UUID, target_email TEXT,
  old_value JSONB, new_value JSONB, created_at TIMESTAMPTZ
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public' AS $$
  SELECT a.id, a.actor_id, a.actor_email, a.actor_role,
    a.action, a.target_user_id, a.target_email,
    a.old_value, a.new_value, a.created_at
  FROM public.audit_logs a
  WHERE a.target_user_id = p_user_id OR a.actor_id = p_user_id
  ORDER BY a.created_at DESC LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_audit_logs(UUID, INT) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_user_login_history(p_user_id UUID, p_limit INT DEFAULT 20)
RETURNS TABLE (
  id UUID, success BOOLEAN, failure_reason TEXT,
  ip_address TEXT, user_agent TEXT, created_at TIMESTAMPTZ
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public' AS $$
  SELECT lh.id, lh.success, lh.failure_reason,
    lh.ip_address, lh.user_agent, lh.created_at
  FROM public.login_history lh
  WHERE lh.user_id = p_user_id
  ORDER BY lh.created_at DESC LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_login_history(UUID, INT) TO authenticated;

COMMIT;