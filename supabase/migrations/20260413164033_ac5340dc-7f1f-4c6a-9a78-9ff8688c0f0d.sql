
-- =====================================================
-- UNIFIED DOCUMENT NUMBERING
-- All documents in the same chain share base number
-- QT-2026-0001 → SO-2026-0001 → INV-2026-0001 → TXI-2026-0001 → RCP-2026-0001
-- =====================================================

-- ==================================================
-- HELPER: Extract base number from any document number
-- ==================================================
CREATE OR REPLACE FUNCTION public.extract_doc_base_number(doc_number TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = 'public'
AS $$
DECLARE
  base_part TEXT;
BEGIN
  IF doc_number IS NULL THEN
    RETURN NULL;
  END IF;
  
  base_part := substring(doc_number FROM '^[A-Z]+-(\d{4}-\d{4,})$');
  
  IF base_part IS NOT NULL THEN
    RETURN base_part;
  END IF;
  
  RETURN NULL;
END;
$$;

COMMENT ON FUNCTION public.extract_doc_base_number IS 
'Extract base number (YYYY-NNNN) from doc number. Returns NULL for legacy formats.';

-- ==================================================
-- HELPER: Generate next base number for current year
-- ==================================================
CREATE OR REPLACE FUNCTION public.generate_next_base_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  current_year TEXT;
  max_seq INT := 0;
  q_seq INT;
BEGIN
  current_year := to_char(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(substring(quote_number FROM '^[A-Z]+-' || current_year || '-(\d+)$') AS INT)
  ), 0)
  INTO q_seq
  FROM public.quote_requests
  WHERE quote_number ~ ('^[A-Z]+-' || current_year || '-\d+$');
  
  max_seq := q_seq + 1;
  
  RETURN current_year || '-' || lpad(max_seq::text, 4, '0');
END;
$$;

COMMENT ON FUNCTION public.generate_next_base_number IS 
'Generate next base number (YYYY-NNNN) based on max quote number this year.';

-- ==================================================
-- 1. Quote Number Trigger — QT- prefix
-- ==================================================
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  base_num TEXT;
BEGIN
  IF NEW.quote_number IS NOT NULL AND NEW.quote_number != '' THEN
    RETURN NEW;
  END IF;
  
  base_num := public.generate_next_base_number();
  NEW.quote_number := 'QT-' || base_num;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.generate_quote_number IS 
'Trigger: Generate QT-YYYY-NNNN from sequence. Source of truth for unified numbering.';

-- ==================================================
-- 2. Sale Order Number Trigger — Uses quote base
-- ==================================================
CREATE OR REPLACE FUNCTION public.generate_so_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  quote_num TEXT;
  base_num TEXT;
  current_year TEXT;
  fallback_seq INT;
BEGIN
  IF NEW.so_number IS NOT NULL AND NEW.so_number != '' THEN
    RETURN NEW;
  END IF;
  
  SELECT quote_number INTO quote_num
  FROM public.quote_requests
  WHERE id = NEW.quote_id;
  
  base_num := public.extract_doc_base_number(quote_num);
  
  IF base_num IS NOT NULL THEN
    NEW.so_number := 'SO-' || base_num;
  ELSE
    current_year := to_char(NOW(), 'YYYY');
    SELECT COUNT(*) + 1 INTO fallback_seq
    FROM public.sale_orders
    WHERE to_char(created_at, 'YYYY') = current_year;
    NEW.so_number := 'SO-' || current_year || '-' || lpad(fallback_seq::text, 4, '0');
  END IF;
  
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.generate_so_number IS 
'Trigger: Generate SO-YYYY-NNNN using quote base (fallback to count-based if legacy).';

-- ==================================================
-- 3. Invoice Number — Uses quote base + suffix
-- ==================================================
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  year_suffix TEXT;
  next_num INT;
BEGIN
  year_suffix := TO_CHAR(NOW(), 'YYYY');
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM 'INV-' || year_suffix || '-(\d+)') AS INT)
  ), 0) + 1
  INTO next_num
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || year_suffix || '-%';
  RETURN 'INV-' || year_suffix || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  quote_num TEXT;
  base_num TEXT;
  existing_count INT;
  new_number TEXT;
