-- Add soft delete columns
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS delete_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_invoices_deleted_at
  ON public.invoices(deleted_at)
  WHERE deleted_at IS NOT NULL;

-- Update customer RLS — hide deleted invoices
DROP POLICY IF EXISTS "billing_invoices_customer_read" ON public.invoices;
CREATE POLICY "billing_invoices_customer_read" ON public.invoices FOR SELECT
  USING (customer_id = auth.uid() AND deleted_at IS NULL);

-- Soft delete
CREATE OR REPLACE FUNCTION public.soft_delete_invoice(
  p_invoice_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_invoice_number TEXT;
  v_status TEXT;
  v_payment_count INT;
  v_is_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(SELECT 1 FROM users WHERE id = v_user_id AND role IN ('admin','sales'))
    INTO v_is_admin;
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Admin/Sales only';
  END IF;

  SELECT invoice_number, status INTO v_invoice_number, v_status
  FROM invoices WHERE id = p_invoice_id AND deleted_at IS NULL;

  IF v_invoice_number IS NULL THEN
    RAISE EXCEPTION 'Invoice not found or already deleted';
  END IF;

  SELECT COUNT(*) INTO v_payment_count
  FROM payment_records WHERE invoice_id = p_invoice_id;

  IF v_payment_count > 0 THEN
    RAISE EXCEPTION 'ไม่สามารถลบได้: มีบันทึกการชำระเงิน % รายการ', v_payment_count;
  END IF;

  IF v_status IN ('paid', 'partially_paid') THEN
    RAISE EXCEPTION 'ไม่สามารถลบได้: สถานะ "%" ไม่อนุญาตให้ลบ', v_status;
  END IF;

  UPDATE invoices
  SET deleted_at = NOW(), deleted_by = v_user_id, delete_reason = p_reason
  WHERE id = p_invoice_id;

  RETURN jsonb_build_object(
    'success', true,
    'invoice_number', v_invoice_number,
    'message', 'ใบวางบิล ' || v_invoice_number || ' ถูกย้ายไปถังขยะแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_invoice(UUID, TEXT) TO authenticated;

-- Restore
CREATE OR REPLACE FUNCTION public.restore_invoice(p_invoice_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_invoice_number TEXT;
  v_is_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  SELECT EXISTS(SELECT 1 FROM users WHERE id = v_user_id AND role IN ('admin','sales'))
    INTO v_is_admin;
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Admin/Sales only';
  END IF;

  SELECT invoice_number INTO v_invoice_number
  FROM invoices WHERE id = p_invoice_id AND deleted_at IS NOT NULL;

  IF v_invoice_number IS NULL THEN
    RAISE EXCEPTION 'Invoice not found in trash';
  END IF;

  UPDATE invoices
  SET deleted_at = NULL, deleted_by = NULL, delete_reason = NULL
  WHERE id = p_invoice_id;

  RETURN jsonb_build_object(
    'success', true,
    'invoice_number', v_invoice_number,
    'message', 'ใบวางบิล ' || v_invoice_number || ' ถูกกู้คืนแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.restore_invoice(UUID) TO authenticated;

-- Permanent delete (super admin only)
CREATE OR REPLACE FUNCTION public.permanent_delete_invoice(p_invoice_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_invoice_number TEXT;
  v_is_super_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  SELECT EXISTS(SELECT 1 FROM users WHERE id = v_user_id AND role = 'admin')
    INTO v_is_super_admin;
  IF NOT v_is_super_admin THEN
    RAISE EXCEPTION 'Unauthorized: Super admin only';
  END IF;

  SELECT invoice_number INTO v_invoice_number
  FROM invoices WHERE id = p_invoice_id AND deleted_at IS NOT NULL;

  IF v_invoice_number IS NULL THEN
    RAISE EXCEPTION 'Invoice not found in trash';
  END IF;

  DELETE FROM invoice_items WHERE invoice_id = p_invoice_id;
  DELETE FROM invoices WHERE id = p_invoice_id;

  RETURN jsonb_build_object(
    'success', true,
    'invoice_number', v_invoice_number,
    'message', 'ใบวางบิล ' || v_invoice_number || ' ถูกลบถาวรแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.permanent_delete_invoice(UUID) TO authenticated;

-- Empty trash (super admin only)
CREATE OR REPLACE FUNCTION public.empty_invoice_trash()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_is_super_admin BOOLEAN;
  v_count INT;
BEGIN
  v_user_id := auth.uid();
  SELECT EXISTS(SELECT 1 FROM users WHERE id = v_user_id AND role = 'admin')
    INTO v_is_super_admin;
  IF NOT v_is_super_admin THEN
    RAISE EXCEPTION 'Unauthorized: Super admin only';
  END IF;

  DELETE FROM invoice_items
  WHERE invoice_id IN (SELECT id FROM invoices WHERE deleted_at IS NOT NULL);
  
  DELETE FROM invoices WHERE deleted_at IS NOT NULL;
  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'deleted_count', v_count,
    'message', 'ลบ ' || v_count || ' ใบวางบิลออกจากถังขยะ'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.empty_invoice_trash() TO authenticated;