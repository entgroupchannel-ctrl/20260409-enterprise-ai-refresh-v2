-- Update soft_delete_invoice to free up the invoice_number for reuse
CREATE OR REPLACE FUNCTION public.soft_delete_invoice(p_invoice_id uuid, p_reason text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invoice record;
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  SELECT * INTO v_invoice FROM public.invoices WHERE id = p_invoice_id AND deleted_at IS NULL;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'ไม่พบใบวางบิลนี้ หรือถูกลบไปแล้ว');
  END IF;

  UPDATE public.invoices
  SET 
    deleted_at = now(),
    deleted_by = v_user_id,
    deletion_reason = p_reason,
    -- Append suffix to free up original invoice_number for reuse
    invoice_number = invoice_number || '_DEL_' || extract(epoch from now())::bigint::text
  WHERE id = p_invoice_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'ย้ายใบวางบิล ' || v_invoice.invoice_number || ' ไปถังขยะแล้ว',
    'invoice_number', v_invoice.invoice_number
  );
END;
$$;

-- Same for tax invoices
CREATE OR REPLACE FUNCTION public.soft_delete_tax_invoice(p_tax_invoice_id uuid, p_reason text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tax record;
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  SELECT * INTO v_tax FROM public.tax_invoices WHERE id = p_tax_invoice_id AND deleted_at IS NULL;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'ไม่พบใบกำกับภาษีนี้ หรือถูกลบไปแล้ว');
  END IF;

  UPDATE public.tax_invoices
  SET 
    deleted_at = now(),
    deleted_by = v_user_id,
    deletion_reason = p_reason,
    tax_invoice_number = tax_invoice_number || '_DEL_' || extract(epoch from now())::bigint::text
  WHERE id = p_tax_invoice_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'ย้ายใบกำกับภาษี ' || v_tax.tax_invoice_number || ' ไปถังขยะแล้ว',
    'tax_invoice_number', v_tax.tax_invoice_number
  );
END;
$$;

-- Free up the existing deleted INV202604190003 so it can be recreated
UPDATE public.invoices
SET invoice_number = invoice_number || '_DEL_' || extract(epoch from deleted_at)::bigint::text
WHERE deleted_at IS NOT NULL
  AND invoice_number NOT LIKE '%_DEL_%';

UPDATE public.tax_invoices
SET tax_invoice_number = tax_invoice_number || '_DEL_' || extract(epoch from deleted_at)::bigint::text
WHERE deleted_at IS NOT NULL
  AND tax_invoice_number NOT LIKE '%_DEL_%';