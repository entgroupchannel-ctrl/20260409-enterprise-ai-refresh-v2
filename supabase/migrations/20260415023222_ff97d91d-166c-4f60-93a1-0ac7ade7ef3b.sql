BEGIN;

-- =====================================================
-- CATEGORY 1: QUOTE (4 functions)
-- =====================================================

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
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin','sales')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin/Sales only';
  END IF;

  SELECT quote_number INTO v_quote_number
  FROM quote_requests 
  WHERE id = p_quote_id AND deleted_at IS NULL;

  IF v_quote_number IS NULL THEN
    RAISE EXCEPTION 'Quote not found or already deleted';
  END IF;

  UPDATE quote_requests
  SET deleted_at = NOW(), deleted_by = v_user_id, delete_reason = p_reason
  WHERE id = p_quote_id;

  RETURN jsonb_build_object(
    'success', true,
    'quote_number', v_quote_number,
    'message', 'ใบเสนอราคา ' || v_quote_number || ' ถูกย้ายไปถังขยะแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_quote(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.restore_quote(p_quote_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_quote_number TEXT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin','sales')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin/Sales only';
  END IF;

  SELECT quote_number INTO v_quote_number
  FROM quote_requests 
  WHERE id = p_quote_id AND deleted_at IS NOT NULL;

  IF v_quote_number IS NULL THEN
    RAISE EXCEPTION 'Quote not found in trash';
  END IF;

  UPDATE quote_requests
  SET deleted_at = NULL, deleted_by = NULL, delete_reason = NULL
  WHERE id = p_quote_id;

  RETURN jsonb_build_object(
    'success', true,
    'quote_number', v_quote_number,
    'message', 'ใบเสนอราคา ' || v_quote_number || ' ถูกกู้คืนแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.restore_quote(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.permanent_delete_quote(p_quote_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_quote_number TEXT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin only for permanent delete';
  END IF;

  SELECT quote_number INTO v_quote_number
  FROM quote_requests 
  WHERE id = p_quote_id AND deleted_at IS NOT NULL;

  IF v_quote_number IS NULL THEN
    RAISE EXCEPTION 'Quote not found in trash';
  END IF;

  DELETE FROM quote_requests WHERE id = p_quote_id;

  RETURN jsonb_build_object(
    'success', true,
    'quote_number', v_quote_number,
    'message', 'ลบใบเสนอราคา ' || v_quote_number || ' ถาวรแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.permanent_delete_quote(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.empty_quote_trash()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_count INT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin only';
  END IF;

  SELECT COUNT(*) INTO v_count
  FROM quote_requests WHERE deleted_at IS NOT NULL;

  DELETE FROM quote_requests WHERE deleted_at IS NOT NULL;

  RETURN jsonb_build_object(
    'success', true,
    'count', v_count,
    'message', 'ลบใบเสนอราคาในถังขยะ ' || v_count || ' รายการแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.empty_quote_trash() TO authenticated;

-- =====================================================
-- CATEGORY 2: INVOICE (4 functions)
-- =====================================================

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
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin','sales')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin/Sales only';
  END IF;

  SELECT invoice_number INTO v_invoice_number
  FROM invoices WHERE id = p_invoice_id AND deleted_at IS NULL;

  IF v_invoice_number IS NULL THEN
    RAISE EXCEPTION 'Invoice not found or already deleted';
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

CREATE OR REPLACE FUNCTION public.restore_invoice(p_invoice_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_invoice_number TEXT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin','sales')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin/Sales only';
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

CREATE OR REPLACE FUNCTION public.permanent_delete_invoice(p_invoice_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_invoice_number TEXT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin only for permanent delete';
  END IF;

  SELECT invoice_number INTO v_invoice_number
  FROM invoices WHERE id = p_invoice_id AND deleted_at IS NOT NULL;

  IF v_invoice_number IS NULL THEN
    RAISE EXCEPTION 'Invoice not found in trash';
  END IF;

  DELETE FROM invoices WHERE id = p_invoice_id;

  RETURN jsonb_build_object(
    'success', true,
    'invoice_number', v_invoice_number,
    'message', 'ลบใบวางบิล ' || v_invoice_number || ' ถาวรแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.permanent_delete_invoice(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.empty_invoice_trash()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_count INT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin only';
  END IF;

  SELECT COUNT(*) INTO v_count FROM invoices WHERE deleted_at IS NOT NULL;
  DELETE FROM invoices WHERE deleted_at IS NOT NULL;

  RETURN jsonb_build_object(
    'success', true,
    'count', v_count,
    'message', 'ลบใบวางบิลในถังขยะ ' || v_count || ' รายการแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.empty_invoice_trash() TO authenticated;

-- =====================================================
-- CATEGORY 3: TAX INVOICE (4 functions)
-- =====================================================

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
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin','sales')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin/Sales only';
  END IF;

  SELECT tax_invoice_number INTO v_tax_invoice_number
  FROM tax_invoices WHERE id = p_tax_invoice_id AND deleted_at IS NULL;

  IF v_tax_invoice_number IS NULL THEN
    RAISE EXCEPTION 'Tax invoice not found or already deleted';
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

CREATE OR REPLACE FUNCTION public.restore_tax_invoice(p_tax_invoice_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_tax_invoice_number TEXT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin','sales')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin/Sales only';
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

CREATE OR REPLACE FUNCTION public.permanent_delete_tax_invoice(p_tax_invoice_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_tax_invoice_number TEXT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin only for permanent delete';
  END IF;

  SELECT tax_invoice_number INTO v_tax_invoice_number
  FROM tax_invoices WHERE id = p_tax_invoice_id AND deleted_at IS NOT NULL;

  IF v_tax_invoice_number IS NULL THEN
    RAISE EXCEPTION 'Tax invoice not found in trash';
  END IF;

  DELETE FROM tax_invoices WHERE id = p_tax_invoice_id;

  RETURN jsonb_build_object(
    'success', true,
    'tax_invoice_number', v_tax_invoice_number,
    'message', 'ลบใบกำกับภาษี ' || v_tax_invoice_number || ' ถาวรแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.permanent_delete_tax_invoice(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.empty_tax_invoice_trash()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_count INT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin only';
  END IF;

  SELECT COUNT(*) INTO v_count FROM tax_invoices WHERE deleted_at IS NOT NULL;
  DELETE FROM tax_invoices WHERE deleted_at IS NOT NULL;

  RETURN jsonb_build_object(
    'success', true,
    'count', v_count,
    'message', 'ลบใบกำกับภาษีในถังขยะ ' || v_count || ' รายการแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.empty_tax_invoice_trash() TO authenticated;

-- =====================================================
-- CATEGORY 4: RECEIPT (4 functions)
-- =====================================================

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
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin','sales')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin/Sales only';
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

CREATE OR REPLACE FUNCTION public.restore_receipt(p_receipt_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_receipt_number TEXT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin','sales')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin/Sales only';
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

CREATE OR REPLACE FUNCTION public.permanent_delete_receipt(p_receipt_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_receipt_number TEXT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin only for permanent delete';
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
    'message', 'ลบใบเสร็จ ' || v_receipt_number || ' ถาวรแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.permanent_delete_receipt(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.empty_receipt_trash()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_count INT;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE id = v_user_id 
    AND role IN ('super_admin','admin')
    AND is_active = true
  ) INTO v_is_authorized;
  
  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Unauthorized: Super Admin/Admin only';
  END IF;

  SELECT COUNT(*) INTO v_count FROM receipts WHERE deleted_at IS NOT NULL;
  DELETE FROM receipts WHERE deleted_at IS NOT NULL;

  RETURN jsonb_build_object(
    'success', true,
    'count', v_count,
    'message', 'ลบใบเสร็จในถังขยะ ' || v_count || ' รายการแล้ว'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.empty_receipt_trash() TO authenticated;

COMMIT;