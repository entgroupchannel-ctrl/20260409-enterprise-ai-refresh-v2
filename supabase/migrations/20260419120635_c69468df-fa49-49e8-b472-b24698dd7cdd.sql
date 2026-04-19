-- 1. Drop legacy global unique constraint on receipt_number
ALTER TABLE public.receipts DROP CONSTRAINT IF EXISTS receipts_receipt_number_key;

-- 2. Replace with partial unique index that ignores soft-deleted rows
CREATE UNIQUE INDEX IF NOT EXISTS receipts_receipt_number_active_key
  ON public.receipts (receipt_number)
  WHERE deleted_at IS NULL;

-- 3. Replace generate_receipt_number to use atomic document_counters (no reuse on delete)
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN public.next_document_number('RCP');
END;
$function$;