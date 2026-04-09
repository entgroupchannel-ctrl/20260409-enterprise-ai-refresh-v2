CREATE TABLE public.software_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  line_id text,
  service_type text NOT NULL DEFAULT 'saas',
  budget_range text,
  timeline text,
  current_problems text,
  requirements text,
  status text NOT NULL DEFAULT 'new',
  notes text,
  lead_score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.software_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit software inquiry"
  ON public.software_inquiries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own software inquiries"
  ON public.software_inquiries FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Admins can update software inquiries"
  ON public.software_inquiries FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));