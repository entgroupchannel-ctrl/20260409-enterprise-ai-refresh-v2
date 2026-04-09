-- Update quote_number format to QT{YYYYMMDD}{seq}{HHMMSS}
-- Example: QT202604090001143000 (2026-04-09, ฉบับที่ 1, 14:30:00)

CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  seq_num INT;
  today_start TIMESTAMP;
  today_end TIMESTAMP;
  time_part TEXT;
BEGIN
  today_start := date_trunc('day', NOW());
  today_end := today_start + INTERVAL '1 day';
  
  SELECT COUNT(*) + 1 INTO seq_num
  FROM quote_requests
  WHERE created_at >= today_start AND created_at < today_end;
  
  time_part := to_char(NOW(), 'HH24MISS');
  
  NEW.quote_number := 'QT' || 
                      to_char(NOW(), 'YYYYMMDD') || 
                      lpad(seq_num::text, 4, '0') ||
                      time_part;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger with proper condition
DROP TRIGGER IF EXISTS generate_quote_number ON quote_requests;
DROP TRIGGER IF EXISTS trg_quote_number ON quote_requests;

CREATE TRIGGER trg_quote_number
  BEFORE INSERT ON quote_requests
  FOR EACH ROW
  WHEN (NEW.quote_number IS NULL OR NEW.quote_number = '')
  EXECUTE FUNCTION generate_quote_number();