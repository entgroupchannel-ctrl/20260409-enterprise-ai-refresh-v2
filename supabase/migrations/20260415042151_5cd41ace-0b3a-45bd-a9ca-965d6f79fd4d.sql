
-- =============================================
-- Phase 9.2: Repair Orders
-- =============================================

-- Table: repair_orders
CREATE TABLE public.repair_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_order_number TEXT UNIQUE NOT NULL DEFAULT '',
  
  registered_product_id UUID REFERENCES public.registered_products(id) ON DELETE SET NULL,
  serial_number TEXT,
  
  product_name TEXT NOT NULL,
  product_sku TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  
  customer_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_company TEXT,
  
  issue_description TEXT NOT NULL,
  issue_category TEXT DEFAULT 'other'
    CHECK (issue_category IN (
      'power', 'display', 'network', 'storage', 'performance', 
      'hardware', 'software', 'physical_damage', 'other'
    )),
  issue_photos TEXT[],
  
  reported_date DATE NOT NULL DEFAULT CURRENT_DATE,
  received_date DATE,
  diagnosis_date DATE,
  quoted_date DATE,
  approved_date DATE,
  repair_started_date DATE,
  completed_date DATE,
  delivered_date DATE,
  
  warranty_status TEXT NOT NULL DEFAULT 'unknown'
    CHECK (warranty_status IN (
      'in_warranty', 'out_warranty', 'extended_warranty', 
      'void', 'not_registered', 'unknown'
    )),
  is_chargeable BOOLEAN NOT NULL DEFAULT true,
  
  diagnosis TEXT,
  root_cause TEXT,
  
  labor_cost NUMERIC(12,2) DEFAULT 0,
  parts_cost NUMERIC(12,2) DEFAULT 0,
  additional_cost NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  vat_percent NUMERIC(5,2) DEFAULT 7,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  grand_total NUMERIC(12,2) DEFAULT 0,
  
  customer_quote_message TEXT,
  customer_reject_reason TEXT,
  
  technician_id UUID,
  technician_notes TEXT,
  
  repair_actions TEXT,
  
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending', 'received', 'diagnosing', 'quoted', 'approved',
      'repairing', 'done', 'delivered', 'rejected', 'cancelled'
    )),
  
  created_by UUID,
  assigned_to UUID,
  priority TEXT DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Table: repair_order_parts
CREATE TABLE public.repair_order_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_order_id UUID NOT NULL REFERENCES public.repair_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  part_name TEXT NOT NULL,
  part_sku TEXT,
  part_description TEXT,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  notes TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: repair_order_history
