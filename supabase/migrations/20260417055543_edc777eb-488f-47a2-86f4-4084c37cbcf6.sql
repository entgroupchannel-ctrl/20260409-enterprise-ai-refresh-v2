
CREATE TABLE IF NOT EXISTS public.quote_share_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  revoked_by uuid,
  view_count integer NOT NULL DEFAULT 0,
  download_count integer NOT NULL DEFAULT 0,
  last_accessed_at timestamptz,
  note text
);

CREATE INDEX IF NOT EXISTS idx_quote_share_links_token ON public.quote_share_links(token);
CREATE INDEX IF NOT EXISTS idx_quote_share_links_quote_id ON public.quote_share_links(quote_id);

ALTER TABLE public.quote_share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view share links" ON public.quote_share_links FOR SELECT TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales','accountant','viewer']));

CREATE POLICY "Staff create share links" ON public.quote_share_links FOR INSERT TO authenticated
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales']));

CREATE POLICY "Staff update share links" ON public.quote_share_links FOR UPDATE TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales']));

CREATE TABLE IF NOT EXISTS public.quote_share_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  share_link_id uuid NOT NULL REFERENCES public.quote_share_links(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('view','download')),
  ip_address text,
  user_agent text,
  accessed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_share_access_log_link ON public.quote_share_access_log(share_link_id);

ALTER TABLE public.quote_share_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view access logs" ON public.quote_share_access_log FOR SELECT TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales','accountant','viewer']));

-- RPC: validate token + return quote data + log access (public, no auth)
CREATE OR REPLACE FUNCTION public.get_shared_quote(p_token text, p_action text DEFAULT 'view')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_link record;
  v_quote jsonb;
  v_revision jsonb;
  v_company jsonb;
  v_sale_person jsonb;
  v_bank_accounts jsonb;
BEGIN
  IF p_action NOT IN ('view','download') THEN
    p_action := 'view';
  END IF;

  SELECT * INTO v_link FROM public.quote_share_links WHERE token = p_token;
  IF v_link IS NULL THEN
    RETURN jsonb_build_object('error','not_found','message','ลิงก์ไม่ถูกต้อง');
  END IF;
  IF v_link.revoked_at IS NOT NULL THEN
    RETURN jsonb_build_object('error','revoked','message','ลิงก์นี้ถูกยกเลิกแล้ว');
  END IF;
  IF v_link.expires_at < now() THEN
    RETURN jsonb_build_object('error','expired','message','ลิงก์หมดอายุแล้ว','expired_at',v_link.expires_at);
  END IF;

  -- Get quote
  SELECT to_jsonb(q.*) INTO v_quote FROM public.quote_requests q WHERE q.id = v_link.quote_id AND q.deleted_at IS NULL;
  IF v_quote IS NULL THEN
    RETURN jsonb_build_object('error','quote_missing','message','ไม่พบใบเสนอราคา');
  END IF;

  -- Get latest revision
  SELECT to_jsonb(r.*) INTO v_revision
  FROM public.quote_revisions r
  WHERE r.quote_id = v_link.quote_id
  ORDER BY r.revision_number DESC
  LIMIT 1;

  -- Company settings (active)
  SELECT to_jsonb(c.*) INTO v_company FROM public.company_settings c WHERE c.is_active = true LIMIT 1;

  -- Sale person
  IF (v_quote->>'assigned_to') IS NOT NULL THEN
    SELECT to_jsonb(u.*) INTO v_sale_person
    FROM (SELECT full_name, position, signature_url, show_signature_on_quotes, phone, email
          FROM public.users WHERE id = (v_quote->>'assigned_to')::uuid) u;
  END IF;

  -- Bank accounts
  IF v_company IS NOT NULL THEN
    SELECT jsonb_agg(to_jsonb(b.*)) INTO v_bank_accounts
    FROM (SELECT bank_name, account_number, account_name, branch, account_type, is_default
          FROM public.company_bank_accounts
          WHERE company_id = (v_company->>'id')::uuid AND is_active = true
          ORDER BY display_order ASC) b;
  END IF;

  -- Update counters
  IF p_action = 'download' THEN
    UPDATE public.quote_share_links
      SET download_count = download_count + 1, last_accessed_at = now()
      WHERE id = v_link.id;
  ELSE
    UPDATE public.quote_share_links
      SET view_count = view_count + 1, last_accessed_at = now()
      WHERE id = v_link.id;
  END IF;

  INSERT INTO public.quote_share_access_log (share_link_id, action) VALUES (v_link.id, p_action);

  RETURN jsonb_build_object(
    'ok', true,
    'quote', v_quote,
    'revision', v_revision,
    'company', v_company,
    'salePerson', v_sale_person,
    'bankAccounts', COALESCE(v_bank_accounts, '[]'::jsonb),
    'shareInfo', jsonb_build_object(
      'expires_at', v_link.expires_at,
      'view_count', v_link.view_count + CASE WHEN p_action='view' THEN 1 ELSE 0 END,
      'download_count', v_link.download_count + CASE WHEN p_action='download' THEN 1 ELSE 0 END
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_shared_quote(text, text) TO anon, authenticated;
