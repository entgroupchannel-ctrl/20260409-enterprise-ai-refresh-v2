
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_type TEXT NOT NULL DEFAULT 'customer'
    CHECK (contact_type IN ('customer', 'supplier', 'both')),
  entity_type TEXT NOT NULL DEFAULT 'juristic'
    CHECK (entity_type IN ('individual', 'juristic')),
  contact_code TEXT,
  company_name TEXT NOT NULL,
  business_location TEXT,
  address TEXT,
  postal_code TEXT,
  tax_id TEXT,
  branch_code TEXT,
  branch_type TEXT
    CHECK (branch_type IS NULL OR branch_type IN ('head_office', 'branch')),
  branch_name TEXT,
  contact_name TEXT,
  contact_position TEXT,
  email TEXT,
  mobile_phone TEXT,
  office_phone TEXT,
  fax TEXT,
  line_id TEXT,
  website TEXT,
  credit_days INT DEFAULT 0,
  payment_terms TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id),
  imported_from TEXT,
  imported_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contacts_company_name 
  ON public.contacts USING gin(to_tsvector('simple', company_name));
CREATE INDEX IF NOT EXISTS idx_contacts_company_name_btree 
  ON public.contacts(company_name);
CREATE INDEX IF NOT EXISTS idx_contacts_contact_name 
  ON public.contacts(contact_name) WHERE contact_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_type 
  ON public.contacts(contact_type) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_contacts_active 
  ON public.contacts(is_active);
CREATE INDEX IF NOT EXISTS idx_contacts_tax_id 
  ON public.contacts(tax_id) WHERE tax_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_email 
  ON public.contacts(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_code 
  ON public.contacts(contact_code) WHERE contact_code IS NOT NULL;

-- Auto-update timestamp
DROP TRIGGER IF EXISTS trg_contacts_updated_at ON public.contacts;
CREATE TRIGGER trg_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts_read_admin_sales" 
  ON public.contacts FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'sales'))
  );

CREATE POLICY "contacts_insert_admin_sales" 
  ON public.contacts FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'sales'))
  );

CREATE POLICY "contacts_update_admin_sales" 
  ON public.contacts FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'sales'))
  );

CREATE POLICY "contacts_delete_admin" 
  ON public.contacts FOR DELETE 
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

COMMENT ON TABLE public.contacts IS 'Customer/Supplier contact book — standalone CRM';
