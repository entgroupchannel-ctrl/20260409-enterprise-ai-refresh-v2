-- STEP 1: ขยาย CHECK constraint
ALTER TABLE public.quote_requests
  DROP CONSTRAINT IF EXISTS quote_requests_status_check;

ALTER TABLE public.quote_requests
  ADD CONSTRAINT quote_requests_status_check
  CHECK (status IN (
    'pending',
    'quote_sent',
    'negotiating',
    'accepted',
    'po_uploaded',
    'po_confirmed',
    'po_approved',
    'completed',
    'cancelled',
    'expired'
  ));

-- STEP 2: อัปเดต update_quote_status function
CREATE OR REPLACE FUNCTION public.update_quote_status(
  p_quote_id uuid,
  p_new_status text,
  p_admin_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old_status text;
  v_quote record;
  v_so_id uuid;
BEGIN
  SELECT * INTO v_quote FROM quote_requests WHERE id = p_quote_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quote not found: %', p_quote_id;
  END IF;

  v_old_status := v_quote.status;

  IF p_new_status NOT IN (
    'pending', 'quote_sent', 'negotiating', 'accepted',
    'po_uploaded', 'po_confirmed', 'po_approved',
    'completed', 'cancelled', 'expired'
  ) THEN
    RAISE EXCEPTION 'Invalid status: %', p_new_status;
  END IF;

  UPDATE quote_requests
  SET status = p_new_status, updated_at = now()
  WHERE id = p_quote_id;

  INSERT INTO quote_messages (quote_id, sender_name, sender_role, sender_id, content, message_type)
  VALUES (
    p_quote_id, 'System', 'system', p_admin_id,
    'เปลี่ยนสถานะจาก "' || v_old_status || '" เป็น "' || p_new_status || '"',
    'status_change'
  );

  IF p_new_status = 'po_approved' AND v_old_status != 'po_approved' THEN
    IF NOT EXISTS (SELECT 1 FROM sale_orders WHERE quote_id = p_quote_id AND deleted_at IS NULL) THEN
      INSERT INTO sale_orders (
        quote_id, user_id, customer_name, customer_email, customer_phone,
        customer_company, customer_address, customer_tax_id,
        subtotal, discount_amount, vat_amount, grand_total,
        po_number, status
      )
      VALUES (
        p_quote_id, v_quote.user_id,
        COALESCE(v_quote.customer_name, v_quote.name, 'ลูกค้า'),
        COALESCE(v_quote.customer_email, v_quote.email, ''),
        COALESCE(v_quote.customer_phone, v_quote.phone),
        COALESCE(v_quote.customer_company, v_quote.company),
        v_quote.customer_address,
        v_quote.customer_tax_id,
        COALESCE(v_quote.subtotal, 0),
        COALESCE(v_quote.discount_amount, 0),
        COALESCE(v_quote.vat_amount, 0),
        COALESCE(v_quote.grand_total, 0),
        v_quote.po_number,
        'pending'
      )
      RETURNING id INTO v_so_id;

      IF v_so_id IS NOT NULL THEN
        UPDATE quote_requests SET has_sale_order = true WHERE id = p_quote_id;
      END IF;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'old_status', v_old_status,
    'new_status', p_new_status
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_quote_status TO authenticated;