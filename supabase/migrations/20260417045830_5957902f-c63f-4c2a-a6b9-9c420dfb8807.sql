-- Create private storage bucket for imported quote PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('quote-imports', 'quote-imports', false, 20971520, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- RLS: only authenticated admin/staff can upload & read
CREATE POLICY "Admins can upload quote import PDFs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'quote-imports'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'sales'))
);

CREATE POLICY "Admins can read quote import PDFs"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'quote-imports'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'sales'))
);

CREATE POLICY "Admins can delete quote import PDFs"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'quote-imports'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
);