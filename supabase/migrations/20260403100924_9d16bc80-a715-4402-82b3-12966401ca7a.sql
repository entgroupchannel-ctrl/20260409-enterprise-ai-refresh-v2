-- Add user_id to quote_requests so users can track their own quotes
ALTER TABLE public.quote_requests 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- RLS: Users can view their own quotes
CREATE POLICY "Users can view own quotes"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Drop the old broad SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view quotes" ON public.quote_requests;

-- Create trigger for lead scoring on quote_requests
CREATE TRIGGER trg_quote_lead_score
  BEFORE INSERT ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_lead_score();

-- Create trigger for lead scoring on contact_submissions
CREATE TRIGGER trg_contact_lead_score
  BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_lead_score();