
-- Create a sequence for quote numbers (start at 2 since 0001 exists)
CREATE SEQUENCE IF NOT EXISTS public.quote_number_seq START WITH 2;

-- Update the trigger function to use sequence instead of MAX query
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  year_part VARCHAR(4);
  seq_val INTEGER;
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    year_part := TO_CHAR(NOW(), 'YYYY');
    seq_val := nextval('quote_number_seq');
    NEW.quote_number := 'QT-' || year_part || '-' || LPAD(seq_val::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$function$;
