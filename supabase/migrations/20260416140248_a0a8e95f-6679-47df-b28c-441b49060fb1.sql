-- Create employee_invitations table
CREATE TABLE public.employee_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'sales',
  full_name TEXT,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employee_invitations ENABLE ROW LEVEL SECURITY;

-- Admin/super_admin can create and view invitations
CREATE POLICY "Staff can manage invitations"
  ON public.employee_invitations
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('super_admin', 'admin')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('super_admin', 'admin')
  ));

-- Anyone (including anon) can read a valid invitation by token for the accept page
CREATE POLICY "Anyone can read valid invitation by token"
  ON public.employee_invitations
  FOR SELECT
  TO anon, authenticated
  USING (
    accepted_at IS NULL
    AND expires_at > now()
  );

-- Create index for token lookups
CREATE INDEX idx_employee_invitations_token ON public.employee_invitations(token);