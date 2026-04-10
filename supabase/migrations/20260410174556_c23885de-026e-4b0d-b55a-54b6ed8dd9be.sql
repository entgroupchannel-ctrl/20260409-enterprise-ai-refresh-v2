-- =============================================
-- 1. Function: Auto-expire quotes
-- =============================================
CREATE OR REPLACE FUNCTION public.expire_old_quotes()
RETURNS TABLE(expired_count INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  WITH updated AS (
    UPDATE quote_requests
    SET 
      status = 'expired',
      expired_at = now()
    WHERE 
      status IN ('quote_sent', 'negotiating')
      AND valid_until IS NOT NULL
      AND valid_until < CURRENT_DATE
    RETURNING id
  )
  SELECT COUNT(*) INTO v_count FROM updated;

  UPDATE quote_revisions
  SET status = 'superseded'
  WHERE quote_id IN (
    SELECT id FROM quote_requests 
    WHERE status = 'expired' 
      AND expired_at >= now() - INTERVAL '1 minute'
  )
  AND status = 'sent';

  INSERT INTO quote_messages (quote_id, sender_name, sender_role, content, message_type)
  SELECT 
    id, 'System', 'system',
    '⏱️ ใบเสนอราคาหมดอายุแล้ว — กรุณาติดต่อทีมขายเพื่อขอใบเสนอราคาใหม่',
    'system'
  FROM quote_requests
  WHERE status = 'expired'
    AND expired_at >= now() - INTERVAL '1 minute';

  RETURN QUERY SELECT v_count;
END;
$$;

-- =============================================
-- 2. Function: Get pending approvals count
-- =============================================
CREATE OR REPLACE FUNCTION public.count_pending_approvals()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM quote_revisions
  WHERE requires_approval = true
    AND approval_status = 'pending';
$$;

-- =============================================
-- 3. Function: Approve revision
-- =============================================
CREATE OR REPLACE FUNCTION public.approve_revision(
  p_revision_id UUID,
  p_approver_id UUID,
  p_send_to_customer BOOLEAN DEFAULT true
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_revision RECORD;
  v_quote_id UUID;
BEGIN
  SELECT * INTO v_revision
  FROM quote_revisions
  WHERE id = p_revision_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Revision not found');
  END IF;

  IF v_revision.approval_status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Revision is not pending approval');
  END IF;

  v_quote_id := v_revision.quote_id;

  UPDATE quote_revisions
  SET 
    approval_status = 'approved',
    approved_by = p_approver_id,
    approved_at = now(),
    status = CASE WHEN p_send_to_customer THEN 'sent' ELSE 'draft' END,
    sent_at = CASE WHEN p_send_to_customer THEN now() ELSE NULL END
  WHERE id = p_revision_id;

  IF p_send_to_customer THEN
    UPDATE quote_requests
    SET 
      status = 'negotiating',
      sent_at = now()
    WHERE id = v_quote_id;

    INSERT INTO quote_messages (quote_id, sender_name, sender_role, content, message_type)
    VALUES (
      v_quote_id, 'System', 'system',
      '✅ Counter Offer ได้รับการอนุมัติและส่งให้ลูกค้าแล้ว',
      'status_change'
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'revision_id', p_revision_id,
    'quote_id', v_quote_id
  );
END;
$$;

-- =============================================
-- 4. Function: Reject revision
-- =============================================
CREATE OR REPLACE FUNCTION public.reject_revision(
  p_revision_id UUID,
  p_approver_id UUID,
  p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_revision RECORD;
BEGIN
  SELECT * INTO v_revision
  FROM quote_revisions
  WHERE id = p_revision_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Revision not found');
  END IF;

  IF v_revision.approval_status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Revision is not pending approval');
  END IF;

  UPDATE quote_revisions
  SET 
    approval_status = 'rejected',
    approved_by = p_approver_id,
    approved_at = now(),
    status = 'rejected',
    internal_notes = COALESCE(internal_notes || E'\n', '') || '❌ Rejected by approver: ' || p_reason
  WHERE id = p_revision_id;

  RETURN jsonb_build_object('success', true);
END;
$$;