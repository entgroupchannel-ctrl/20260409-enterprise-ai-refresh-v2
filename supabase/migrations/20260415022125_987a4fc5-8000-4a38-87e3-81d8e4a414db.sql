
-- =====================================================
-- Phase 8.0 — Staff/Customer Logical Separation
-- =====================================================

-- PART 0: Fix role state
UPDATE public.users SET role = 'super_admin'
WHERE email = 'therdpoom@entgroup.co.th' AND role != 'super_admin';

UPDATE public.users SET role = 'member'
WHERE email = 'therdpume@hotmail.com' AND role != 'member';

-- Update signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_role TEXT;
BEGIN
  IF NEW.email = 'therdpoom@entgroup.co.th' THEN
    v_role := 'super_admin';
  ELSE
    v_role := 'member';
  END IF;

  INSERT INTO public.users (
    id, email, full_name, role, is_active,
    phone, company, created_at
  ) VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    v_role, true,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'company',
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = CASE 
      WHEN EXCLUDED.email = 'therdpoom@entgroup.co.th' THEN 'super_admin'
      ELSE public.users.role
    END;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- PART 1: staff_details table
CREATE TABLE IF NOT EXISTS public.staff_details (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  employee_code TEXT UNIQUE,
  position TEXT,
  department TEXT,
  hire_date DATE,
  manager_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  signature_url TEXT,
  line_work_id TEXT,
  work_phone TEXT,
  work_email TEXT,
  emergency_contact JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_details_department ON public.staff_details(department);
CREATE INDEX IF NOT EXISTS idx_staff_details_manager ON public.staff_details(manager_id);
CREATE INDEX IF NOT EXISTS idx_staff_details_employee_code ON public.staff_details(employee_code);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.trg_staff_details_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_staff_details_updated_at ON public.staff_details;
CREATE TRIGGER trg_staff_details_updated_at
BEFORE UPDATE ON public.staff_details
FOR EACH ROW EXECUTE FUNCTION public.trg_staff_details_updated_at();

-- PART 2: Role mutex enforcement
CREATE OR REPLACE FUNCTION public.enforce_staff_role_mutex()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE v_role TEXT;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = NEW.user_id;
  IF v_role IS NULL THEN RAISE EXCEPTION 'User % not found', NEW.user_id; END IF;
  IF v_role = 'member' THEN
    RAISE EXCEPTION 'Cannot create staff_details for user with role = member. User: %',
      (SELECT email FROM public.users WHERE id = NEW.user_id);
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_enforce_staff_role_mutex ON public.staff_details;
CREATE TRIGGER trg_enforce_staff_role_mutex
BEFORE INSERT OR UPDATE ON public.staff_details
FOR EACH ROW EXECUTE FUNCTION public.enforce_staff_role_mutex();

-- PART 3: Cascade role demotion
CREATE OR REPLACE FUNCTION public.cascade_role_to_staff_details()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  IF OLD.role != 'member' AND NEW.role = 'member' THEN
    DELETE FROM public.staff_details WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_cascade_role_to_staff_details ON public.users;
CREATE TRIGGER trg_cascade_role_to_staff_details
AFTER UPDATE OF role ON public.users
FOR EACH ROW EXECUTE FUNCTION public.cascade_role_to_staff_details();

-- PART 4: RLS on staff_details
ALTER TABLE public.staff_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_details_staff_read" ON public.staff_details
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role IN ('super_admin','admin','sales','accountant','warehouse','viewer')
      AND is_active = true
  ));

CREATE POLICY "staff_details_own_read" ON public.staff_details
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "staff_details_admin_write" ON public.staff_details
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('super_admin','admin') AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('super_admin','admin') AND is_active = true
  ));

CREATE POLICY "staff_details_own_update_limited" ON public.staff_details
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- PART 5: staff_members VIEW
CREATE OR REPLACE VIEW public.staff_members AS
SELECT 
  u.id, u.email, u.full_name, u.phone, u.company,
  u.role, u.is_active, u.avatar_url, u.last_login,
  u.created_at, u.updated_at,
  sd.employee_code, sd.position, sd.department,
  sd.hire_date, sd.manager_id, sd.signature_url,
  sd.work_phone, sd.work_email, sd.line_work_id,
  sd.notes AS staff_notes
FROM public.users u
LEFT JOIN public.staff_details sd ON u.id = sd.user_id
WHERE u.role IN ('super_admin','admin','sales','accountant','warehouse','viewer');

GRANT SELECT ON public.staff_members TO authenticated;

-- PART 6: customers VIEW
CREATE OR REPLACE VIEW public.customers AS
SELECT 
  u.id, u.email, u.full_name, u.phone, u.company,
  u.is_active, u.avatar_url, u.last_login,
  u.created_at, u.updated_at,
  up.company_name, up.company_tax_id, up.company_address,
  up.company_phone, up.contact_name, up.contact_position,
  up.contact_phone, up.contact_email, up.contact_line,
  up.billing_address, up.billing_district, up.billing_city,
  up.billing_province, up.billing_postal_code,
  up.shipping_address, up.payment_terms, up.delivery_method
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
WHERE u.role = 'member';

GRANT SELECT ON public.customers TO authenticated;

-- PART 7: Backfill staff_details for existing staff
INSERT INTO public.staff_details (user_id)
SELECT id FROM public.users
WHERE role != 'member'
  AND id NOT IN (SELECT user_id FROM public.staff_details)
ON CONFLICT (user_id) DO NOTHING;
