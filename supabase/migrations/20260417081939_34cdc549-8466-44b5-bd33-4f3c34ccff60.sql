-- แก้ปัญหา RLS policies บน storage.objects สำหรับ payment-slips
-- ปัญหาเดิม: subquery "FROM users" ไม่ qualify schema → อาจ resolve เป็น auth.users ทำให้ policy fail และ admin เห็นไฟล์ไม่ได้
-- วิธีแก้: ใช้ public.has_role() helper function ที่มี SECURITY DEFINER + qualify schema ชัดเจน

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
      OR public.has_role(auth.uid(), 'sales')
    )
  );