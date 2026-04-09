CREATE OR REPLACE FUNCTION public.get_quarterly_revenue(_year INTEGER DEFAULT NULL)
RETURNS TABLE(
  quarter_num INTEGER,
  quarter_label TEXT,
  total_revenue NUMERIC,
  order_count BIGINT
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _target_year INTEGER;
BEGIN
  _target_year := COALESCE(_year, EXTRACT(YEAR FROM now())::INTEGER);
  RETURN QUERY
  SELECT
    q.n AS quarter_num,
    ('Q' || q.n || ' ' || _target_year)::TEXT AS quarter_label,
    COALESCE(SUM(so.grand_total), 0)::NUMERIC AS total_revenue,
    COUNT(so.id)::BIGINT AS order_count
  FROM generate_series(1, 4) AS q(n)
  LEFT JOIN sales_orders so
    ON EXTRACT(QUARTER FROM so.created_at) = q.n
    AND EXTRACT(YEAR FROM so.created_at) = _target_year
    AND so.status NOT IN ('cancelled')
  GROUP BY q.n
  ORDER BY q.n;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_quarterly_revenue(INTEGER) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_yearly_revenue(_years_back INTEGER DEFAULT 5)
RETURNS TABLE(
  year_num INTEGER,
  year_label TEXT,
  total_revenue NUMERIC,
  order_count BIGINT
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_year INTEGER;
  _start_year INTEGER;
BEGIN
  _current_year := EXTRACT(YEAR FROM now())::INTEGER;
  _start_year := _current_year - _years_back + 1;

  RETURN QUERY
  SELECT
    y.n::INTEGER AS year_num,
    y.n::TEXT AS year_label,
    COALESCE(SUM(so.grand_total), 0)::NUMERIC AS total_revenue,
    COUNT(so.id)::BIGINT AS order_count
  FROM generate_series(_start_year, _current_year) AS y(n)
  LEFT JOIN sales_orders so
    ON EXTRACT(YEAR FROM so.created_at) = y.n
    AND so.status NOT IN ('cancelled')
  GROUP BY y.n
  ORDER BY y.n;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_yearly_revenue(INTEGER) TO authenticated;