
DO $$
DECLARE
  v_quote RECORD;
  v_revision_id UUID;
  v_count INT := 0;
BEGIN
  FOR v_quote IN
    SELECT 
      qr.id,
      qr.quote_number,
      qr.products,
      qr.subtotal,
      qr.discount_percent,
      qr.discount_amount,
      qr.vat_percent,
      qr.vat_amount,
      qr.grand_total,
      qr.valid_until,
      qr.sent_at,
      qr.created_at,
      qr.notes,
      qr.internal_notes
    FROM public.quote_requests qr
    WHERE qr.status IN ('quote_sent', 'negotiating', 'accepted')
      AND qr.current_revision_id IS NULL
      AND qr.grand_total > 0
  LOOP
    INSERT INTO public.quote_revisions (
      quote_id,
      revision_number,
      revision_type,
      created_by_name,
      created_by_role,
      created_at,
      products,
      subtotal,
      discount_percent,
      discount_amount,
      vat_percent,
      vat_amount,
      grand_total,
      change_reason,
      requires_approval,
      approval_status,
      status,
      sent_at,
      valid_until,
      internal_notes
    ) VALUES (
      v_quote.id,
      1,
      'initial',
      'System (backfill)',
      'system',
      COALESCE(v_quote.sent_at, v_quote.created_at),
      COALESCE(v_quote.products, '[]'::jsonb),
      COALESCE(v_quote.subtotal, 0),
      COALESCE(v_quote.discount_percent, 0),
      COALESCE(v_quote.discount_amount, 0),
      COALESCE(v_quote.vat_percent, 7),
      COALESCE(v_quote.vat_amount, 0),
      v_quote.grand_total,
      'Backfilled from initial send',
      false,
      'none',
      'sent',
      COALESCE(v_quote.sent_at, v_quote.created_at),
      v_quote.valid_until,
      v_quote.internal_notes
    )
    RETURNING id INTO v_revision_id;
    
    UPDATE public.quote_requests
    SET 
      current_revision_id = v_revision_id,
      current_revision_number = 1,
      total_revisions = 1
    WHERE id = v_quote.id;
    
    v_count := v_count + 1;
    RAISE NOTICE '  ✅ Backfilled: % (id: %)', v_quote.quote_number, v_quote.id;
  END LOOP;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Backfilled % quote(s) with initial revision', v_count;
  RAISE NOTICE '========================================';
END $$;

DO $$
DECLARE
  v_orphan_count INT;
BEGIN
  SELECT COUNT(*) INTO v_orphan_count
  FROM public.quote_requests
  WHERE status IN ('quote_sent', 'negotiating', 'accepted')
    AND current_revision_id IS NULL
    AND grand_total > 0;
  
  IF v_orphan_count > 0 THEN
    RAISE WARNING '⚠️ % sent quotes still without revision', v_orphan_count;
  ELSE
    RAISE NOTICE '✅ All sent quotes have revisions';
  END IF;
END $$;
