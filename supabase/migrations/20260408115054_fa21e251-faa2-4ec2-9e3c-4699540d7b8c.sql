CREATE OR REPLACE FUNCTION public.get_weekly_revenue(_week_offset integer DEFAULT 0)
RETURNS TABLE (
  day_of_week integer,
  day_name text,
  total_revenue numeric,
  order_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  week_start date;
  week_end date;
BEGIN
  week_start := (date_trunc('week', CURRENT_DATE + (_week_offset * 7)))::date;
  week_end := week_start + 6;

  RETURN QUERY
  WITH days AS (
    SELECT d.n as dow, d.dname
    FROM (VALUES (1,'จันทร์'),(2,'อังคาร'),(3,'พุธ'),(4,'พฤหัสบดี'),(5,'ศุกร์'),(6,'เสาร์'),(0,'อาทิตย์')) AS d(n, dname)
  ),
  revenue AS (
    SELECT
      EXTRACT(DOW FROM so.created_at)::integer as day_of_week,
      COALESCE(SUM(so.grand_total), 0)::numeric as rev,
      COUNT(*)::bigint as cnt
    FROM sales_orders so
    WHERE so.created_at::date BETWEEN week_start AND week_end
      AND so.status NOT IN ('cancelled')
    GROUP BY EXTRACT(DOW FROM so.created_at)
  )
  SELECT
    d.dow,
    d.dname,
    COALESCE(r.rev, 0)::numeric,
    COALESCE(r.cnt, 0)::bigint
  FROM days d
  LEFT JOIN revenue r ON d.dow = r.day_of_week
  ORDER BY CASE d.dow WHEN 0 THEN 7 ELSE d.dow END;
END;
$$;