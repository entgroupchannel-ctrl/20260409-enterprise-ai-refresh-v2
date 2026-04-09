
-- Add missing columns to sale_orders
ALTER TABLE sale_orders
  ADD COLUMN IF NOT EXISTS sale_person_name TEXT,
  ADD COLUMN IF NOT EXISTS sale_person_email TEXT,
  ADD COLUMN IF NOT EXISTS standard_lead_time_days INT DEFAULT 7,
  ADD COLUMN IF NOT EXISTS delivery_notes TEXT,
  ADD COLUMN IF NOT EXISTS shipping_provider TEXT,
  ADD COLUMN IF NOT EXISTS actual_delivery_date DATE,
  ADD COLUMN IF NOT EXISTS customer_notified_shipping BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS customer_notified_delivered BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sale_orders_status ON sale_orders(status);
CREATE INDEX IF NOT EXISTS idx_sale_orders_expected_delivery ON sale_orders(expected_delivery_date);
CREATE INDEX IF NOT EXISTS idx_sale_orders_created_at ON sale_orders(created_at DESC);

-- Auto-update updated_at trigger
CREATE OR REPLACE TRIGGER update_sale_orders_updated_at
  BEFORE UPDATE ON sale_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update quote_requests when SO is created
CREATE OR REPLACE FUNCTION update_quote_so_flag()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE quote_requests
  SET 
    has_sale_order = TRUE,
    so_created_at = NEW.created_at
  WHERE id = NEW.quote_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_update_quote_so_flag ON sale_orders;
CREATE TRIGGER trg_update_quote_so_flag
  AFTER INSERT ON sale_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_quote_so_flag();

-- Comments
COMMENT ON TABLE sale_orders IS 'Sales Orders created from approved quotes';
COMMENT ON COLUMN sale_orders.expected_delivery_date IS 'Expected delivery date set by admin';
COMMENT ON COLUMN sale_orders.standard_lead_time_days IS 'Standard lead time, customizable per order';
