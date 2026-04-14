
-- Phase 7.0a — Company Documents Library (v2)

-- PART 1: Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-documents', 'company-documents', false, 20971520,
  ARRAY['application/pdf','image/jpeg','image/png','image/webp',
    'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "company_docs_admin_all" ON storage.objects;
CREATE POLICY "company_docs_admin_all" ON storage.objects FOR ALL
  USING (bucket_id = 'company-documents' AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('super_admin','admin') AND is_active = true))
  WITH CHECK (bucket_id = 'company-documents' AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('super_admin','admin') AND is_active = true));

DROP POLICY IF EXISTS "company_docs_authenticated_read" ON storage.objects;
CREATE POLICY "company_docs_authenticated_read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'company-documents');

-- PART 2: company_documents table
CREATE TABLE IF NOT EXISTS public.company_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('company','tax','banking','personnel','certification','catalog','other')),
  access_level TEXT NOT NULL DEFAULT 'authenticated' CHECK (access_level IN ('public','authenticated','customer_active','internal')),
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  version TEXT,
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  tags TEXT[],
  download_count INT NOT NULL DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_company_docs_category ON public.company_documents(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_company_docs_access ON public.company_documents(access_level) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_company_docs_active ON public.company_documents(is_active, sort_order) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_company_docs_valid_until ON public.company_documents(valid_until) WHERE deleted_at IS NULL AND valid_until IS NOT NULL;

-- PART 3: company_document_downloads table
CREATE TABLE IF NOT EXISTS public.company_document_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.company_documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  download_source TEXT DEFAULT 'direct' CHECK (download_source IN ('direct','quote_link','request_approved','admin_push')),
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doc_downloads_doc ON public.company_document_downloads(document_id, downloaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_doc_downloads_user ON public.company_document_downloads(user_id, downloaded_at DESC);

-- PART 4: RLS — company_documents
ALTER TABLE public.company_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_documents_admin_all" ON public.company_documents FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('super_admin','admin') AND is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('super_admin','admin') AND is_active = true));

CREATE POLICY "company_documents_public_read" ON public.company_documents FOR SELECT
  USING (access_level = 'public' AND is_active = true AND deleted_at IS NULL);

CREATE POLICY "company_documents_authenticated_read" ON public.company_documents FOR SELECT TO authenticated
  USING (access_level IN ('public','authenticated') AND is_active = true AND deleted_at IS NULL);

-- customer_active: uses customer_email join instead of user_id
CREATE POLICY "company_documents_customer_active_read" ON public.company_documents FOR SELECT TO authenticated
  USING (
    access_level IN ('public','authenticated','customer_active')
    AND is_active = true AND deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM public.quote_requests qr
      JOIN public.users u ON u.email = qr.customer_email
      WHERE u.id = auth.uid()
        AND qr.status IN ('po_approved', 'completed')
      LIMIT 1
    )
  );

CREATE POLICY "company_documents_staff_read" ON public.company_documents FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('super_admin','admin','sales','accountant','warehouse','viewer') AND is_active = true));

-- PART 5: RLS — company_document_downloads
ALTER TABLE public.company_document_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_doc_downloads_admin_read" ON public.company_document_downloads FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('super_admin','admin') AND is_active = true));

CREATE POLICY "company_doc_downloads_own_read" ON public.company_document_downloads FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "company_doc_downloads_self_insert" ON public.company_document_downloads FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- PART 6: Helper Functions
CREATE OR REPLACE FUNCTION public.log_document_download(
  p_document_id UUID, p_ip_address TEXT DEFAULT NULL, p_user_agent TEXT DEFAULT NULL, p_source TEXT DEFAULT 'direct'
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE v_download_id UUID; v_email TEXT;
BEGIN
  SELECT email INTO v_email FROM public.users WHERE id = auth.uid();
  INSERT INTO public.company_document_downloads (document_id, user_id, user_email, ip_address, user_agent, download_source)
  VALUES (p_document_id, auth.uid(), v_email, p_ip_address, p_user_agent, p_source)
  RETURNING id INTO v_download_id;
  UPDATE public.company_documents SET download_count = download_count + 1, last_downloaded_at = now() WHERE id = p_document_id;
  RETURN v_download_id;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'log_document_download failed: %', SQLERRM;
  RETURN NULL;
END;
$$;
GRANT EXECUTE ON FUNCTION public.log_document_download TO authenticated;

CREATE OR REPLACE FUNCTION public.get_company_docs_stats()
RETURNS TABLE (total_documents INT, total_downloads INT, expiring_soon INT, by_category JSONB)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public' AS $$
  SELECT
    (SELECT COUNT(*)::INT FROM public.company_documents WHERE deleted_at IS NULL AND is_active = true),
    (SELECT COALESCE(SUM(download_count), 0)::INT FROM public.company_documents WHERE deleted_at IS NULL),
    (SELECT COUNT(*)::INT FROM public.company_documents WHERE deleted_at IS NULL AND valid_until IS NOT NULL AND valid_until <= CURRENT_DATE + INTERVAL '30 days' AND valid_until >= CURRENT_DATE),
    (SELECT COALESCE(jsonb_object_agg(category, cnt), '{}'::jsonb) FROM (SELECT category, COUNT(*)::INT as cnt FROM public.company_documents WHERE deleted_at IS NULL AND is_active = true GROUP BY category) s);
$$;
GRANT EXECUTE ON FUNCTION public.get_company_docs_stats TO authenticated;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.trg_company_docs_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_company_docs_updated_at ON public.company_documents;
CREATE TRIGGER trg_company_docs_updated_at BEFORE UPDATE ON public.company_documents FOR EACH ROW EXECUTE FUNCTION public.trg_company_docs_updated_at();