BEGIN
  IF NEW.invoice_number IS NOT NULL AND NEW.invoice_number != '' THEN
    RETURN NEW;
  END IF;
  
  IF NEW.quote_id IS NOT NULL THEN
    SELECT quote_number INTO quote_num
    FROM public.quote_requests
    WHERE id = NEW.quote_id;
    
    base_num := public.extract_doc_base_number(quote_num);
  END IF;
  
  IF base_num IS NOT NULL THEN
    SELECT COUNT(*) INTO existing_count
    FROM public.invoices
    WHERE quote_id = NEW.quote_id;
    
    IF existing_count = 0 THEN
      new_number := 'INV-' || base_num;
    ELSE
      new_number := 'INV-' || base_num || '-' || (existing_count + 1)::text;
    END IF;
  ELSE
    new_number := public.generate_invoice_number();
  END IF;
  
  NEW.invoice_number := new_number;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_invoice_number IS 
'Trigger: Generate INV-YYYY-NNNN using quote base. Adds -N suffix for multiple invoices.';

-- ==================================================
-- 4. Tax Invoice Number — Uses invoice base
-- ==================================================
CREATE OR REPLACE FUNCTION public.set_tax_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  inv_num TEXT;
  base_num TEXT;
  existing_count INT;
  new_number TEXT;
  fallback_year TEXT;
  fallback_seq INT;
BEGIN
  IF NEW.tax_invoice_number IS NOT NULL AND NEW.tax_invoice_number != '' THEN
    RETURN NEW;
  END IF;
  
  IF NEW.invoice_id IS NOT NULL THEN
    SELECT invoice_number INTO inv_num
    FROM public.invoices
    WHERE id = NEW.invoice_id;
    
    base_num := substring(inv_num FROM '^INV-(\d{4}-\d{4,}(?:-\d+)?)$');
  END IF;
  
  IF base_num IS NOT NULL THEN
    SELECT COUNT(*) INTO existing_count
    FROM public.tax_invoices
    WHERE invoice_id = NEW.invoice_id;
    
    IF existing_count = 0 THEN
      new_number := 'TXI-' || base_num;
    ELSE
      new_number := 'TXI-' || base_num || '-' || (existing_count + 1)::text;
    END IF;
  ELSE
    fallback_year := to_char(NOW(), 'YYYY');
    SELECT COALESCE(MAX(
      CAST(SUBSTRING(tax_invoice_number FROM 'TXI-' || fallback_year || '-(\d+)') AS INT)
    ), 0) + 1
    INTO fallback_seq
    FROM public.tax_invoices
    WHERE tax_invoice_number LIKE 'TXI-' || fallback_year || '-%';
    new_number := 'TXI-' || fallback_year || '-' || lpad(fallback_seq::text, 4, '0');
  END IF;
  
  NEW.tax_invoice_number := new_number;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_tax_invoice_number IS 
'Trigger: Generate TXI-YYYY-NNNN using invoice base.';

-- ==================================================
-- 5. Receipt Number — Uses tax_invoice or invoice base
-- ==================================================
CREATE OR REPLACE FUNCTION public.set_receipt_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  ref_num TEXT;
  base_num TEXT;
  new_number TEXT;
  fallback_year TEXT;
  fallback_seq INT;
BEGIN
  IF NEW.receipt_number IS NOT NULL AND NEW.receipt_number != '' THEN
    RETURN NEW;
  END IF;
  
  IF NEW.tax_invoice_id IS NOT NULL THEN
    SELECT tax_invoice_number INTO ref_num
    FROM public.tax_invoices
    WHERE id = NEW.tax_invoice_id;
    base_num := substring(ref_num FROM '^TXI-(\d{4}-\d{4,}(?:-\d+)?)$');
  ELSIF NEW.invoice_id IS NOT NULL THEN
    SELECT invoice_number INTO ref_num
    FROM public.invoices
    WHERE id = NEW.invoice_id;
    base_num := substring(ref_num FROM '^INV-(\d{4}-\d{4,}(?:-\d+)?)$');
  END IF;
  
  IF base_num IS NOT NULL THEN
    new_number := 'RCP-' || base_num;
  ELSE
    fallback_year := to_char(NOW(), 'YYYY');
    SELECT COALESCE(MAX(
      CAST(SUBSTRING(receipt_number FROM 'RCP-' || fallback_year || '-(\d+)') AS INT)
    ), 0) + 1
    INTO fallback_seq
    FROM public.receipts
    WHERE receipt_number LIKE 'RCP-' || fallback_year || '-%';
    new_number := 'RCP-' || fallback_year || '-' || lpad(fallback_seq::text, 4, '0');
  END IF;
  
  NEW.receipt_number := new_number;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_receipt_number IS 
'Trigger: Generate RCP-YYYY-NNNN using tax_invoice or invoice base.';
