
-- Create sale_orders table
CREATE TABLE public.sale_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES public.quote_requests(id) NOT NULL,
  so_number TEXT UNIQUE NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT,
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  expected_delivery_date DATE,
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(12,2),
  vat_amount NUMERIC(12,2),
  grand_total NUMERIC(12,2),
  production_notes TEXT,
  shipping_address TEXT,
  shipping_method TEXT,
  tracking_number TEXT,
  internal_notes TEXT,
  customer_notes TEXT
);

-- Indexes
CREATE INDEX idx_sale_orders_quote_id ON public.sale_orders(quote_id);
CREATE INDEX idx_sale_orders_so_number ON public.sale_orders(so_number);
CREATE INDEX idx_sale_orders_status ON public.sale_orders(status);

-- Enable RLS
ALTER TABLE public.sale_orders ENABLE ROW LEVEL SECURITY;

-- RLS: Admin/Sales can do everything
CREATE POLICY "sale_orders_select_admin" ON public.sale_orders
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'sales'))
);

CREATE POLICY "sale_orders_insert_admin" ON public.sale_orders
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'sales'))
);

CREATE POLICY "sale_orders_update_admin" ON public.sale_orders
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'sales'))
);

CREATE POLICY "sale_orders_delete_admin" ON public.sale_orders
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'sales'))
);

-- Auto-generate SO number
CREATE OR REPLACE FUNCTION public.generate_so_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  current_year TEXT;
  seq_num INT;
BEGIN
  current_year := to_char(NOW(), 'YYYY');
  
  SELECT COUNT(*) + 1 INTO seq_num
  FROM public.sale_orders
  WHERE to_char(created_at, 'YYYY') = current_year;
  
  NEW.so_number := 'SO-' || current_year || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_generate_so_number
  BEFORE INSERT ON public.sale_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_so_number();

-- Auto-update updated_at
CREATE TRIGGER update_sale_orders_updated_at
  BEFORE UPDATE ON public.sale_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add columns to quote_requests
ALTER TABLE public.quote_requests
ADD COLUMN IF NOT EXISTS has_sale_order BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS so_created_at TIMESTAMPTZ;
