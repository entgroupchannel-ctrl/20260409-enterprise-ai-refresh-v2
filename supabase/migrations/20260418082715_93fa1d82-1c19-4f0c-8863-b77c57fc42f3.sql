
ALTER TABLE public.affiliates
  ADD COLUMN IF NOT EXISTS account_holder_type TEXT NOT NULL DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS national_id TEXT,
  ADD COLUMN IF NOT EXISTS id_card_url TEXT,
  ADD COLUMN IF NOT EXISTS id_card_uploaded_at TIMESTAMPTZ;

ALTER TABLE public.affiliates
  ADD CONSTRAINT affiliates_tax_id_format CHECK (tax_id IS NULL OR tax_id ~ '^[0-9]{13}$'),
  ADD CONSTRAINT affiliates_national_id_format CHECK (national_id IS NULL OR national_id ~ '^[0-9]{13}$'),
  ADD CONSTRAINT affiliates_account_holder_type_check CHECK (account_holder_type IN ('individual','corporate'));

INSERT INTO storage.buckets (id, name, public)
VALUES ('affiliate-kyc', 'affiliate-kyc', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Affiliate can upload own KYC"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'affiliate-kyc' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Affiliate can view own KYC"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'affiliate-kyc' AND (
  auth.uid()::text = (storage.foldername(name))[1]
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'super_admin')
));

CREATE POLICY "Affiliate can update own KYC"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'affiliate-kyc' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Affiliate can delete own KYC"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'affiliate-kyc' AND auth.uid()::text = (storage.foldername(name))[1]);
