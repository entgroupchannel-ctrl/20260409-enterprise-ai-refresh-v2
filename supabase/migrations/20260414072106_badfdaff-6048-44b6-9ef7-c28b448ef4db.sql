BEGIN;

-- Phase 1: Add soft delete columns
ALTER TABLE public.tax_invoices
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS delete_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_tax_invoices_deleted_at
  ON public.tax_invoices(deleted_at)
  WHERE deleted_at IS NOT NULL;

-- Phase 2: Update customer RLS — hide deleted
DROP POLICY IF EXISTS "billing_tax_invoices_customer_read" ON public.tax_invoices;
CREATE POLICY "billing_tax_invoices_customer_read" ON public.tax_invoices FOR SELECT
  USING (customer_id = auth.uid() AND deleted_at IS NULL);

-- Phase 3: RPC Functions

-- Soft delete
CREATE OR REPLACE FUNCTION public.soft_delete_tax_invoice(
  p_tax_invoice_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_tax_invoice_number TEXT;
  v_status TEXT;
  v_receipt_count INT;
  v_is_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(SELECT 1 FROM users WHERE id = v_user_id AND role IN ('admin','sales'))
    INTO v_is_admin;
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Admin/Sales only';
  END IF;

  SELECT tax_invoice_number, status INTO v_tax_invoice_number, v_status
  FROM tax_invoices WHERE id = p_tax_invoice_id AND deleted_at IS NULL;

  IF v_tax_invoice_number IS NULL THEN
    RAISE EXCEPTION 'Tax invoice not found or already deleted';
  END IF;

  SELECT COUNT(*) INTO v_receipt_count
  FROM receipts WHERE tax_invoice_id = p_tax_invoice_id;

  IF v_receipt_count > 0 THEN
    RAISE EXCEPTION 'ไม่สามารถลบได้: มีใบเสร็จรับเงินอ้างอิง % รายการ', v_receipt_count;
  END IF;

  IF v_status = 'paid' THEN
    RAISE EXCEPTION 'ไม่สามารถลบได้: ใบกำกับภาษีนี้ชำระแล้ว';
  END IF;

  UPDATE tax_invoices
  SET deleted_at = NOW(), deleted_by = v_user_id, delete_reason = p_reason
  WHERE id = p_tax_invoice_id;

  RETURN jsonb_build_object(
    'success', true,
    'tax_invoice_number', v_tax_invoice_number,
    'message', 'ใบกำกับภาษี ' || v_tax_invoice_number || ' ถูกย้ายไปถังขยะแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_tax_invoice(UUID, TEXT) TO authenticated;

-- Restore
CREATE OR REPLACE FUNCTION public.restore_tax_invoice(p_tax_invoice_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_tax_invoice_number TEXT;
  v_is_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  SELECT EXISTS(SELECT 1 FROM users WHERE id = v_user_id AND role IN ('admin','sales'))
    INTO v_is_admin;
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Admin/Sales only';
  END IF;

  SELECT tax_invoice_number INTO v_tax_invoice_number
  FROM tax_invoices WHERE id = p_tax_invoice_id AND deleted_at IS NOT NULL;

  IF v_tax_invoice_number IS NULL THEN
    RAISE EXCEPTION 'Tax invoice not found in trash';
  END IF;

  UPDATE tax_invoices
  SET deleted_at = NULL, deleted_by = NULL, delete_reason = NULL
  WHERE id = p_tax_invoice_id;

  RETURN jsonb_build_object(
    'success', true,
    'tax_invoice_number', v_tax_invoice_number,
    'message', 'ใบกำกับภาษี ' || v_tax_invoice_number || ' ถูกกู้คืนแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.restore_tax_invoice(UUID) TO authenticated;

-- Permanent delete (super admin only)
CREATE OR REPLACE FUNCTION public.permanent_delete_tax_invoice(p_tax_invoice_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_tax_invoice_number TEXT;
  v_receipt_count INT;
  v_is_super_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  SELECT EXISTS(SELECT 1 FROM users WHERE id = v_user_id AND role = 'admin')
    INTO v_is_super_admin;
  IF NOT v_is_super_admin THEN
    RAISE EXCEPTION 'Unauthorized: Super admin only';
  END IF;

  SELECT tax_invoice_number INTO v_tax_invoice_number
  FROM tax_invoices WHERE id = p_tax_invoice_id AND deleted_at IS NOT NULL;

  IF v_tax_invoice_number IS NULL THEN
    RAISE EXCEPTION 'Tax invoice not found in trash';
  END IF;

  SELECT COUNT(*) INTO v_receipt_count
  FROM receipts WHERE tax_invoice_id = p_tax_invoice_id;
  IF v_receipt_count > 0 THEN
    RAISE EXCEPTION 'Cannot permanently delete: receipts exist';
  END IF;

  DELETE FROM tax_invoice_items WHERE tax_invoice_id = p_tax_invoice_id;
  DELETE FROM tax_invoices WHERE id = p_tax_invoice_id;

  RETURN jsonb_build_object(
    'success', true,
    'tax_invoice_number', v_tax_invoice_number,
    'message', 'ใบกำกับภาษี ' || v_tax_invoice_number || ' ถูกลบถาวรแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.permanent_delete_tax_invoice(UUID) TO authenticated;

-- Empty trash (super admin only)
CREATE OR REPLACE FUNCTION public.empty_tax_invoice_trash()
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

  DELETE FROM tax_invoice_items
  WHERE tax_invoice_id IN (
    SELECT ti.id FROM tax_invoices ti
    WHERE ti.deleted_at IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM receipts WHERE tax_invoice_id = ti.id)
  );
  
  DELETE FROM tax_invoices ti
  WHERE ti.deleted_at IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM receipts WHERE tax_invoice_id = ti.id);
  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'deleted_count', v_count,
    'message', 'ลบ ' || v_count || ' ใบกำกับภาษีออกจากถังขยะ'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.empty_tax_invoice_trash() TO authenticated;

COMMIT;