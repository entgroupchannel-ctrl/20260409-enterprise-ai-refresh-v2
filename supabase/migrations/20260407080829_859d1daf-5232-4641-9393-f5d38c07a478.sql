
-- Remove duplicate triggers
DROP TRIGGER IF EXISTS trg_contact_lead_score ON contact_submissions;
DROP TRIGGER IF EXISTS trigger_contact_lead_score ON contact_submissions;
DROP TRIGGER IF EXISTS trg_quote_lead_score ON quote_requests;
DROP TRIGGER IF EXISTS trigger_quote_lead_score ON quote_requests;
DROP TRIGGER IF EXISTS trg_auto_assign_quote ON quote_requests;
DROP TRIGGER IF EXISTS trg_delivery_number ON delivery_notes;
DROP TRIGGER IF EXISTS trg_payment_number ON payment_records;

-- Add missing columns to delivery_notes
ALTER TABLE delivery_notes
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vat_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS withholding_tax NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS grand_total NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS assigned_to UUID,
  ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add missing columns to payment_records
ALTER TABLE payment_records
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS assigned_to UUID;

-- Add user view RLS policies
DROP POLICY IF EXISTS "Users view own delivery_notes" ON delivery_notes;
CREATE POLICY "Users view own delivery_notes"
  ON delivery_notes FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users view own payment_records" ON payment_records;
CREATE POLICY "Users view own payment_records"
  ON payment_records FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
