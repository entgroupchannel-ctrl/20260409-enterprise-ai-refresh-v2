
-- ============================================================
-- 1) FUNCTION: create initial revision (#1) for a quote
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_initial_quote_revision(p_quote_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quote public.quote_requests%ROWTYPE;
  v_rev_id uuid;
  v_existing uuid;
  v_creator_name text;
  v_creator_role text;
BEGIN
  SELECT * INTO v_quote FROM public.quote_requests WHERE id = p_quote_id;
  IF NOT FOUND THEN RETURN NULL; END IF;

  -- Skip if already has any revision
  SELECT id INTO v_existing FROM public.quote_revisions WHERE quote_id = p_quote_id LIMIT 1;
  IF v_existing IS NOT NULL THEN RETURN v_existing; END IF;

  -- Resolve creator info (best effort)
  IF v_quote.created_by IS NOT NULL THEN
    SELECT COALESCE(full_name, email, 'System'), COALESCE(role::text, 'system')
      INTO v_creator_name, v_creator_role
    FROM public.users WHERE id = v_quote.created_by LIMIT 1;
  END IF;
  v_creator_name := COALESCE(v_creator_name, v_quote.customer_name, 'System');
  v_creator_role := COALESCE(v_creator_role, 'customer');

  INSERT INTO public.quote_revisions (
    quote_id, revision_number, revision_type,
    created_by, created_by_name, created_by_role,
    products, free_items,
    subtotal, discount_type, discount_percent, discount_amount,
    vat_percent, vat_amount, grand_total,
    change_reason, status, sent_at, valid_until
  ) VALUES (
    p_quote_id, 1, 'initial',
    v_quote.created_by, v_creator_name, v_creator_role,
    COALESCE(v_quote.products, '[]'::jsonb),
    COALESCE((to_jsonb(v_quote)->'free_items'), '[]'::jsonb),
    COALESCE(v_quote.subtotal, 0),
    COALESCE((to_jsonb(v_quote)->>'discount_type'), 'percent'),
    COALESCE(v_quote.discount_percent, 0),
    COALESCE(v_quote.discount_amount, 0),
    COALESCE(v_quote.vat_percent, 7),
    COALESCE(v_quote.vat_amount, 0),
    COALESCE(v_quote.grand_total, 0),
    'ใบเสนอราคาเริ่มต้น',
    'sent',
    COALESCE(v_quote.sent_at, v_quote.created_at, now()),
    v_quote.valid_until
  )
  RETURNING id INTO v_rev_id;

  UPDATE public.quote_requests
     SET current_revision_id = v_rev_id,
         current_revision_number = 1,
         total_revisions = 1
   WHERE id = p_quote_id;

  RETURN v_rev_id;
END;
$$;

-- ============================================================
-- 2) TRIGGER: auto create Revision #1 on new quote_requests
-- ============================================================
CREATE OR REPLACE FUNCTION public.trg_quote_create_initial_revision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.create_initial_quote_revision(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS quote_requests_create_initial_revision ON public.quote_requests;
CREATE TRIGGER quote_requests_create_initial_revision
AFTER INSERT ON public.quote_requests
FOR EACH ROW
EXECUTE FUNCTION public.trg_quote_create_initial_revision();

-- ============================================================
-- 3) TRIGGER: auto create Counter Offer DRAFT on negotiation request
-- ============================================================
CREATE OR REPLACE FUNCTION public.trg_negotiation_auto_draft_counter()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quote public.quote_requests%ROWTYPE;
  v_base public.quote_revisions%ROWTYPE;
  v_next_num integer;
  v_rev_id uuid;
BEGIN
  -- Only on customer-side requests
  IF NEW.requested_by_role <> 'customer' THEN RETURN NEW; END IF;

  SELECT * INTO v_quote FROM public.quote_requests WHERE id = NEW.quote_id;
  IF NOT FOUND THEN RETURN NEW; END IF;

  -- Ensure there is an initial revision to copy from
  IF v_quote.current_revision_id IS NULL THEN
    PERFORM public.create_initial_quote_revision(NEW.quote_id);
    SELECT * INTO v_quote FROM public.quote_requests WHERE id = NEW.quote_id;
  END IF;

  -- Load base revision
  SELECT * INTO v_base FROM public.quote_revisions
   WHERE id = v_quote.current_revision_id;

  IF NOT FOUND THEN RETURN NEW; END IF;

  -- Next revision number
  v_next_num := COALESCE(public.get_next_revision_number(NEW.quote_id), v_base.revision_number + 1);

  INSERT INTO public.quote_revisions (
    quote_id, revision_number, revision_type,
    created_by, created_by_name, created_by_role,
    products, free_items,
    subtotal, discount_type, discount_percent, discount_amount,
    vat_percent, vat_amount, grand_total,
    change_reason, status, valid_until, internal_notes
  ) VALUES (
    NEW.quote_id, v_next_num, 'admin_offer',
    NULL, 'System (Auto-draft)', 'system',
    v_base.products, COALESCE(v_base.free_items, '[]'::jsonb),
    v_base.subtotal, COALESCE(v_base.discount_type, 'percent'),
    v_base.discount_percent, v_base.discount_amount,
    v_base.vat_percent, v_base.vat_amount, v_base.grand_total,
    'Draft อัตโนมัติจากคำขอต่อรองของลูกค้า — แอดมินปรับราคา/ของแถมแล้วกดส่ง',
    'draft', v_base.valid_until,
    'สร้างอัตโนมัติเมื่อลูกค้าส่ง negotiation request #' || NEW.id::text
  )
  RETURNING id INTO v_rev_id;

  UPDATE public.quote_requests
     SET total_revisions = v_next_num
   WHERE id = NEW.quote_id;

  -- Link the negotiation request to the draft (helps UI find it)
  NEW.resulted_in_revision_id := v_rev_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS negotiation_requests_auto_draft ON public.quote_negotiation_requests;
CREATE TRIGGER negotiation_requests_auto_draft
BEFORE INSERT ON public.quote_negotiation_requests
FOR EACH ROW
EXECUTE FUNCTION public.trg_negotiation_auto_draft_counter();

-- ============================================================
-- 4) BACKFILL: existing quotes without any revision
-- ============================================================
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT q.id FROM public.quote_requests q
    LEFT JOIN public.quote_revisions rv ON rv.quote_id = q.id
    WHERE rv.id IS NULL
  LOOP
    PERFORM public.create_initial_quote_revision(r.id);
  END LOOP;
END $$;
