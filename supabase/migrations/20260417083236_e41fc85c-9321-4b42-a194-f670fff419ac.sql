DROP POLICY IF EXISTS "payment_slips_admin_read_all" ON storage.objects;
DROP POLICY IF EXISTS "payment_slips_admin_delete" ON storage.objects;

CREATE POLICY "payment_slips_admin_read_all"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-slips'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'super_admin')
      OR public.has_role(auth.uid(), 'sales')
    )
  );

CREATE POLICY "payment_slips_admin_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'payment-slips'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'super_admin')
      OR public.has_role(auth.uid(), 'sales')
    )
  );