-- ============================================================
-- Phase 1: Add soft delete columns to quote_requests
-- ============================================================

ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS deleted_by UUID DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS delete_reason TEXT;

-- Index for fast trash queries
CREATE INDEX IF NOT EXISTS idx_quote_requests_deleted_at 
  ON public.quote_requests(deleted_at) 
  WHERE deleted_at IS NOT NULL;

-- ============================================================
-- Phase 2: Update RLS — customer should never see deleted quotes
-- ============================================================

DROP POLICY IF EXISTS "quote_select_own" ON public.quote_requests;

CREATE POLICY "quote_select_own" ON public.quote_requests
FOR SELECT 
USING (
  customer_email = (SELECT email FROM users WHERE id = auth.uid())
  AND deleted_at IS NULL
);

-- Admin policy stays unchanged — admin needs to see trash too
-- Frontend will filter via .is('deleted_at', null) for normal list

-- ============================================================
-- Phase 3: RPC functions for soft delete operations
-- ============================================================

-- Soft delete (move to trash)
CREATE OR REPLACE FUNCTION public.soft_delete_quote(
  p_quote_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_quote_number TEXT;
  v_has_so BOOLEAN;
  v_is_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id AND role IN ('admin', 'sales')
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Admin/Sales only';
  END IF;
  
  SELECT quote_number, COALESCE(has_sale_order, false) 
    INTO v_quote_number, v_has_so
  FROM quote_requests 
  WHERE id = p_quote_id;
  
  IF v_quote_number IS NULL THEN
    RAISE EXCEPTION 'Quote not found';
  END IF;
  
  IF v_has_so THEN
    RAISE EXCEPTION 'ไม่สามารถลบได้: ใบเสนอราคานี้มี Sale Order แล้ว กรุณายกเลิก SO ก่อน';
  END IF;
  
  UPDATE quote_requests
  SET 
    deleted_at = NOW(),
    deleted_by = v_user_id,
    delete_reason = p_reason
  WHERE id = p_quote_id 
    AND deleted_at IS NULL;
  
  RETURN jsonb_build_object(
    'success', true,
    'quote_number', v_quote_number,
    'message', 'ใบเสนอราคา ' || v_quote_number || ' ถูกย้ายไปถังขยะแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_quote(UUID, TEXT) TO authenticated;

-- Restore from trash
CREATE OR REPLACE FUNCTION public.restore_quote(p_quote_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_quote_number TEXT;
  v_is_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id AND role IN ('admin', 'sales')
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Admin/Sales only';
  END IF;
  
  SELECT quote_number INTO v_quote_number
  FROM quote_requests 
  WHERE id = p_quote_id AND deleted_at IS NOT NULL;
  
  IF v_quote_number IS NULL THEN
    RAISE EXCEPTION 'Quote not found in trash';
  END IF;
  
  UPDATE quote_requests
  SET 
    deleted_at = NULL,
    deleted_by = NULL,
    delete_reason = NULL
  WHERE id = p_quote_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'quote_number', v_quote_number,
    'message', 'ใบเสนอราคา ' || v_quote_number || ' ถูกกู้คืนแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.restore_quote(UUID) TO authenticated;

-- Permanent delete (admin only — not sales)
CREATE OR REPLACE FUNCTION public.permanent_delete_quote(p_quote_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_quote_number TEXT;
  v_is_super_admin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id AND role = 'admin'
  ) INTO v_is_super_admin;
  
  IF NOT v_is_super_admin THEN
    RAISE EXCEPTION 'Unauthorized: Super admin only';
  END IF;
  
  SELECT quote_number INTO v_quote_number
  FROM quote_requests 
  WHERE id = p_quote_id AND deleted_at IS NOT NULL;
  
  IF v_quote_number IS NULL THEN
    RAISE EXCEPTION 'Quote not found in trash. Move to trash first.';
  END IF;
  
  DELETE FROM quote_requests WHERE id = p_quote_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'quote_number', v_quote_number,
    'message', 'ใบเสนอราคา ' || v_quote_number || ' ถูกลบถาวรแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.permanent_delete_quote(UUID) TO authenticated;

-- Empty entire trash (admin only)
CREATE OR REPLACE FUNCTION public.empty_quote_trash()
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
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id AND role = 'admin'
  ) INTO v_is_super_admin;
  
  IF NOT v_is_super_admin THEN
    RAISE EXCEPTION 'Unauthorized: Super admin only';
  END IF;
  
  DELETE FROM quote_requests WHERE deleted_at IS NOT NULL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  RETURN jsonb_build_object(
    'success', true,
    'deleted_count', v_count,
    'message', 'ลบ ' || v_count || ' ใบเสนอราคาออกจากถังขยะ'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.empty_quote_trash() TO authenticated;