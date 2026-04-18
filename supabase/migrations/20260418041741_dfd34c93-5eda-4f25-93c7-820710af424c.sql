-- ============================================
-- Phase 2: Partner Recruitment System
-- ============================================

-- 1. Main applications table
CREATE TABLE public.partner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Ownership
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_token TEXT, -- for anonymous drafts
  
  -- Application metadata
  application_number TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','under_review','approved','rejected','on_hold')),
  current_stage INT NOT NULL DEFAULT 1 CHECK (current_stage BETWEEN 1 AND 5),
  language TEXT NOT NULL DEFAULT 'zh' CHECK (language IN ('zh','en','th')),
  
  -- Stage 1: Company info
  company_name_local TEXT,
  company_name_en TEXT,
  business_license_no TEXT,
  legal_representative TEXT,
  registered_capital_cny NUMERIC(15,2),
  established_year INT,
  company_address TEXT,
  city TEXT,
  province TEXT,
  country TEXT DEFAULT 'CN',
  website TEXT,
  
  -- Contact
  contact_name TEXT,
  contact_position TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_wechat TEXT,
  contact_whatsapp TEXT,
  
  -- Stage 2: Products & Capability
  product_categories TEXT[], -- e.g. ['mini-pc','industrial-pc','panel-pc']
  main_products TEXT,
  oem_capable BOOLEAN DEFAULT false,
  odm_capable BOOLEAN DEFAULT false,
  monthly_capacity TEXT,
  factory_size_sqm INT,
  staff_count INT,
  qa_staff_count INT,
  rd_staff_count INT,
  
  -- Stage 3: Certifications & Experience
  certifications TEXT[], -- ['ISO9001','CE','FCC','RoHS']
  export_countries TEXT[],
  major_clients TEXT,
  annual_export_value_usd NUMERIC(15,2),
  has_thailand_experience BOOLEAN DEFAULT false,
  thailand_experience_detail TEXT,
  
  -- Stage 4: Partnership terms
  exclusivity_preference TEXT CHECK (exclusivity_preference IN ('exclusive','non_exclusive','negotiable')),
  min_order_quantity TEXT,
  payment_terms_preference TEXT,
  sample_policy TEXT,
  warranty_terms TEXT,
  expected_partnership_type TEXT[],
  
  -- Stage 5: Additional notes
  why_partner_with_us TEXT,
  additional_notes TEXT,
  heard_about_us_from TEXT,
  
  -- Auto-scoring (hidden from applicant)
  auto_score INT DEFAULT 0,
  auto_score_breakdown JSONB,
  manual_score INT,
  
  -- Review workflow
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  review_decision TEXT,
  internal_notes TEXT,
  rejection_reason TEXT,
  rejection_reason_code TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_saved_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_partner_apps_user ON public.partner_applications(user_id);
CREATE INDEX idx_partner_apps_status ON public.partner_applications(status);
CREATE INDEX idx_partner_apps_session ON public.partner_applications(session_token) WHERE session_token IS NOT NULL;
CREATE INDEX idx_partner_apps_created ON public.partner_applications(created_at DESC);

-- 2. Files attached to applications
CREATE TABLE public.partner_application_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.partner_applications(id) ON DELETE CASCADE,
  file_category TEXT NOT NULL CHECK (file_category IN (
    'business_license','factory_photo','factory_video','product_catalog',
    'certification','quality_report','client_reference','other'
  )),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT,
  file_size BIGINT,
  mime_type TEXT,
  ocr_extracted JSONB, -- for business license OCR results
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_partner_files_app ON public.partner_application_files(application_id);

