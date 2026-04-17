
-- Receipt share links table
CREATE TABLE IF NOT EXISTS public.receipt_share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id UUID NOT NULL REFERENCES public.receipts(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID,
  view_count INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_receipt_share_links_receipt ON public.receipt_share_links(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_share_links_token ON public.receipt_share_links(token);

ALTER TABLE public.receipt_share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage receipt share links"
  ON public.receipt_share_links FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales']));

-- Access log
CREATE TABLE IF NOT EXISTS public.receipt_share_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_link_id UUID NOT NULL REFERENCES public.receipt_share_links(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_receipt_share_access_log_link ON public.receipt_share_access_log(share_link_id);

ALTER TABLE public.receipt_share_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read receipt share access log"
  ON public.receipt_share_access_log FOR SELECT
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales']));

-- RPC: get_shared_receipt
CREATE OR REPLACE FUNCTION public.get_shared_receipt(
  p_token TEXT,
  p_action TEXT DEFAULT 'view'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_link RECORD;
  v_receipt RECORD;
  v_items JSONB;
  v_company RECORD;
  v_invoice_number TEXT;
  v_tax_invoice_number TEXT;
BEGIN
  SELECT * INTO v_link FROM public.receipt_share_links WHERE token = p_token;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'invalid_token');
  END IF;
  IF v_link.revoked_at IS NOT NULL THEN
    RETURN jsonb_build_object('error', 'revoked');
  END IF;
  IF v_link.expires_at < now() THEN
    RETURN jsonb_build_object('error', 'expired');
  END IF;

  SELECT * INTO v_receipt FROM public.receipts WHERE id = v_link.receipt_id AND deleted_at IS NULL;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'receipt_not_found');
  END IF;

  -- Items: receipts often share lines with the parent invoice; fall back gracefully
  SELECT COALESCE(jsonb_agg(to_jsonb(i.*) ORDER BY i.display_order, i.created_at), '[]'::jsonb)
    INTO v_items
  FROM public.invoice_items i
  WHERE i.invoice_id = v_receipt.invoice_id;

  SELECT * INTO v_company FROM public.company_settings WHERE is_active = true LIMIT 1;

  IF v_receipt.invoice_id IS NOT NULL THEN
    SELECT invoice_number INTO v_invoice_number FROM public.invoices WHERE id = v_receipt.invoice_id;
  END IF;
  IF v_receipt.tax_invoice_id IS NOT NULL THEN
    SELECT tax_invoice_number INTO v_tax_invoice_number FROM public.tax_invoices WHERE id = v_receipt.tax_invoice_id;
  END IF;

  -- Update counters and log
  IF p_action = 'download' THEN
    UPDATE public.receipt_share_links
       SET download_count = download_count + 1, last_accessed_at = now()
     WHERE id = v_link.id;
  ELSE
    UPDATE public.receipt_share_links
       SET view_count = view_count + 1, last_accessed_at = now()
     WHERE id = v_link.id;
  END IF;

  INSERT INTO public.receipt_share_access_log (share_link_id, action)
  VALUES (v_link.id, COALESCE(p_action, 'view'));

  -- Reload counters
  SELECT * INTO v_link FROM public.receipt_share_links WHERE id = v_link.id;

  RETURN jsonb_build_object(
    'receipt', to_jsonb(v_receipt),
    'items', v_items,
    'company', to_jsonb(v_company),
    'invoiceNumber', v_invoice_number,
    'taxInvoiceNumber', v_tax_invoice_number,
    'link', jsonb_build_object(
      'expires_at', v_link.expires_at,
      'view_count', v_link.view_count,
      'download_count', v_link.download_count
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_shared_receipt(TEXT, TEXT) TO anon, authenticated;
