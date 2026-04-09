CREATE OR REPLACE FUNCTION public.lookup_user_by_email(_email TEXT)
RETURNS TABLE(user_id UUID, email TEXT, created_at TIMESTAMPTZ)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, email::TEXT, created_at
  FROM auth.users
  WHERE email = _email
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.lookup_user_by_email(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_user_by_email(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  role TEXT,
  role_created_at TIMESTAMPTZ,
  user_created_at TIMESTAMPTZ
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    ur.user_id,
    au.email::TEXT,
    ur.role::TEXT,
    ur.created_at AS role_created_at,
    au.created_at AS user_created_at
  FROM user_roles ur
  JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role IN ('super_admin', 'admin', 'moderator')
  ORDER BY ur.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_admin_users() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_users() TO authenticated;

CREATE OR REPLACE FUNCTION public.remove_admin_user(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM user_roles WHERE user_id = _user_id AND role = 'super_admin') THEN
    RETURN false;
  END IF;

  DELETE FROM admin_permissions WHERE user_id = _user_id;
  DELETE FROM user_roles WHERE user_id = _user_id AND role IN ('admin', 'moderator');
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.remove_admin_user(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.remove_admin_user(UUID) TO authenticated;