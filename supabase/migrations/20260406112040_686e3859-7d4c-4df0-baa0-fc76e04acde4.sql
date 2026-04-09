-- Phase 27: Sales Order System

-- Step 1: Sales Orders table
CREATE TABLE IF NOT EXISTS public.sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  quote_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_company TEXT,
  user_id UUID,
  assigned_to UUID,
  po_number TEXT,
  po_file_url TEXT,
  po_file_name TEXT,
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  withholding_tax NUMERIC(12,2) DEFAULT 0,
  grand_total NUMERIC(12,2) DEFAULT 0,
  net_payable NUMERIC(12,2) DEFAULT 0,
  payment_terms TEXT,
  delivery_terms TEXT,
  warranty_terms TEXT DEFAULT '1 ปี Carry-in',
  status TEXT NOT NULL DEFAULT 'confirmed',
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  tracking_number TEXT,
  shipping_provider TEXT,
  admin_notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sales_orders_quote ON sales_orders(quote_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_assigned ON sales_orders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status ON sales_orders(status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_created ON sales_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_orders_number ON sales_orders(order_number);

ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON sales_orders FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage orders"
  ON sales_orders FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- Step 2: Sales Order Line Items
CREATE TABLE IF NOT EXISTS public.sales_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES product_catalog(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  name_th TEXT,
  description TEXT,
  category TEXT,
  qty INTEGER DEFAULT 1,
  unit_label TEXT DEFAULT 'เครื่อง',
  unit_price NUMERIC(12,2) DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  line_total NUMERIC(12,2) DEFAULT 0,
  specs JSONB DEFAULT '{}'::jsonb,
  warranty_terms TEXT,
  admin_notes TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sales_order_items_order ON sales_order_items(order_id);

ALTER TABLE sales_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON sales_order_items FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM sales_orders o 
    WHERE o.id = sales_order_items.order_id 
    AND (o.user_id = auth.uid() OR public.is_admin(auth.uid()))
  ));

CREATE POLICY "Admins can manage order items"
  ON sales_order_items FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- Step 3: Auto-generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM sales_orders
  WHERE created_at >= date_trunc('year', now());
  NEW.order_number := 'SO-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_number ON sales_orders;
CREATE TRIGGER trg_order_number
  BEFORE INSERT ON sales_orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION public.generate_order_number();

-- Step 4: Auto-create sales order when PO approved
CREATE OR REPLACE FUNCTION public.auto_create_sales_order()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  _order_id UUID;
BEGIN
  IF NEW.po_status = 'approved' AND (OLD.po_status IS NULL OR OLD.po_status != 'approved') THEN
    IF NOT EXISTS (SELECT 1 FROM sales_orders WHERE quote_id = NEW.id) THEN
      INSERT INTO sales_orders (
        quote_id, customer_name, customer_email, customer_phone, customer_company,
        user_id, assigned_to, po_number, po_file_url, po_file_name,
        subtotal, discount_amount, grand_total, net_payable,
        payment_terms, delivery_terms, status
      ) VALUES (
        NEW.id, NEW.name, NEW.email, NEW.phone, NEW.company,
        NEW.user_id, NEW.assigned_to, NEW.po_number, NEW.po_file_url, NEW.po_file_name,
        NEW.subtotal, NEW.discount_amount, NEW.grand_total, NEW.grand_total,
        NEW.payment_terms, NEW.delivery_terms, 'confirmed'
      ) RETURNING id INTO _order_id;

      INSERT INTO sales_order_items (
        order_id, product_id, model, category, qty, unit_price,
        discount_percent, line_total, specs, admin_notes, sort_order
      )
      SELECT
        _order_id, product_id, model, category, qty, unit_price,
        discount_percent,
        ROUND(unit_price * (1 - discount_percent / 100) * qty, 2),
        custom_specs, admin_notes, sort_order
      FROM quote_line_items
      WHERE quote_id = NEW.id
      ORDER BY sort_order;

      UPDATE sales_order_items soi
      SET
        name_th = pc.name_th,
        description = pc.description,
        unit_label = COALESCE(pc.unit_label, 'เครื่อง'),
        warranty_terms = pc.warranty_terms
      FROM product_catalog pc
      WHERE soi.order_id = _order_id
        AND soi.product_id = pc.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_create_order ON quote_requests;
CREATE TRIGGER trg_auto_create_order
  AFTER UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_sales_order();

-- Step 5: Sales dashboard stats RPC
CREATE OR REPLACE FUNCTION public.get_sales_dashboard(_year INTEGER DEFAULT NULL)
RETURNS TABLE(
  sale_user_id UUID,
  sale_name TEXT,
  sale_email TEXT,
  total_orders BIGINT,
  total_revenue NUMERIC,
  confirmed_count BIGINT,
  processing_count BIGINT,
  shipped_count BIGINT,
  delivered_count BIGINT,
  completed_count BIGINT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    so.assigned_to AS sale_user_id,
    COALESCE(p.full_name, u.email::TEXT, 'ไม่ระบุ') AS sale_name,
    COALESCE(u.email::TEXT, '') AS sale_email,
    COUNT(*)::BIGINT AS total_orders,
    COALESCE(SUM(so.grand_total), 0)::NUMERIC AS total_revenue,
    COUNT(*) FILTER (WHERE so.status = 'confirmed')::BIGINT,
    COUNT(*) FILTER (WHERE so.status = 'processing')::BIGINT,
    COUNT(*) FILTER (WHERE so.status = 'shipped')::BIGINT,
    COUNT(*) FILTER (WHERE so.status = 'delivered')::BIGINT,
    COUNT(*) FILTER (WHERE so.status = 'completed')::BIGINT
  FROM sales_orders so
  LEFT JOIN auth.users u ON u.id = so.assigned_to
  LEFT JOIN profiles p ON p.id = so.assigned_to
  WHERE so.status != 'cancelled'
    AND (_year IS NULL OR EXTRACT(YEAR FROM so.created_at) = _year)
  GROUP BY so.assigned_to, p.full_name, u.email
  ORDER BY total_revenue DESC;
END;
$$;

-- Step 6: Monthly revenue chart RPC
CREATE OR REPLACE FUNCTION public.get_monthly_revenue(_year INTEGER DEFAULT NULL)
RETURNS TABLE(
  month_num INTEGER,
  month_name TEXT,
  total_revenue NUMERIC,
  order_count BIGINT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  _target_year INTEGER;
  _months TEXT[] := ARRAY['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
BEGIN
  _target_year := COALESCE(_year, EXTRACT(YEAR FROM now())::INTEGER);
  RETURN QUERY
  SELECT
    m.n AS month_num,
    _months[m.n] AS month_name,
    COALESCE(SUM(so.grand_total), 0)::NUMERIC AS total_revenue,
    COUNT(so.id)::BIGINT AS order_count
  FROM generate_series(1, 12) AS m(n)
  LEFT JOIN sales_orders so
    ON EXTRACT(MONTH FROM so.created_at) = m.n
    AND EXTRACT(YEAR FROM so.created_at) = _target_year
    AND so.status NOT IN ('cancelled')
  GROUP BY m.n
  ORDER BY m.n;
END;
$$;