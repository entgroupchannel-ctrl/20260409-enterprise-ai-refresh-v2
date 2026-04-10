
-- =============================================
-- 1. Create quote_revisions table
-- =============================================
CREATE TABLE public.quote_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  
  revision_number INTEGER NOT NULL,
  revision_type TEXT NOT NULL DEFAULT 'initial',
  
  created_by UUID,
  created_by_name TEXT NOT NULL DEFAULT 'System',
  created_by_role TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT now(),
  
  products JSONB NOT NULL DEFAULT '[]',
  free_items JSONB DEFAULT '[]',
  
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  vat_percent NUMERIC(5,2) DEFAULT 7,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  change_reason TEXT,
  customer_message TEXT,
  
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  approval_status TEXT DEFAULT 'none',
  
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  
  valid_until DATE,
  internal_notes TEXT,
  
  UNIQUE(quote_id, revision_number)
);

CREATE INDEX idx_quote_revisions_quote ON quote_revisions(quote_id, revision_number);
CREATE INDEX idx_quote_revisions_status ON quote_revisions(status);

ALTER TABLE public.quote_revisions ENABLE ROW LEVEL SECURITY;

-- Admin/Sales full access
CREATE POLICY "revisions_admin_all" ON public.quote_revisions
  FOR ALL TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin'::text, 'sales'::text]))
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin'::text, 'sales'::text]));

-- Customer can view revisions for their own quotes
CREATE POLICY "revisions_customer_select" ON public.quote_revisions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM quote_requests qr
    JOIN users u ON u.email = qr.customer_email
    WHERE qr.id = quote_revisions.quote_id AND u.id = auth.uid()
  ));

-- =============================================
-- 2. Create quote_negotiation_requests table
-- =============================================
CREATE TABLE public.quote_negotiation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  revision_id UUID REFERENCES quote_revisions(id),
  
  requested_by UUID,
  requested_by_role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT now(),
  
  request_type TEXT NOT NULL DEFAULT 'other',
  
  requested_discount_percent NUMERIC(5,2),
  requested_discount_amount NUMERIC(12,2),
  requested_free_items JSONB DEFAULT '[]',
  
  message TEXT NOT NULL,
  
  status TEXT DEFAULT 'pending',
  admin_response TEXT,
  responded_by UUID,
  responded_at TIMESTAMPTZ,
  resulted_in_revision_id UUID REFERENCES quote_revisions(id)
);

CREATE INDEX idx_negotiation_quote ON quote_negotiation_requests(quote_id);
CREATE INDEX idx_negotiation_status ON quote_negotiation_requests(status);

ALTER TABLE public.quote_negotiation_requests ENABLE ROW LEVEL SECURITY;

-- Admin/Sales full access
CREATE POLICY "negotiation_admin_all" ON public.quote_negotiation_requests
  FOR ALL TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin'::text, 'sales'::text]))
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin'::text, 'sales'::text]));

-- Customer can view their own
CREATE POLICY "negotiation_customer_select" ON public.quote_negotiation_requests
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM quote_requests qr
    JOIN users u ON u.email = qr.customer_email
    WHERE qr.id = quote_negotiation_requests.quote_id AND u.id = auth.uid()
  ));

-- Customer can insert negotiation requests
CREATE POLICY "negotiation_customer_insert" ON public.quote_negotiation_requests
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM quote_requests qr
    JOIN users u ON u.email = qr.customer_email
    WHERE qr.id = quote_negotiation_requests.quote_id AND u.id = auth.uid()
  ));

-- =============================================
-- 3. Alter quote_requests — add new columns
-- =============================================
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS current_revision_id UUID,
  ADD COLUMN IF NOT EXISTS current_revision_number INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_revisions INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS negotiation_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS free_items JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accepted_by UUID,
  ADD COLUMN IF NOT EXISTS expired_at TIMESTAMPTZ;

-- =============================================
-- 4. Helper function: get_next_revision_number
-- =============================================
CREATE OR REPLACE FUNCTION public.get_next_revision_number(p_quote_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_quote_id::text));
  SELECT COALESCE(MAX(revision_number), 0) + 1
  INTO v_next
  FROM quote_revisions
  WHERE quote_id = p_quote_id;
  RETURN v_next;
END;
$$;

-- =============================================
-- 5. Backfill: Create Revision 1 from existing quotes
-- =============================================
INSERT INTO quote_revisions (
  quote_id, revision_number, revision_type,
  created_by_name, created_by_role, created_at,
  products, subtotal, discount_percent, discount_amount,
  vat_percent, vat_amount, grand_total,
  status, sent_at, valid_until
)
SELECT 
  id, 1, 'initial',
  'System Migration', 'system', COALESCE(sent_at, created_at),
  products,
  COALESCE(subtotal, 0),
  COALESCE(discount_percent, 0),
  COALESCE(discount_amount, 0),
  COALESCE(vat_percent, 7),
  COALESCE(vat_amount, 0),
  COALESCE(grand_total, 0),
  CASE WHEN status = 'pending' THEN 'draft' ELSE 'sent' END,
  sent_at, valid_until
FROM quote_requests
WHERE NOT EXISTS (
  SELECT 1 FROM quote_revisions WHERE quote_revisions.quote_id = quote_requests.id
);

-- Update quote_requests with current_revision_id
UPDATE quote_requests qr
SET 
  current_revision_id = qrev.id,
  current_revision_number = 1,
  total_revisions = 1
FROM quote_revisions qrev
WHERE qrev.quote_id = qr.id 
  AND qrev.revision_number = 1
  AND qr.current_revision_id IS NULL;
