ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS line_id text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS callback_time text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS business_card_data jsonb;