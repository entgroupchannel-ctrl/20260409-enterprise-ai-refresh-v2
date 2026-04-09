
-- Contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  line_id TEXT,
  whatsapp TEXT,
  callback_time TEXT,
  category TEXT,
  message TEXT NOT NULL,
  lead_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quote requests table
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  line_id TEXT,
  whatsapp TEXT,
  callback_time TEXT,
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  details TEXT,
  lead_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'quoted', 'negotiating', 'won', 'lost')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Subscribers table
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT DEFAULT 'website',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public forms)
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit quote request" ON public.quote_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can subscribe" ON public.subscribers
  FOR INSERT WITH CHECK (true);

-- Authenticated users can read all (for admin dashboard)
CREATE POLICY "Authenticated users can view contacts" ON public.contact_submissions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view quotes" ON public.quote_requests
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view subscribers" ON public.subscribers
  FOR SELECT TO authenticated USING (true);

-- Authenticated users can update status/notes
CREATE POLICY "Authenticated users can update contacts" ON public.contact_submissions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can update quotes" ON public.quote_requests
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Lead scoring function
CREATE OR REPLACE FUNCTION public.calculate_lead_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Has company name (+20)
  IF NEW.company IS NOT NULL AND NEW.company != '' THEN
    score := score + 20;
  END IF;
  -- Has phone (+15)
  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN
    score := score + 15;
  END IF;
  -- Has LINE ID (+10)
  IF NEW.line_id IS NOT NULL AND NEW.line_id != '' THEN
    score := score + 10;
  END IF;
  -- Has email (+10)
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    score := score + 10;
  END IF;
  -- Has callback time preference (+5)
  IF NEW.callback_time IS NOT NULL AND NEW.callback_time != '' THEN
    score := score + 5;
  END IF;
  
  -- For quote_requests: has products (+20), has details (+10)
  IF TG_TABLE_NAME = 'quote_requests' THEN
    IF NEW.products IS NOT NULL AND NEW.products::text != '[]' THEN
      score := score + 20;
    END IF;
    IF NEW.details IS NOT NULL AND NEW.details != '' THEN
      score := score + 10;
    END IF;
  END IF;
  
  -- For contact_submissions: has message (+15), has category (+10)
  IF TG_TABLE_NAME = 'contact_submissions' THEN
    IF NEW.message IS NOT NULL AND length(NEW.message) > 50 THEN
      score := score + 15;
    END IF;
    IF NEW.category IS NOT NULL AND NEW.category != '' THEN
      score := score + 10;
    END IF;
  END IF;
  
  NEW.lead_score := score;
  RETURN NEW;
END;
$$;

-- Triggers for auto lead scoring
CREATE TRIGGER trigger_contact_lead_score
  BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.calculate_lead_score();

CREATE TRIGGER trigger_quote_lead_score
  BEFORE INSERT ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.calculate_lead_score();
