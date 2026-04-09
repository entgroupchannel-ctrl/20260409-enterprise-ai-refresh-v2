DROP FUNCTION IF EXISTS public.get_weekly_revenue(INTEGER);

CREATE OR REPLACE FUNCTION public.get_weekly_revenue(_week_offset INTEGER DEFAULT 0)
RETURNS TABLE (
  day_of_week INTEGER,
  day_name TEXT,
  total_revenue NUMERIC,
  order_count INTEGER
) AS $$
DECLARE
  week_start DATE;
  week_end DATE;
BEGIN
  week_start := DATE_TRUNC('week', CURRENT_DATE - (_week_offset * 7 || ' days')::INTERVAL)::DATE;
  week_end := week_start + 6;

  RETURN QUERY
  WITH date_series AS (
    SELECT 
      generate_series(week_start, week_end, '1 day'::INTERVAL)::DATE AS date,
      EXTRACT(DOW FROM generate_series(week_start, week_end, '1 day'::INTERVAL)::DATE)::INTEGER AS dow,
      CASE EXTRACT(DOW FROM generate_series(week_start, week_end, '1 day'::INTERVAL)::DATE)
        WHEN 0 THEN 'อาทิตย์'
        WHEN 1 THEN 'จันทร์'
        WHEN 2 THEN 'อังคาร'
        WHEN 3 THEN 'พุธ'
        WHEN 4 THEN 'พฤหัสบดี'
        WHEN 5 THEN 'ศุกร์'
        WHEN 6 THEN 'เสาร์'
      END AS day_name
  ),
  daily_revenue AS (
    SELECT 
      DATE(so.created_at) AS order_date,
      SUM(so.total_amount) AS total_revenue,
      COUNT(*) AS total_orders
    FROM public.sales_orders so
    WHERE so.created_at >= week_start
      AND so.created_at < (week_end + 1)
      AND so.status NOT IN ('cancelled', 'draft')
    GROUP BY DATE(so.created_at)
  )
  SELECT 
    ds.dow,
    ds.day_name,
    COALESCE(dr.total_revenue, 0) AS total_revenue,
    COALESCE(dr.total_orders, 0) AS order_count
  FROM date_series ds
  LEFT JOIN daily_revenue dr ON ds.date = dr.order_date
  ORDER BY ds.date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_weekly_revenue TO authenticated;