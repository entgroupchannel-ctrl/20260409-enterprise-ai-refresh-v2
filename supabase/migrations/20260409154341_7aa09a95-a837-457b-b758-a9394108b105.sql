
-- =============================================
-- PO Change Requests Table
-- =============================================
CREATE TABLE public.po_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL, -- 'edit', 'cancel', 'replace'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
  requested_by TEXT NOT NULL, -- user email
  requested_by_role TEXT NOT NULL, -- 'super_admin', 'admin', 'sales', 'customer'
  request_reason TEXT,
  new_files JSONB, -- [{file_url, file_name, file_size}]
  reviewed_by TEXT, -- reviewer email
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_po_change_requests_quote_id ON public.po_change_requests(quote_id);
CREATE INDEX idx_po_change_requests_status ON public.po_change_requests(status);

-- RLS
ALTER TABLE public.po_change_requests ENABLE ROW LEVEL SECURITY;

-- Admin/Sales can do everything
CREATE POLICY "po_change_admin_all" ON public.po_change_requests
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'sales')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'sales')
  )
);

-- Customers can create requests for their own quotes
CREATE POLICY "po_change_customer_insert" ON public.po_change_requests
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.quote_requests qr
    JOIN public.users u ON u.email = qr.customer_email
    WHERE qr.id = quote_id
    AND u.id = auth.uid()
  )
);

-- Customers can view their own requests
CREATE POLICY "po_change_customer_select" ON public.po_change_requests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.quote_requests qr
    JOIN public.users u ON u.email = qr.customer_email
    WHERE qr.id = po_change_requests.quote_id
    AND u.id = auth.uid()
  )
);

-- =============================================
-- PO Versions Table (version history)
-- =============================================
CREATE TABLE public.po_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  files JSONB NOT NULL, -- snapshot of files at that version
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT, -- email
  change_reason TEXT
);

CREATE INDEX idx_po_versions_quote_id ON public.po_versions(quote_id);

-- RLS
ALTER TABLE public.po_versions ENABLE ROW LEVEL SECURITY;

-- Admin/Sales full access
CREATE POLICY "po_versions_admin_all" ON public.po_versions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'sales')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'sales')
  )
);

-- Customers can view versions of their quotes
CREATE POLICY "po_versions_customer_select" ON public.po_versions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.quote_requests qr
    JOIN public.users u ON u.email = qr.customer_email
    WHERE qr.id = po_versions.quote_id
    AND u.id = auth.uid()
  )
);
