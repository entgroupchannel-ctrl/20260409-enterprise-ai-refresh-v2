
BEGIN;

-- =====================================================
-- Phase 1: Helper Functions
-- =====================================================

-- Extract base number from any format
CREATE OR REPLACE FUNCTION public.extract_doc_base_number(doc_number TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = 'public'
AS $$
DECLARE
  base_part TEXT;
BEGIN
  IF doc_number IS NULL THEN RETURN NULL; END IF;
  
  -- New format: PREFIX + 12 digits (e.g., QT202604140001)
  base_part := substring(doc_number FROM '^[A-Z]{2,3}(\d{12})$');
  IF base_part IS NOT NULL THEN RETURN base_part; END IF;
  
  -- New format with suffix: PREFIX + 12 digits + -N
  base_part := substring(doc_number FROM '^[A-Z]{2,3}(\d{12})-\d+$');
  IF base_part IS NOT NULL THEN RETURN base_part; END IF;
  
  -- v1 format (backward compat): QT-2026-0001
  base_part := substring(doc_number FROM '^[A-Z]+-(\d{4}-\d{4,})$');
  IF base_part IS NOT NULL THEN RETURN base_part; END IF;
  
  RETURN NULL;
END;
$$;

-- Generate next base (daily reset)
CREATE OR REPLACE FUNCTION public.generate_next_base_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  today_str TEXT;
  max_seq INT := 0;
BEGIN
  today_str := to_char(NOW(), 'YYYYMMDD');
  
  SELECT COALESCE(MAX(
    CAST(substring(quote_number FROM '^[A-Z]{2,3}' || today_str || '(\d{4})$') AS INT)
  ), 0)
  INTO max_seq
  FROM public.quote_requests
  WHERE quote_number ~ ('^[A-Z]{2,3}' || today_str || '\d{4}$');
  
  RETURN today_str || lpad((max_seq + 1)::text, 4, '0');
END;
$$;

-- =====================================================
-- Phase 2: Rewrite 5 Generator Triggers
-- =====================================================

-- 1. Quote
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = 'public' AS $$
DECLARE
  base_num TEXT;
BEGIN
  IF NEW.quote_number IS NOT NULL AND NEW.quote_number != '' THEN RETURN NEW; END IF;
  base_num := public.generate_next_base_number();
  NEW.quote_number := 'QT' || base_num;
  RETURN NEW;
END; $$;

-- 2. Sale Order
CREATE OR REPLACE FUNCTION public.generate_so_number()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = 'public' AS $$
DECLARE
  quote_num TEXT;
  base_num TEXT;
  today_str TEXT;
  fallback_seq INT;
BEGIN
  IF NEW.so_number IS NOT NULL AND NEW.so_number != '' THEN RETURN NEW; END IF;
  
  SELECT quote_number INTO quote_num FROM public.quote_requests WHERE id = NEW.quote_id;
  base_num := public.extract_doc_base_number(quote_num);
  
  IF base_num IS NOT NULL THEN
    NEW.so_number := 'SO' || base_num;
  ELSE
    today_str := to_char(NOW(), 'YYYYMMDD');
    SELECT COALESCE(MAX(
      CAST(substring(so_number FROM '^SO' || today_str || '(\d{4})$') AS INT)
    ), 0) + 1 INTO fallback_seq
    FROM public.sale_orders WHERE so_number ~ ('^SO' || today_str || '\d{4}$');
    NEW.so_number := 'SO' || today_str || lpad(fallback_seq::text, 4, '0');
  END IF;
  RETURN NEW;
END; $$;

-- 3. Invoice
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = 'public' AS $$
DECLARE
  quote_num TEXT;
  base_num TEXT;
  existing_count INT;
  new_number TEXT;
  today_str TEXT;
  fallback_seq INT;
BEGIN
  IF NEW.invoice_number IS NOT NULL AND NEW.invoice_number != '' THEN RETURN NEW; END IF;
  
  IF NEW.quote_id IS NOT NULL THEN
    SELECT quote_number INTO quote_num FROM public.quote_requests WHERE id = NEW.quote_id;
    base_num := public.extract_doc_base_number(quote_num);
  END IF;
  
  IF base_num IS NOT NULL THEN
    SELECT COUNT(*) INTO existing_count
    FROM public.invoices
    WHERE quote_id = NEW.quote_id AND deleted_at IS NULL;
    
    IF existing_count = 0 THEN
      new_number := 'INV' || base_num;
    ELSE
      new_number := 'INV' || base_num || '-' || (existing_count + 1)::text;
    END IF;
  ELSE
    today_str := to_char(NOW(), 'YYYYMMDD');
    SELECT COALESCE(MAX(
      CAST(substring(invoice_number FROM '^INV' || today_str || '(\d{4})$') AS INT)
    ), 0) + 1 INTO fallback_seq
    FROM public.invoices WHERE invoice_number ~ ('^INV' || today_str || '\d{4}$');
    new_number := 'INV' || today_str || lpad(fallback_seq::text, 4, '0');
  END IF;
  
  NEW.invoice_number := new_number;
  RETURN NEW;
END; $$;

-- 4. Tax Invoice
CREATE OR REPLACE FUNCTION public.set_tax_invoice_number()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = 'public' AS $$
DECLARE
  inv_num TEXT;
  base_num TEXT;
  existing_count INT;
  new_number TEXT;
  today_str TEXT;
  fallback_seq INT;
BEGIN
  IF NEW.tax_invoice_number IS NOT NULL AND NEW.tax_invoice_number != '' THEN RETURN NEW; END IF;
  
  IF NEW.invoice_id IS NOT NULL THEN
    SELECT invoice_number INTO inv_num FROM public.invoices WHERE id = NEW.invoice_id;
    base_num := public.extract_doc_base_number(inv_num);
  END IF;
  
  IF base_num IS NOT NULL THEN
    SELECT COUNT(*) INTO existing_count
    FROM public.tax_invoices WHERE invoice_id = NEW.invoice_id;
    
    IF existing_count = 0 THEN
      new_number := 'TXI' || base_num;
    ELSE
      new_number := 'TXI' || base_num || '-' || (existing_count + 1)::text;
    END IF;
  ELSE
    today_str := to_char(NOW(), 'YYYYMMDD');
    SELECT COALESCE(MAX(
      CAST(substring(tax_invoice_number FROM '^TXI' || today_str || '(\d{4})$') AS INT)
    ), 0) + 1 INTO fallback_seq
    FROM public.tax_invoices WHERE tax_invoice_number ~ ('^TXI' || today_str || '\d{4}$');
    new_number := 'TXI' || today_str || lpad(fallback_seq::text, 4, '0');
  END IF;
  
  NEW.tax_invoice_number := new_number;
  RETURN NEW;
END; $$;

-- 5. Receipt
CREATE OR REPLACE FUNCTION public.set_receipt_number()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = 'public' AS $$
DECLARE
  ref_num TEXT;
  base_num TEXT;
  new_number TEXT;
  today_str TEXT;
  fallback_seq INT;
BEGIN
  IF NEW.receipt_number IS NOT NULL AND NEW.receipt_number != '' THEN RETURN NEW; END IF;
  
  IF NEW.tax_invoice_id IS NOT NULL THEN
    SELECT tax_invoice_number INTO ref_num FROM public.tax_invoices WHERE id = NEW.tax_invoice_id;
    base_num := public.extract_doc_base_number(ref_num);
  ELSIF NEW.invoice_id IS NOT NULL THEN
    SELECT invoice_number INTO ref_num FROM public.invoices WHERE id = NEW.invoice_id;
    base_num := public.extract_doc_base_number(ref_num);
  END IF;
  
  IF base_num IS NOT NULL THEN
    new_number := 'RCP' || base_num;
  ELSE
    today_str := to_char(NOW(), 'YYYYMMDD');
    SELECT COALESCE(MAX(
      CAST(substring(receipt_number FROM '^RCP' || today_str || '(\d{4})$') AS INT)
    ), 0) + 1 INTO fallback_seq
    FROM public.receipts WHERE receipt_number ~ ('^RCP' || today_str || '\d{4}$');
    new_number := 'RCP' || today_str || lpad(fallback_seq::text, 4, '0');
  END IF;
  
  NEW.receipt_number := new_number;
  RETURN NEW;
END; $$;

-- Also update generate_invoice_number (standalone, non-trigger)
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  today_str TEXT;
  next_num INT;
BEGIN
  today_str := to_char(NOW(), 'YYYYMMDD');
  SELECT COALESCE(MAX(
    CAST(substring(invoice_number FROM '^INV' || today_str || '(\d{4})$') AS INT)
  ), 0) + 1
  INTO next_num
  FROM public.invoices
  WHERE invoice_number ~ ('^INV' || today_str || '\d{4}$');
  RETURN 'INV' || today_str || lpad(next_num::text, 4, '0');
END;
$$;

-- Also update generate_tax_invoice_number (standalone)
CREATE OR REPLACE FUNCTION public.generate_tax_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  today_str TEXT;
  next_num INT;
BEGIN
  today_str := to_char(NOW(), 'YYYYMMDD');
  SELECT COALESCE(MAX(
    CAST(substring(tax_invoice_number FROM '^TXI' || today_str || '(\d{4})$') AS INT)
  ), 0) + 1
  INTO next_num
  FROM public.tax_invoices
  WHERE tax_invoice_number ~ ('^TXI' || today_str || '\d{4}$');
  RETURN 'TXI' || today_str || lpad(next_num::text, 4, '0');
END;
$$;

-- Also update generate_receipt_number (standalone)
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  today_str TEXT;
  next_num INT;
BEGIN
  today_str := to_char(NOW(), 'YYYYMMDD');
  SELECT COALESCE(MAX(
    CAST(substring(receipt_number FROM '^RCP' || today_str || '(\d{4})$') AS INT)
  ), 0) + 1
  INTO next_num
  FROM public.receipts
  WHERE receipt_number ~ ('^RCP' || today_str || '\d{4}$');
  RETURN 'RCP' || today_str || lpad(next_num::text, 4, '0');
END;
$$;

-- =====================================================
-- Phase 3: Data Migration
-- =====================================================

DO $$
DECLARE
  q RECORD;
  inv RECORD;
  tax RECORD;
  rcp RECORD;
  daily_seq INT := 0;
  current_day TEXT := '';
  quote_day TEXT;
  new_base TEXT;
  invoice_idx INT;
  tax_idx INT;
  rcp_idx INT;
BEGIN
  FOR q IN 
    SELECT id, quote_number, created_at
    FROM public.quote_requests
    WHERE deleted_at IS NULL
    ORDER BY created_at ASC
  LOOP
    quote_day := to_char(q.created_at, 'YYYYMMDD');
    
    -- Reset sequence when day changes
    IF quote_day != current_day THEN
      current_day := quote_day;
      daily_seq := 0;
    END IF;
    
    daily_seq := daily_seq + 1;
    new_base := quote_day || lpad(daily_seq::text, 4, '0');
    
    -- Update quote
    UPDATE public.quote_requests
    SET quote_number = 'QT' || new_base
    WHERE id = q.id;
    
    -- Update linked sale_orders
    UPDATE public.sale_orders
    SET so_number = 'SO' || new_base
    WHERE quote_id = q.id;
    
    -- Update linked invoices (with multi-suffix)
    invoice_idx := 0;
    FOR inv IN
      SELECT id FROM public.invoices
      WHERE quote_id = q.id AND deleted_at IS NULL
      ORDER BY created_at ASC
    LOOP
      invoice_idx := invoice_idx + 1;
      
      IF invoice_idx = 1 THEN
        UPDATE public.invoices
        SET invoice_number = 'INV' || new_base
        WHERE id = inv.id;
      ELSE
        UPDATE public.invoices
        SET invoice_number = 'INV' || new_base || '-' || invoice_idx::text
        WHERE id = inv.id;
      END IF;
      
      -- Update tax_invoices linked to this invoice
      tax_idx := 0;
      FOR tax IN
        SELECT id FROM public.tax_invoices
        WHERE invoice_id = inv.id
        ORDER BY created_at ASC
      LOOP
        tax_idx := tax_idx + 1;
        IF tax_idx = 1 AND invoice_idx = 1 THEN
          UPDATE public.tax_invoices
          SET tax_invoice_number = 'TXI' || new_base
          WHERE id = tax.id;
        ELSIF tax_idx = 1 THEN
          UPDATE public.tax_invoices
          SET tax_invoice_number = 'TXI' || new_base || '-' || invoice_idx::text
          WHERE id = tax.id;
        ELSE
          UPDATE public.tax_invoices
          SET tax_invoice_number = 'TXI' || new_base || '-' || invoice_idx::text || '-' || tax_idx::text
          WHERE id = tax.id;
        END IF;
      END LOOP;
      
      -- Update receipts linked to this invoice
      rcp_idx := 0;
      FOR rcp IN
        SELECT id FROM public.receipts
        WHERE invoice_id = inv.id
        ORDER BY created_at ASC
      LOOP
        rcp_idx := rcp_idx + 1;
        IF rcp_idx = 1 AND invoice_idx = 1 THEN
          UPDATE public.receipts
          SET receipt_number = 'RCP' || new_base
          WHERE id = rcp.id;
        ELSE
          UPDATE public.receipts
          SET receipt_number = 'RCP' || new_base || '-' || invoice_idx::text
          WHERE id = rcp.id;
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE '---';
  RAISE NOTICE 'Unified document numbering v2 complete';
  RAISE NOTICE 'All active documents converted to PREFIX+YYYYMMDD+NNNN format';
  RAISE NOTICE '---';
END $$;

COMMIT;
