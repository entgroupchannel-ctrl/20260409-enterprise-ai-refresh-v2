CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_key TEXT NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'none' CHECK (access_level IN ('none', 'view', 'edit')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, permission_key)
);

CREATE INDEX IF NOT EXISTS idx_admin_perms_user ON admin_permissions(user_id);

ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view permissions"
  ON admin_permissions FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage permissions"
  ON admin_permissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view own permissions"
  ON admin_permissions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.get_permission(
  _user_id UUID,
  _permission_key TEXT
) RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT access_level FROM admin_permissions
     WHERE user_id = _user_id AND permission_key = _permission_key),
    CASE
      WHEN has_role(_user_id, 'super_admin') THEN 'edit'
      ELSE 'none'
    END
  )
$$;

CREATE OR REPLACE FUNCTION public.ensure_super_admin_permissions()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  perm TEXT;
  perms TEXT[] := ARRAY[
    'sales.contacts', 'sales.quotes', 'sales.quote_review',
    'sales.chatleads', 'sales.software',
    'product.catalog', 'product.documents',
    'marketing.engagement', 'marketing.subscribers',
    'system.users'
  ];
BEGIN
  IF NEW.role IN ('super_admin', 'admin') THEN
    FOREACH perm IN ARRAY perms LOOP
      INSERT INTO admin_permissions (user_id, permission_key, access_level)
      VALUES (NEW.user_id, perm, CASE WHEN NEW.role = 'super_admin' THEN 'edit' ELSE 'view' END)
      ON CONFLICT (user_id, permission_key) DO UPDATE SET access_level =
        CASE WHEN NEW.role = 'super_admin' THEN 'edit' ELSE EXCLUDED.access_level END;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_permissions ON user_roles;
CREATE TRIGGER trg_auto_permissions
  AFTER INSERT ON user_roles
  FOR EACH ROW EXECUTE FUNCTION public.ensure_super_admin_permissions();

DO $$
DECLARE
  r RECORD;
  perm TEXT;
  perms TEXT[] := ARRAY[
    'sales.contacts', 'sales.quotes', 'sales.quote_review',
    'sales.chatleads', 'sales.software',
    'product.catalog', 'product.documents',
    'marketing.engagement', 'marketing.subscribers',
    'system.users'
  ];
BEGIN
  FOR r IN SELECT user_id, role FROM user_roles WHERE role IN ('super_admin', 'admin') LOOP
    FOREACH perm IN ARRAY perms LOOP
      INSERT INTO admin_permissions (user_id, permission_key, access_level)
      VALUES (r.user_id, perm, CASE WHEN r.role = 'super_admin' THEN 'edit' ELSE 'view' END)
      ON CONFLICT (user_id, permission_key) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;