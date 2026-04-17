-- 1. ลบ trigger ที่ซ้ำซ้อน เก็บไว้เพียงตัวเดียว
DROP TRIGGER IF EXISTS trigger_generate_quote_number ON public.quote_requests;

-- 2. ปรับ generate_quote_number ให้มี retry loop ป้องกัน race condition
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  base_num TEXT;
  candidate TEXT;
  attempt INT := 0;
  max_attempts INT := 10;
  exists_count INT;
BEGIN
  IF NEW.quote_number IS NOT NULL AND NEW.quote_number != '' THEN
    RETURN NEW;
  END IF;

  LOOP
    attempt := attempt + 1;
    base_num := public.generate_next_base_number();
    candidate := 'QT' || base_num;

    -- ตรวจว่าซ้ำในตารางหรือยัง (กันชนกับ row ที่ commit แล้ว)
    SELECT COUNT(*) INTO exists_count
    FROM public.quote_requests
    WHERE quote_number = candidate;

    IF exists_count = 0 THEN
      NEW.quote_number := candidate;
      RETURN NEW;
    END IF;

    IF attempt >= max_attempts THEN
      -- fallback: ใส่ suffix สุ่มเพื่อกัน deadlock ในกรณีสุดวิสัย
      NEW.quote_number := candidate || '-' || substr(md5(random()::text), 1, 4);
      RETURN NEW;
    END IF;
  END LOOP;
END;
$function$;