-- Enhanced Document System

ALTER TABLE document_library ADD COLUMN IF NOT EXISTS access_level TEXT NOT NULL DEFAULT 'public';
ALTER TABLE document_library ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general';
ALTER TABLE document_library ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE document_library ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE document_library ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;
ALTER TABLE document_library ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id);
ALTER TABLE document_library ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE TABLE IF NOT EXISTS public.document_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES document_library(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(user_id, document_id)
);

ALTER TABLE document_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage document_access"
  ON document_access FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users see own access"
  ON document_access FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.document_download_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES document_library(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  method TEXT DEFAULT 'direct'
);

ALTER TABLE document_download_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins see all download logs"
  ON document_download_log FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users see own downloads"
  ON document_download_log FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can log downloads"
  ON document_download_log FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS document_id UUID REFERENCES document_library(id);
ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE document_requests ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS customer_tier TEXT NOT NULL DEFAULT 'regular';

CREATE OR REPLACE FUNCTION public.can_download_document(_user_id UUID, _document_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _access_level TEXT;
  _user_tier TEXT;
  _has_grant BOOLEAN;
BEGIN
  SELECT access_level INTO _access_level FROM document_library WHERE id = _document_id;
  IF _access_level IS NULL THEN RETURN false; END IF;
  IF _access_level = 'public' THEN RETURN true; END IF;
  IF public.is_admin(_user_id) THEN RETURN true; END IF;
  IF _access_level = 'vip' THEN
    SELECT customer_tier INTO _user_tier FROM profiles WHERE id = _user_id;
    IF _user_tier IN ('vip', 'premium') THEN RETURN true; END IF;
  END IF;
  SELECT EXISTS(
    SELECT 1 FROM document_access
    WHERE user_id = _user_id AND document_id = _document_id
    AND (expires_at IS NULL OR expires_at > now())
  ) INTO _has_grant;
  RETURN _has_grant;
END;
$$;

GRANT EXECUTE ON FUNCTION public.can_download_document(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.generate_doc_share_token(_document_id UUID)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _token TEXT;
BEGIN
  _token := encode(gen_random_bytes(24), 'base64');
  _token := replace(replace(replace(_token, '+', '-'), '/', '_'), '=', '');
  UPDATE document_library SET share_token = _token WHERE id = _document_id;
  RETURN _token;
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_doc_share_token(UUID) TO authenticated;

DROP POLICY IF EXISTS "Users can view public documents" ON document_library;

CREATE POLICY "Users can view visible documents"
  ON document_library FOR SELECT TO authenticated
  USING (access_level IN ('public', 'visible', 'vip'));

INSERT INTO document_library (document_type, title, description, file_url, access_level, category, is_public) VALUES
('company_cert', 'หนังสือรับรองบริษัท', 'หนังสือรับรองการจดทะเบียนบริษัท อี.เอ็น.ที. กรุ๊ป จำกัด', '', 'visible', 'company', true),
('vat_cert', 'ใบทะเบียนภาษีมูลค่าเพิ่ม (ภ.พ.20)', 'ใบจดทะเบียนภาษีมูลค่าเพิ่ม ภ.พ.20', '', 'visible', 'company', true),
('company_reg', 'ทะเบียนบริษัท', 'สำเนาทะเบียนบริษัท', '', 'visible', 'company', true),
('bookbank', 'หน้า Bookbank', 'สำเนาหน้าบัญชีธนาคารสำหรับการชำระเงิน', '', 'visible', 'company', true),
('company_profile', 'Company Profile', 'โปรไฟล์บริษัท ENT Group', '', 'public', 'company', true),
('product_catalog', 'Product Catalog 2026', 'แคตตาล็อกสินค้าทั้งหมด ปี 2026', '', 'public', 'product', true),
('vendor_form', 'Vendor Registration Form', 'แบบฟอร์มขึ้นทะเบียนผู้ค้า', '', 'vip', 'company', true),
('boq_template', 'BOQ Template', 'แบบฟอร์ม Bill of Quantities', '', 'public', 'general', true)
ON CONFLICT DO NOTHING;