-- 3. Review history
CREATE TABLE public.partner_application_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.partner_applications(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  reviewer_name TEXT,
  decision TEXT NOT NULL CHECK (decision IN ('approve','reject','request_info','hold','comment')),
  score INT,
  comment TEXT,
  internal_only BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_partner_reviews_app ON public.partner_application_reviews(application_id);

-- ============================================
-- Triggers
-- ============================================

CREATE TRIGGER trg_partner_apps_updated_at
  BEFORE UPDATE ON public.partner_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-generate application number on submit
CREATE OR REPLACE FUNCTION public.generate_partner_app_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  yr TEXT;
  seq INT;
BEGIN
  IF NEW.status = 'submitted' AND OLD.status = 'draft' AND NEW.application_number IS NULL THEN
    yr := to_char(now(), 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(application_number FROM 9) AS INT)), 0) + 1
      INTO seq
      FROM public.partner_applications
      WHERE application_number LIKE 'PA-' || yr || '-%';
    NEW.application_number := 'PA-' || yr || '-' || LPAD(seq::TEXT, 4, '0');
    NEW.submitted_at := now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_partner_app_number
  BEFORE UPDATE ON public.partner_applications
  FOR EACH ROW EXECUTE FUNCTION public.generate_partner_app_number();

-- ============================================
-- RLS
-- ============================================

ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_application_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_application_reviews ENABLE ROW LEVEL SECURITY;

-- Helper: is staff (admin/super_admin/sales)
CREATE OR REPLACE FUNCTION public.is_partner_reviewer(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = _user_id
      AND role IN ('admin','super_admin','sales')
      AND is_active = true
  );
$$;

-- partner_applications policies
CREATE POLICY "Applicants insert own application"
  ON public.partner_applications FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND session_token IS NOT NULL)
  );

CREATE POLICY "Applicants view own application"
  ON public.partner_applications FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_partner_reviewer(auth.uid())
  );

CREATE POLICY "Applicants update own draft"
  ON public.partner_applications FOR UPDATE
  USING (
    (user_id = auth.uid() AND status IN ('draft','submitted'))
    OR public.is_partner_reviewer(auth.uid())
  );

CREATE POLICY "Reviewers delete applications"
  ON public.partner_applications FOR DELETE
  USING (public.is_partner_reviewer(auth.uid()));

-- partner_application_files policies
CREATE POLICY "View files of accessible applications"
  ON public.partner_application_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_applications a
      WHERE a.id = application_id
        AND (a.user_id = auth.uid() OR public.is_partner_reviewer(auth.uid()))
    )
  );

CREATE POLICY "Upload files to own application"
  ON public.partner_application_files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.partner_applications a
      WHERE a.id = application_id
        AND (a.user_id = auth.uid() OR public.is_partner_reviewer(auth.uid()))
    )
  );

CREATE POLICY "Delete files of own application"
  ON public.partner_application_files FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_applications a
      WHERE a.id = application_id
        AND (
          (a.user_id = auth.uid() AND a.status = 'draft')
          OR public.is_partner_reviewer(auth.uid())
        )
    )
  );

-- partner_application_reviews policies (reviewers only)
CREATE POLICY "Reviewers view all reviews"
  ON public.partner_application_reviews FOR SELECT
  USING (public.is_partner_reviewer(auth.uid()));

CREATE POLICY "Reviewers insert reviews"
  ON public.partner_application_reviews FOR INSERT
  WITH CHECK (public.is_partner_reviewer(auth.uid()) AND reviewer_id = auth.uid());

-- ============================================
-- Storage bucket
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'partner-applications',
  'partner-applications',
  false,
  524288000, -- 500 MB (for video uploads)
  ARRAY['image/jpeg','image/png','image/webp','application/pdf','video/mp4','video/quicktime','video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies — folder structure: {application_id}/{category}/{filename}
CREATE POLICY "Anyone can upload to partner-applications"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'partner-applications');

CREATE POLICY "View own partner files or as reviewer"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'partner-applications' AND (
      public.is_partner_reviewer(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.partner_applications a
        WHERE a.id::text = (storage.foldername(name))[1]
          AND a.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Delete own partner files or as reviewer"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'partner-applications' AND (
      public.is_partner_reviewer(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.partner_applications a
        WHERE a.id::text = (storage.foldername(name))[1]
          AND a.user_id = auth.uid()
          AND a.status = 'draft'
      )
    )
  );