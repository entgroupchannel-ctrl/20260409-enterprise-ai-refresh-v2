-- Allow admin to delete documents
CREATE POLICY "documents_delete_admin"
ON public.documents
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role::text = 'admin'
));

-- Allow admin to delete quote_files
CREATE POLICY "quote_files_delete_admin"
ON public.quote_files
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role::text = 'admin'
));

-- Allow admin to delete storage objects in quote-files bucket
CREATE POLICY "Admin can delete quote files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'quote-files' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role::text = 'admin'
  )
);