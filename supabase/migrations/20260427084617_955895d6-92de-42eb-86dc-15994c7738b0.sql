
-- Step 1: Restore Rev 1 back to the original customer request (GTY156T)
UPDATE public.quote_revisions
SET
  products = '[{"qty": 1, "model": "GTY156T", "line_total": 0, "unit_price": 0, "description": "15.6\" FHD 1920×1080 FANLESS", "discount_percent": 0}]'::jsonb,
  free_items = '[]'::jsonb,
  subtotal = 0.00,
  discount_percent = 0.00,
  discount_amount = 0.00,
  vat_amount = 0.00,
  grand_total = 0.00,
  change_reason = 'ใบเสนอราคาเริ่มต้น'
WHERE id = '44da3b19-4dfe-44e4-bccc-325ef79b67c4';

-- Step 2: Create Rev 2 as admin_revision (draft) with GK1506 products
INSERT INTO public.quote_revisions (
  quote_id, revision_number, revision_type, created_by, created_by_name, created_by_role,
  products, free_items,
  subtotal, discount_type, discount_percent, discount_amount,
  vat_percent, vat_amount, grand_total,
  change_reason, requires_approval, approval_status, status
)
SELECT
  'f5fd15bc-0dc3-49d1-a175-417a044e22ab',
  2,
  'admin_revision',
  qr.assigned_to,
  u.full_name,
  u.role,
  qr.products,
  COALESCE(qr.free_items, '[]'::jsonb),
  qr.subtotal,
  COALESCE(qr.discount_type, 'percent'),
  qr.discount_percent,
  qr.discount_amount,
  qr.vat_percent,
  qr.vat_amount,
  qr.grand_total,
  'Admin updated products from GTY156T to GK1506',
  false,
  'none',
  'draft'
FROM public.quote_requests qr
LEFT JOIN public.users u ON u.id = qr.assigned_to
WHERE qr.id = 'f5fd15bc-0dc3-49d1-a175-417a044e22ab';

-- Step 3: Point quote_requests.current_revision to the new Rev 2
UPDATE public.quote_requests
SET
  current_revision_id = (
    SELECT id FROM public.quote_revisions
    WHERE quote_id = 'f5fd15bc-0dc3-49d1-a175-417a044e22ab'
      AND revision_number = 2
    LIMIT 1
  ),
  current_revision_number = 2,
  total_revisions = 2
WHERE id = 'f5fd15bc-0dc3-49d1-a175-417a044e22ab';