CREATE TABLE public.repair_order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_order_id UUID NOT NULL REFERENCES public.repair_orders(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  notes TEXT,
  metadata JSONB,
  actor_id UUID,
  actor_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_repair_orders_customer ON repair_orders(customer_id);
CREATE INDEX idx_repair_orders_status ON repair_orders(status);
CREATE INDEX idx_repair_orders_registered_product ON repair_orders(registered_product_id);
CREATE INDEX idx_repair_orders_technician ON repair_orders(technician_id);
CREATE INDEX idx_repair_orders_serial ON repair_orders(serial_number);
CREATE INDEX idx_repair_orders_deleted ON repair_orders(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_repair_order_parts_ro ON repair_order_parts(repair_order_id);
CREATE INDEX idx_repair_order_history_ro ON repair_order_history(repair_order_id);

-- Auto-numbering trigger
CREATE OR REPLACE FUNCTION public.generate_repair_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_str TEXT;
  seq_num INT;
BEGIN
  year_str := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(
    NULLIF(split_part(repair_order_number, '-', 3), '')::int
  ), 0) + 1
  INTO seq_num
  FROM repair_orders
  WHERE repair_order_number LIKE 'RO-' || year_str || '-%';

  NEW.repair_order_number := 'RO-' || year_str || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_repair_order_number
  BEFORE INSERT ON public.repair_orders
  FOR EACH ROW
  WHEN (NEW.repair_order_number = '' OR NEW.repair_order_number IS NULL)
  EXECUTE FUNCTION public.generate_repair_order_number();

-- Updated_at trigger
CREATE TRIGGER trg_repair_orders_updated_at
  BEFORE UPDATE ON public.repair_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Recalculate costs trigger
CREATE OR REPLACE FUNCTION public.recalc_repair_order_costs()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ro_id UUID;
  new_parts_cost NUMERIC(12,2);
  ro RECORD;
  subtotal NUMERIC(12,2);
BEGIN
  IF TG_OP = 'DELETE' THEN
    ro_id := OLD.repair_order_id;
  ELSE
    ro_id := NEW.repair_order_id;
  END IF;

  SELECT COALESCE(SUM(total), 0) INTO new_parts_cost
  FROM repair_order_parts
  WHERE repair_order_id = ro_id;

  SELECT labor_cost, additional_cost, discount_amount, vat_percent
  INTO ro
  FROM repair_orders WHERE id = ro_id;

  subtotal := COALESCE(ro.labor_cost, 0) + new_parts_cost + COALESCE(ro.additional_cost, 0) - COALESCE(ro.discount_amount, 0);

  UPDATE repair_orders SET
    parts_cost = new_parts_cost,
    vat_amount = ROUND(subtotal * COALESCE(ro.vat_percent, 7) / 100, 2),
    grand_total = ROUND(subtotal + (subtotal * COALESCE(ro.vat_percent, 7) / 100), 2),
    updated_at = now()
  WHERE id = ro_id;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_recalc_repair_costs
  AFTER INSERT OR UPDATE OR DELETE ON public.repair_order_parts
  FOR EACH ROW
  EXECUTE FUNCTION public.recalc_repair_order_costs();

-- Validate status transition function
CREATE OR REPLACE FUNCTION public.validate_repair_status_transition(
  p_repair_order_id UUID,
  p_new_status TEXT,
  p_actor_id UUID DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_status TEXT;
  v_allowed TEXT[];
  v_actor_name TEXT;
BEGIN
  SELECT status INTO v_current_status
  FROM repair_orders WHERE id = p_repair_order_id AND deleted_at IS NULL;

  IF v_current_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Repair order not found');
  END IF;

  -- Define allowed transitions
  CASE v_current_status
    WHEN 'pending' THEN v_allowed := ARRAY['received', 'cancelled'];
    WHEN 'received' THEN v_allowed := ARRAY['diagnosing', 'cancelled'];
    WHEN 'diagnosing' THEN v_allowed := ARRAY['repairing', 'quoted', 'cancelled'];
    WHEN 'quoted' THEN v_allowed := ARRAY['approved', 'rejected', 'cancelled'];
    WHEN 'approved' THEN v_allowed := ARRAY['repairing', 'cancelled'];
    WHEN 'repairing' THEN v_allowed := ARRAY['done', 'quoted'];
    WHEN 'done' THEN v_allowed := ARRAY['delivered'];
    WHEN 'rejected' THEN v_allowed := ARRAY['cancelled'];
    ELSE v_allowed := ARRAY[]::TEXT[];
  END CASE;

  IF NOT (p_new_status = ANY(v_allowed)) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Cannot transition from %s to %s. Allowed: %s', v_current_status, p_new_status, array_to_string(v_allowed, ', '))
    );
  END IF;

  -- Get actor name
  SELECT COALESCE(full_name, email) INTO v_actor_name
  FROM users WHERE id = p_actor_id;

  -- Update status + date fields
  UPDATE repair_orders SET
    status = p_new_status,
    received_date = CASE WHEN p_new_status = 'received' THEN CURRENT_DATE ELSE received_date END,
    diagnosis_date = CASE WHEN p_new_status = 'diagnosing' THEN CURRENT_DATE ELSE diagnosis_date END,
    quoted_date = CASE WHEN p_new_status = 'quoted' THEN CURRENT_DATE ELSE quoted_date END,
    approved_date = CASE WHEN p_new_status = 'approved' THEN CURRENT_DATE ELSE approved_date END,
    repair_started_date = CASE WHEN p_new_status = 'repairing' THEN CURRENT_DATE ELSE repair_started_date END,
    completed_date = CASE WHEN p_new_status = 'done' THEN CURRENT_DATE ELSE completed_date END,
    delivered_date = CASE WHEN p_new_status = 'delivered' THEN CURRENT_DATE ELSE delivered_date END,
    updated_at = now()
  WHERE id = p_repair_order_id;

  -- Insert history
  INSERT INTO repair_order_history (repair_order_id, action, from_status, to_status, notes, actor_id, actor_name)
  VALUES (p_repair_order_id, 'status_change', v_current_status, p_new_status, p_notes, p_actor_id, v_actor_name);

  RETURN jsonb_build_object('success', true, 'from_status', v_current_status, 'to_status', p_new_status);
END;
$$;

-- Customer respond to repair quote
CREATE OR REPLACE FUNCTION public.customer_respond_to_repair_quote(
  p_repair_order_id UUID,
  p_action TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ro RECORD;
  v_user_name TEXT;
BEGIN
  SELECT * INTO v_ro FROM repair_orders
  WHERE id = p_repair_order_id AND deleted_at IS NULL;

  IF v_ro IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Repair order not found');
  END IF;

  IF v_ro.customer_id != auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  IF v_ro.status != 'quoted' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Repair order is not in quoted status');
  END IF;

  SELECT COALESCE(full_name, email) INTO v_user_name FROM users WHERE id = auth.uid();

  IF p_action = 'approve' THEN
    UPDATE repair_orders SET
      status = 'approved',
      approved_date = CURRENT_DATE,
      updated_at = now()
    WHERE id = p_repair_order_id;

    INSERT INTO repair_order_history (repair_order_id, action, from_status, to_status, notes, actor_id, actor_name)
    VALUES (p_repair_order_id, 'status_change', 'quoted', 'approved', 'ลูกค้าอนุมัติ', auth.uid(), v_user_name);

  ELSIF p_action = 'reject' THEN
    IF p_reason IS NULL OR p_reason = '' THEN
      RETURN jsonb_build_object('success', false, 'error', 'Rejection reason is required');
    END IF;

    UPDATE repair_orders SET
      status = 'rejected',
      customer_reject_reason = p_reason,
      updated_at = now()
    WHERE id = p_repair_order_id;

    INSERT INTO repair_order_history (repair_order_id, action, from_status, to_status, notes, actor_id, actor_name)
    VALUES (p_repair_order_id, 'status_change', 'quoted', 'rejected', p_reason, auth.uid(), v_user_name);

  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Invalid action. Use approve or reject');
  END IF;

  RETURN jsonb_build_object('success', true, 'action', p_action);
END;
$$;

-- Generate invoice from repair order
CREATE OR REPLACE FUNCTION public.generate_invoice_from_repair_order(
  p_repair_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ro RECORD;
  v_inv_id UUID;
  v_inv_number TEXT;
  v_year TEXT;
  v_seq INT;
  v_subtotal NUMERIC;
  v_order INT := 1;
BEGIN
  SELECT * INTO v_ro FROM repair_orders
  WHERE id = p_repair_order_id AND deleted_at IS NULL;

  IF v_ro IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Repair order not found');
  END IF;

  IF v_ro.status NOT IN ('done', 'delivered') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Repair order must be done or delivered');
  END IF;

  IF v_ro.is_chargeable = false THEN
    RETURN jsonb_build_object('success', false, 'error', 'In-warranty repair — no invoice needed');
  END IF;

  IF v_ro.invoice_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invoice already generated');
  END IF;

  -- Generate invoice number
  v_year := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(
    NULLIF(split_part(invoice_number, '-', 3), '')::int
  ), 0) + 1
  INTO v_seq
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || v_year || '-%';

  v_inv_number := 'INV-' || v_year || '-' || lpad(v_seq::text, 4, '0');
  v_inv_id := gen_random_uuid();

  v_subtotal := COALESCE(v_ro.labor_cost, 0) + COALESCE(v_ro.parts_cost, 0) + COALESCE(v_ro.additional_cost, 0) - COALESCE(v_ro.discount_amount, 0);

  -- Create invoice
  INSERT INTO invoices (
    id, invoice_number, customer_id, customer_name, customer_company,
    customer_email, customer_phone, subtotal, vat_percent, vat_amount,
    grand_total, discount_amount, status, notes, created_by, invoice_type
  ) VALUES (
    v_inv_id, v_inv_number, v_ro.customer_id, v_ro.customer_name, v_ro.customer_company,
    v_ro.customer_email, v_ro.customer_phone, v_subtotal, v_ro.vat_percent, v_ro.vat_amount,
    v_ro.grand_total, v_ro.discount_amount, 'draft',
    'สร้างจากใบสั่งซ่อม ' || v_ro.repair_order_number,
    auth.uid(), 'full'
  );

  -- Insert line items
  IF COALESCE(v_ro.labor_cost, 0) > 0 THEN
    INSERT INTO invoice_items (invoice_id, product_name, quantity, unit_price, line_total, display_order)
    VALUES (v_inv_id, 'ค่าแรงซ่อม — ' || v_ro.product_name, 1, v_ro.labor_cost, v_ro.labor_cost, v_order);
    v_order := v_order + 1;
  END IF;

  IF COALESCE(v_ro.parts_cost, 0) > 0 THEN
    INSERT INTO invoice_items (invoice_id, product_name, product_description, quantity, unit_price, line_total, display_order)
    SELECT v_inv_id, 'ชิ้นส่วน: ' || part_name, part_description, quantity, unit_price, total, v_order + sort_order
    FROM repair_order_parts WHERE repair_order_id = p_repair_order_id ORDER BY sort_order;
    v_order := v_order + 100;
  END IF;

  IF COALESCE(v_ro.additional_cost, 0) > 0 THEN
    INSERT INTO invoice_items (invoice_id, product_name, quantity, unit_price, line_total, display_order)
    VALUES (v_inv_id, 'ค่าบริการเพิ่มเติม', 1, v_ro.additional_cost, v_ro.additional_cost, v_order);
  END IF;

  -- Link invoice to RO
  UPDATE repair_orders SET invoice_id = v_inv_id, updated_at = now()
  WHERE id = p_repair_order_id;

  RETURN jsonb_build_object('success', true, 'invoice_id', v_inv_id, 'invoice_number', v_inv_number);
END;
$$;

-- RLS
ALTER TABLE public.repair_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_order_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_order_history ENABLE ROW LEVEL SECURITY;

-- Admin/sales/warehouse full access
CREATE POLICY "repair_orders_staff_all" ON public.repair_orders
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid()
    AND users.role IN ('super_admin', 'admin', 'sales', 'warehouse')
    AND users.is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid()
    AND users.role IN ('super_admin', 'admin', 'sales', 'warehouse')
    AND users.is_active = true
  ));

