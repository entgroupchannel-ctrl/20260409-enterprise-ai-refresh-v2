-- Allow newly-signed-up users (or guests during the same session) to claim
-- their guest-created partner_applications by linking user_id.
-- The existing UPDATE policy required user_id = auth.uid(), which blocked
-- the initial claim of a guest draft. We add a permissive policy that lets
-- an authenticated user attach their user_id to a row that still has NULL
-- user_id (i.e. created as guest). After the claim succeeds, the original
-- ownership policy takes over.

DROP POLICY IF EXISTS "Applicants claim guest application" ON public.partner_applications;

CREATE POLICY "Applicants claim guest application"
  ON public.partner_applications FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND user_id IS NULL
  )
  WITH CHECK (
    user_id = auth.uid()
  );