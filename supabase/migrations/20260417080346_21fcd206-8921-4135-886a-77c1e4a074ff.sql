-- 1) Counter table แยกตามชนิดเอกสาร + วันที่
CREATE TABLE IF NOT EXISTS public.document_counters (
  doc_type TEXT NOT NULL,
  date_key TEXT NOT NULL,
  last_seq INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (doc_type, date_key)
);

ALTER TABLE public.document_counters ENABLE ROW LEVEL SECURITY;

-- ผู้ใช้ทั่วไปไม่ต้องอ่าน — trigger ใช้ผ่าน SECURITY DEFINER
-- เปิดให้แอดมินดูเพื่อตรวจสอบได้
DROP POLICY IF EXISTS "Admins can view counters" ON public.document_counters;
CREATE POLICY "Admins can view counters"
  ON public.document_counters
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2) Atomic increment function — UPSERT + RETURNING
CREATE OR REPLACE FUNCTION public.next_document_number(_doc_type TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  today_key TEXT;
  new_seq INT;
BEGIN
  today_key := to_char(now() AT TIME ZONE 'Asia/Bangkok', 'YYYYMMDD');

  INSERT INTO public.document_counters (doc_type, date_key, last_seq)
  VALUES (_doc_type, today_key, 1)
  ON CONFLICT (doc_type, date_key)
  DO UPDATE SET
    last_seq = public.document_counters.last_seq + 1,
    updated_at = now()
  RETURNING last_seq INTO new_seq;

  RETURN _doc_type || today_key || lpad(new_seq::text, 4, '0');
END;
$$;

-- 3) ปรับ generate_quote_number ใช้ counter ใหม่
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.quote_number IS NOT NULL AND NEW.quote_number != '' THEN
    RETURN NEW;
  END IF;
  NEW.quote_number := public.next_document_number('QT');
  RETURN NEW;
END;
$$;

-- 4) Seed counter จากข้อมูลปัจจุบัน — กันเลขซ้ำกับ row เก่า
INSERT INTO public.document_counters (doc_type, date_key, last_seq)
SELECT
  'QT' AS doc_type,
  substring(quote_number FROM 3 FOR 8) AS date_key,
  MAX(CAST(substring(quote_number FROM 11 FOR 4) AS INT)) AS last_seq
FROM public.quote_requests
WHERE quote_number ~ '^QT\d{12}$'
GROUP BY substring(quote_number FROM 3 FOR 8)
ON CONFLICT (doc_type, date_key) DO UPDATE
  SET last_seq = GREATEST(public.document_counters.last_seq, EXCLUDED.last_seq);