-- Customer read own
CREATE POLICY "repair_orders_customer_read" ON public.repair_orders
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid() AND deleted_at IS NULL);

-- Customer insert own (pending only)
CREATE POLICY "repair_orders_customer_insert" ON public.repair_orders
  FOR INSERT TO authenticated
  WITH CHECK (
    customer_id = auth.uid()
    AND status = 'pending'
    AND created_by = auth.uid()
  );

-- Parts: staff all
CREATE POLICY "repair_order_parts_staff_all" ON public.repair_order_parts
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid()
    AND users.role IN ('super_admin', 'admin', 'sales', 'warehouse')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid()
    AND users.role IN ('super_admin', 'admin', 'sales', 'warehouse')
  ));

-- Parts: customer read
CREATE POLICY "repair_order_parts_customer_read" ON public.repair_order_parts
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM repair_orders ro
    WHERE ro.id = repair_order_parts.repair_order_id
    AND ro.customer_id = auth.uid() AND ro.deleted_at IS NULL
  ));

-- History: staff all
CREATE POLICY "repair_order_history_staff_all" ON public.repair_order_history
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid()
    AND users.role IN ('super_admin', 'admin', 'sales', 'warehouse')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid()
    AND users.role IN ('super_admin', 'admin', 'sales', 'warehouse')
  ));

-- History: customer read
CREATE POLICY "repair_order_history_customer_read" ON public.repair_order_history
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM repair_orders ro
    WHERE ro.id = repair_order_history.repair_order_id
    AND ro.customer_id = auth.uid() AND ro.deleted_at IS NULL
  ));
