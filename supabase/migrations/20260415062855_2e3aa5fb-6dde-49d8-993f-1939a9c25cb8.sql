
-- Fix approve_transfer_request to use link_type/link_id
CREATE OR REPLACE FUNCTION public.approve_transfer_request(p_transfer_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_transfer RECORD;
  v_is_super BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT public.is_super_admin(v_user_id) INTO v_is_super;
  IF NOT v_is_super THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only super_admin can approve transfers');
  END IF;

  SELECT * INTO v_transfer FROM international_transfer_requests
  WHERE id = p_transfer_id AND deleted_at IS NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transfer not found');
  END IF;

  IF v_transfer.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transfer is not pending');
  END IF;

  UPDATE international_transfer_requests
  SET status = 'approved', approved_at = now(), approved_by = v_user_id, updated_at = now()
  WHERE id = p_transfer_id;

  IF v_transfer.created_by IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, priority, action_url, action_label, link_type, link_id)
    VALUES (
      v_transfer.created_by, 'transfer_approved',
      '✅ คำขอโอนเงินได้รับอนุมัติแล้ว',
      v_transfer.transfer_number || ' — ' || v_transfer.currency || ' ' || TO_CHAR(v_transfer.amount, 'FM999,999,999.00') || ' อนุมัติแล้ว',
      'normal', '/admin/international-transfer', 'ดูรายละเอียด',
      'transfer', p_transfer_id::text
    );
  END IF;

  RETURN jsonb_build_object('success', true, 'transfer_number', v_transfer.transfer_number);
END;
$$;

-- Fix reject_transfer_request
CREATE OR REPLACE FUNCTION public.reject_transfer_request(p_transfer_id UUID, p_reason TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_transfer RECORD;
  v_is_super BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT public.is_super_admin(v_user_id) INTO v_is_super;
  IF NOT v_is_super THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only super_admin can reject transfers');
  END IF;

  SELECT * INTO v_transfer FROM international_transfer_requests
  WHERE id = p_transfer_id AND deleted_at IS NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transfer not found');
  END IF;

  IF v_transfer.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transfer is not pending');
  END IF;

  UPDATE international_transfer_requests
  SET status = 'rejected', rejection_reason = p_reason, updated_at = now()
  WHERE id = p_transfer_id;

  IF v_transfer.created_by IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, priority, action_url, action_label, link_type, link_id)
    VALUES (
      v_transfer.created_by, 'transfer_rejected',
      '❌ คำขอโอนเงินถูกปฏิเสธ',
      v_transfer.transfer_number || ' ถูกปฏิเสธ: ' || COALESCE(p_reason, '-'),
      'high', '/admin/international-transfer', 'ดูรายละเอียด',
      'transfer', p_transfer_id::text
    );
  END IF;

  RETURN jsonb_build_object('success', true, 'transfer_number', v_transfer.transfer_number);
END;
$$;

-- Fix confirm_transfer_sent
CREATE OR REPLACE FUNCTION public.confirm_transfer_sent(p_transfer_id UUID, p_slip_url TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_transfer RECORD;
  v_is_authorized BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT public.is_admin_or_above(v_user_id) INTO v_is_authorized;
  IF NOT v_is_authorized THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  SELECT * INTO v_transfer FROM international_transfer_requests
  WHERE id = p_transfer_id AND deleted_at IS NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transfer not found');
  END IF;

  IF v_transfer.status != 'approved' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transfer must be approved first');
  END IF;

  UPDATE international_transfer_requests
  SET status = 'transferred', transferred_at = now(), 
      transfer_slip_url = COALESCE(p_slip_url, transfer_slip_url),
      updated_at = now()
  WHERE id = p_transfer_id;

  IF v_transfer.created_by IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, priority, action_url, action_label, link_type, link_id)
    VALUES (
      v_transfer.created_by, 'transfer_completed',
      '💸 โอนเงินเรียบร้อยแล้ว',
      v_transfer.transfer_number || ' — ' || v_transfer.currency || ' ' || TO_CHAR(v_transfer.amount, 'FM999,999,999.00') || ' โอนสำเร็จ',
      'normal', '/admin/international-transfer', 'ดูรายละเอียด',
      'transfer', p_transfer_id::text
    );
  END IF;

  RETURN jsonb_build_object('success', true, 'transfer_number', v_transfer.transfer_number);
END;
$$;
