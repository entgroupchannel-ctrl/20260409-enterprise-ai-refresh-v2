
-- 1. Add session_token to files table for anonymous ownership tracking
ALTER TABLE public.partner_application_files
  ADD COLUMN IF NOT EXISTS session_token text;

CREATE INDEX IF NOT EXISTS idx_partner_app_files_session_token
  ON public.partner_application_files(session_token);

-- 2. Replace partner_applications policies to support anonymous (session_token)
DROP POLICY IF EXISTS "Applicants view own application" ON public.partner_applications;
DROP POLICY IF EXISTS "Applicants update own draft" ON public.partner_applications;

CREATE POLICY "Applicants view own application"
  ON public.partner_applications FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR is_partner_reviewer(auth.uid())
    OR (auth.uid() IS NULL AND session_token IS NOT NULL
        AND session_token = current_setting('request.headers', true)::json->>'x-session-token')
    OR (auth.uid() IS NULL AND session_token IS NOT NULL)
  );

CREATE POLICY "Applicants update own draft"
  ON public.partner_applications FOR UPDATE
  USING (
    ((auth.uid() IS NOT NULL AND user_id = auth.uid())
       AND status = ANY (ARRAY['draft','submitted']))
    OR is_partner_reviewer(auth.uid())
    OR (auth.uid() IS NULL AND session_token IS NOT NULL
        AND status = ANY (ARRAY['draft','submitted']))
  );

-- 3. Replace partner_application_files policies for anonymous access
DROP POLICY IF EXISTS "View files of accessible applications" ON public.partner_application_files;
DROP POLICY IF EXISTS "Upload files to own application" ON public.partner_application_files;
DROP POLICY IF EXISTS "Delete files of own application" ON public.partner_application_files;

CREATE POLICY "View files of accessible applications"
  ON public.partner_application_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_applications a
      WHERE a.id = partner_application_files.application_id
        AND (
          (auth.uid() IS NOT NULL AND a.user_id = auth.uid())
          OR is_partner_reviewer(auth.uid())
          OR (auth.uid() IS NULL AND a.session_token IS NOT NULL)
        )
    )
  );

CREATE POLICY "Upload files to own application"
  ON public.partner_application_files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.partner_applications a
      WHERE a.id = partner_application_files.application_id
        AND (
          (auth.uid() IS NOT NULL AND a.user_id = auth.uid())
          OR is_partner_reviewer(auth.uid())
          OR (auth.uid() IS NULL AND a.session_token IS NOT NULL
              AND a.status = ANY (ARRAY['draft','submitted']))
        )
    )
  );

CREATE POLICY "Delete files of own application"
  ON public.partner_application_files FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_applications a
      WHERE a.id = partner_application_files.application_id
        AND (
          ((auth.uid() IS NOT NULL AND a.user_id = auth.uid())
             AND a.status = 'draft')
          OR is_partner_reviewer(auth.uid())
          OR (auth.uid() IS NULL AND a.session_token IS NOT NULL
              AND a.status = 'draft')
        )
    )
  );
