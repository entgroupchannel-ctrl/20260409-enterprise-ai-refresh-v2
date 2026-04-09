-- ═══════════════════════════════════════════════════════════════
-- Race-safe chain_number generation + duplicate quote cleanup
--
-- Problem: generate_chain_number() used MAX(seq)+1 without locking,
-- causing race conditions on concurrent INSERTs. Also only scanned
-- 4 of 8 doc tables. Plus historic Q→QT prefix migration left 5
-- quote pairs sharing the same chain_number.
--
-- Fix:
--   1. Add pg_advisory_xact_lock to generate_chain_number()
--   2. Scan ALL 8 doc tables (was only 4)
--   3. Cleanup 5 duplicate chain_number pairs in quote_requests
--   4. Re-sync downstream sales_orders.chain_number
--
-- Idempotent. Atomic. Safe to re-run.
-- ═══════════════════════════════════════════════════════════════


-- ═══ STEP 1: Race-safe generate_chain_number ═══
CREATE OR REPLACE FUNCTION public.generate_chain_number()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  current_year TEXT;
  seq_num INTEGER;
  result TEXT;
BEGIN
  current_year := to_char(now(), 'YYYY');

  PERFORM pg_advisory_xact_lock(hashtext('chain_number_' || current_year));

  SELECT COALESCE(MAX(seq), 0) + 1 INTO seq_num
  FROM (
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM quote_requests WHERE chain_number LIKE current_year || '-%'
    UNION ALL
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM sales_orders WHERE chain_number LIKE current_year || '-%'
    UNION ALL
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM billing_notes WHERE chain_number LIKE current_year || '-%'
    UNION ALL
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM invoices WHERE chain_number LIKE current_year || '-%'
    UNION ALL
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM delivery_notes WHERE chain_number LIKE current_year || '-%'
    UNION ALL
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM payment_records WHERE chain_number LIKE current_year || '-%'
    UNION ALL
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM receipts WHERE chain_number LIKE current_year || '-%'
    UNION ALL
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM tax_invoices WHERE chain_number LIKE current_year || '-%'
  ) all_chains;

  result := current_year || '-' || lpad(seq_num::text, 4, '0');
  RETURN result;
END;
$$;


-- ═══ STEP 2: Cleanup duplicate quote chains ═══
DO $$
DECLARE
  _dup RECORD;
  _new_chain TEXT;
  _new_quote_number TEXT;
  _so_count INTEGER;
BEGIN
  FOR _dup IN
    SELECT
      q.id,
      q.quote_number,
      q.chain_number,
      q.created_at
    FROM quote_requests q
    INNER JOIN (
      SELECT chain_number
      FROM quote_requests
      WHERE chain_number IS NOT NULL
      GROUP BY chain_number
      HAVING COUNT(*) > 1
    ) dups ON dups.chain_number = q.chain_number
    WHERE q.created_at > (
      SELECT MIN(q2.created_at)
      FROM quote_requests q2
      WHERE q2.chain_number = q.chain_number
    )
    ORDER BY q.created_at
  LOOP
    SELECT COUNT(*) INTO _so_count
    FROM sales_orders
    WHERE quote_id = _dup.id;

    _new_chain := generate_chain_number();

    IF _dup.quote_number LIKE 'QT-%' THEN
      _new_quote_number := 'QT-' || _new_chain;
    ELSIF _dup.quote_number LIKE 'Q-%' THEN
      _new_quote_number := 'Q-' || _new_chain;
    ELSE
      _new_quote_number := _dup.quote_number;
    END IF;

    UPDATE quote_requests
    SET chain_number = _new_chain, quote_number = _new_quote_number
    WHERE id = _dup.id;

    UPDATE sales_orders
    SET chain_number = _new_chain, order_number = 'SO-' || _new_chain
    WHERE quote_id = _dup.id;

    UPDATE billing_notes
    SET chain_number = _new_chain, billing_number = 'BL-' || _new_chain
    WHERE quote_id = _dup.id;

    UPDATE invoices
    SET chain_number = _new_chain, invoice_number = 'INV-' || _new_chain
    WHERE quote_id = _dup.id;

    UPDATE delivery_notes
    SET chain_number = _new_chain, delivery_number = 'DN-' || _new_chain
    WHERE quote_id = _dup.id;

    RAISE NOTICE 'Renamed duplicate quote: % (id=%) → % (was chain %, now %, % downstream SO)',
      _dup.quote_number, _dup.id, _new_quote_number, _dup.chain_number, _new_chain, _so_count;
  END LOOP;
END $$;


-- ═══ STEP 3: Re-sync orphaned chain_number ═══
UPDATE sales_orders so
SET chain_number = q.chain_number
FROM quote_requests q
WHERE so.quote_id = q.id
  AND q.chain_number IS NOT NULL
  AND (so.chain_number IS NULL OR so.chain_number = '' OR so.chain_number != q.chain_number);

UPDATE billing_notes bn
SET chain_number = q.chain_number
FROM quote_requests q
WHERE bn.quote_id = q.id
  AND q.chain_number IS NOT NULL
  AND (bn.chain_number IS NULL OR bn.chain_number = '');


-- ═══ STEP 4: Verification ═══
DO $$
DECLARE
  _quote_dups INTEGER;
  _so_dups INTEGER;
  _next_chain TEXT;
BEGIN
  SELECT COUNT(*) INTO _quote_dups
  FROM (
    SELECT chain_number FROM quote_requests
    WHERE chain_number IS NOT NULL
    GROUP BY chain_number HAVING COUNT(*) > 1
  ) x;

  SELECT COUNT(*) INTO _so_dups
  FROM (
    SELECT order_number FROM sales_orders
    GROUP BY order_number HAVING COUNT(*) > 1
  ) x;

  _next_chain := generate_chain_number();

  RAISE NOTICE '═══ VERIFICATION ═══';
  RAISE NOTICE 'Duplicate quote chains remaining: %', _quote_dups;
  RAISE NOTICE 'Duplicate sales order numbers remaining: %', _so_dups;
  RAISE NOTICE 'Next chain_number will be: %', _next_chain;

  IF _quote_dups > 0 OR _so_dups > 0 THEN
    RAISE EXCEPTION 'Migration verification failed: % quote dups, % SO dups remaining',
      _quote_dups, _so_dups;
  END IF;
END $$;