-- =====================================================
-- Phase 4B.1: Payment Slips — Storage + Customer RLS
-- =====================================================

-- 1. Create storage bucket for payment slips
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-slips',
  'payment-slips',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS policies
DROP POLICY IF EXISTS "payment_slips_customer_upload" ON storage.objects;
CREATE POLICY "payment_slips_customer_upload" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'payment-slips'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "payment_slips_customer_read_own" ON storage.objects;
CREATE POLICY "payment_slips_customer_read_own" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'payment-slips'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "payment_slips_admin_read_all" ON storage.objects;
CREATE POLICY "payment_slips_admin_read_all" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'payment-slips'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin','sales')
    )
  );

DROP POLICY IF EXISTS "payment_slips_admin_delete" ON storage.objects;
CREATE POLICY "payment_slips_admin_delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'payment-slips'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin','sales')
    )
  );

-- 3. payment_records RLS — add customer policies
DROP POLICY IF EXISTS "billing_payments_customer_read" ON public.payment_records;
CREATE POLICY "billing_payments_customer_read" ON public.payment_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices inv
      WHERE inv.id = payment_records.invoice_id
      AND inv.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "billing_payments_customer_insert" ON public.payment_records;
CREATE POLICY "billing_payments_customer_insert" ON public.payment_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices inv
      WHERE inv.id = payment_records.invoice_id
      AND inv.customer_id = auth.uid()
    )
    AND verification_status = 'pending'
    AND created_by = auth.uid()
  );