BEGIN;

-- Phase 1: Add soft delete columns
ALTER TABLE public.receipts
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS delete_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_receipts_deleted_at
  ON public.receipts(deleted_at)
  WHERE deleted_at IS NOT NULL;

-- Phase 2: Update customer RLS — hide deleted
DROP POLICY IF EXISTS "billing_receipts_customer_read" ON public.receipts;
CREATE POLICY "billing_receipts_customer_read" ON public.receipts FOR SELECT
  USING (customer_id = auth.uid() AND deleted_at IS NULL);

-- Phase 3: RPC Functions

-- Soft delete
CREATE OR REPLACE FUNCTION public.soft_delete_receipt(
  p_receipt_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_receipt_number TEXT;
  v_is_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(SELECT 1 FROM users WHERE id = v_user_id AND role IN ('admin','sales'))
    INTO v_is_admin;
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Admin/Sales only';
  END IF;

  SELECT receipt_number INTO v_receipt_number
  FROM receipts WHERE id = p_receipt_id AND deleted_at IS NULL;

  IF v_receipt_number IS NULL THEN
    RAISE EXCEPTION 'Receipt not found or already deleted';
  END IF;

  UPDATE receipts
  SET deleted_at = NOW(), deleted_by = v_user_id, delete_reason = p_reason
  WHERE id = p_receipt_id;

  RETURN jsonb_build_object(
    'success', true,
    'receipt_number', v_receipt_number,
    'message', 'ใบเสร็จ ' || v_receipt_number || ' ถูกย้ายไปถังขยะแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_receipt(UUID, TEXT) TO authenticated;

-- Restore
CREATE OR REPLACE FUNCTION public.restore_receipt(p_receipt_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_receipt_number TEXT;
  v_is_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  SELECT EXISTS(SELECT 1 FROM users WHERE id = v_user_id AND role IN ('admin','sales'))
    INTO v_is_admin;
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Admin/Sales only';
  END IF;

  SELECT receipt_number INTO v_receipt_number
  FROM receipts WHERE id = p_receipt_id AND deleted_at IS NOT NULL;

  IF v_receipt_number IS NULL THEN
    RAISE EXCEPTION 'Receipt not found in trash';
  END IF;

  UPDATE receipts
  SET deleted_at = NULL, deleted_by = NULL, delete_reason = NULL
  WHERE id = p_receipt_id;

  RETURN jsonb_build_object(
    'success', true,
    'receipt_number', v_receipt_number,
    'message', 'ใบเสร็จ ' || v_receipt_number || ' ถูกกู้คืนแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.restore_receipt(UUID) TO authenticated;

-- Permanent delete (super admin only)
CREATE OR REPLACE FUNCTION public.permanent_delete_receipt(p_receipt_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_receipt_number TEXT;
  v_is_super_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  SELECT EXISTS(SELECT 1 FROM users WHERE id = v_user_id AND role = 'admin')
    INTO v_is_super_admin;
  IF NOT v_is_super_admin THEN
    RAISE EXCEPTION 'Unauthorized: Super admin only';
  END IF;

  SELECT receipt_number INTO v_receipt_number
  FROM receipts WHERE id = p_receipt_id AND deleted_at IS NOT NULL;

  IF v_receipt_number IS NULL THEN
    RAISE EXCEPTION 'Receipt not found in trash';
  END IF;

  DELETE FROM receipts WHERE id = p_receipt_id;

  RETURN jsonb_build_object(
    'success', true,
    'receipt_number', v_receipt_number,
    'message', 'ใบเสร็จ ' || v_receipt_number || ' ถูกลบถาวรแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.permanent_delete_receipt(UUID) TO authenticated;

-- Empty trash (super admin only)
CREATE OR REPLACE FUNCTION public.empty_receipt_trash()
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

  DELETE FROM receipts WHERE deleted_at IS NOT NULL;
  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'deleted_count', v_count,
    'message', 'ลบ ' || v_count || ' ใบเสร็จออกจากถังขยะ'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.empty_receipt_trash() TO authenticated;

COMMIT;