CREATE TABLE public.tax_invoice_share_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_invoice_id uuid NOT NULL REFERENCES public.tax_invoices(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  revoked_by uuid,
  view_count integer NOT NULL DEFAULT 0,
  download_count integer NOT NULL DEFAULT 0,
  last_accessed_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tax_invoice_share_links_tx ON public.tax_invoice_share_links(tax_invoice_id);
CREATE INDEX idx_tax_invoice_share_links_token ON public.tax_invoice_share_links(token);

ALTER TABLE public.tax_invoice_share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage tax invoice share links"
  ON public.tax_invoice_share_links FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'));

CREATE TABLE public.tax_invoice_share_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  share_link_id uuid NOT NULL REFERENCES public.tax_invoice_share_links(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('view','download')),
  ip_address text,
  user_agent text,
  accessed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tax_invoice_share_access_log_link ON public.tax_invoice_share_access_log(share_link_id);
CREATE INDEX idx_tax_invoice_share_access_log_time ON public.tax_invoice_share_access_log(accessed_at DESC);

ALTER TABLE public.tax_invoice_share_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read tax invoice share access log"
  ON public.tax_invoice_share_access_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'));

CREATE OR REPLACE FUNCTION public.get_shared_tax_invoice(p_token text, p_action text DEFAULT 'view')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_link public.tax_invoice_share_links%ROWTYPE;
  v_tx public.tax_invoices%ROWTYPE;
  v_items jsonb;
  v_company jsonb;
  v_banks jsonb;
  v_invoice_number text;
BEGIN
  IF p_action NOT IN ('view','download') THEN
    p_action := 'view';
  END IF;

  SELECT * INTO v_link FROM public.tax_invoice_share_links WHERE token = p_token;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error','invalid_token');
  END IF;
  IF v_link.revoked_at IS NOT NULL THEN
    RETURN jsonb_build_object('error','revoked');
  END IF;
  IF v_link.expires_at < now() THEN
    RETURN jsonb_build_object('error','expired');
  END IF;

  SELECT * INTO v_tx FROM public.tax_invoices WHERE id = v_link.tax_invoice_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error','tax_invoice_not_found');
  END IF;

  SELECT COALESCE(jsonb_agg(to_jsonb(i.*) ORDER BY i.display_order NULLS LAST, i.created_at), '[]'::jsonb)
    INTO v_items
    FROM public.tax_invoice_items i WHERE i.tax_invoice_id = v_tx.id;

  SELECT to_jsonb(c.*) INTO v_company
    FROM public.company_settings c WHERE c.is_active = true LIMIT 1;

  SELECT COALESCE(jsonb_agg(to_jsonb(b.*) ORDER BY b.is_default DESC, b.display_order NULLS LAST), '[]'::jsonb)
    INTO v_banks
    FROM public.company_bank_accounts b
   WHERE b.is_active = true;

  SELECT invoice_number INTO v_invoice_number FROM public.invoices WHERE id = v_tx.invoice_id;

  IF p_action = 'download' THEN
    UPDATE public.tax_invoice_share_links
       SET download_count = download_count + 1, last_accessed_at = now()
     WHERE id = v_link.id;
  ELSE
    UPDATE public.tax_invoice_share_links
       SET view_count = view_count + 1, last_accessed_at = now()
     WHERE id = v_link.id;
  END IF;

  INSERT INTO public.tax_invoice_share_access_log(share_link_id, action)
  VALUES (v_link.id, p_action);

  RETURN jsonb_build_object(
    'taxInvoice', to_jsonb(v_tx),
    'items', v_items,
    'company', v_company,
    'banks', v_banks,
    'invoiceNumber', v_invoice_number,
    'link', jsonb_build_object(
      'expires_at', v_link.expires_at,
      'view_count', v_link.view_count + CASE WHEN p_action='view' THEN 1 ELSE 0 END,
      'download_count', v_link.download_count + CASE WHEN p_action='download' THEN 1 ELSE 0 END
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_shared_tax_invoice(text, text) TO anon, authenticated;