
-- Fix Super Admin Role Confusion
-- therdpume@hotmail.com (test) → member
-- therdpoom@entgroup.co.th (owner) → super_admin

DO $$
DECLARE
  v_therdpoom_id UUID;
  v_therdpume_id UUID;
  v_therdpume_old_role TEXT;
BEGIN
  -- Demote test user
  SELECT id, role INTO v_therdpume_id, v_therdpume_old_role
  FROM public.users WHERE email = 'therdpume@hotmail.com';
  
  IF v_therdpume_id IS NOT NULL AND v_therdpume_old_role = 'super_admin' THEN
    UPDATE public.users SET role = 'member', updated_at = now()
    WHERE id = v_therdpume_id;
    
    INSERT INTO public.audit_logs (action, table_name, record_id, target_email, old_value, new_value, metadata)
    VALUES ('role_fix', 'users', v_therdpume_id, 'therdpume@hotmail.com',
      jsonb_build_object('role', v_therdpume_old_role),
      jsonb_build_object('role', 'member'),
      jsonb_build_object('reason', 'Fix super_admin assigned to test account by mistake'));
    
    RAISE NOTICE 'Demoted therdpume@hotmail.com: % → member', v_therdpume_old_role;
  END IF;

  -- Promote owner
  SELECT id INTO v_therdpoom_id
  FROM public.users WHERE email = 'therdpoom@entgroup.co.th';
  
  IF v_therdpoom_id IS NOT NULL THEN
    UPDATE public.users SET role = 'super_admin', updated_at = now()
    WHERE id = v_therdpoom_id AND role != 'super_admin';
    
    IF FOUND THEN
      INSERT INTO public.audit_logs (action, table_name, record_id, target_email, new_value, metadata)
      VALUES ('role_fix', 'users', v_therdpoom_id, 'therdpoom@entgroup.co.th',
        jsonb_build_object('role', 'super_admin'),
        jsonb_build_object('reason', 'Ensure owner has super_admin role'));
      
      RAISE NOTICE 'Promoted therdpoom@entgroup.co.th → super_admin';
    ELSE
      RAISE NOTICE 'therdpoom@entgroup.co.th already super_admin';
    END IF;
  ELSE
    RAISE NOTICE 'therdpoom@entgroup.co.th not found in public.users yet — will get role on first login';
  END IF;
END $$;
