-- =============================================
-- Phase 5: Analytics Helper Functions
-- =============================================

-- 1. Negotiation Stats — overall KPIs
CREATE OR REPLACE FUNCTION public.get_negotiation_stats(
  p_start_date DATE DEFAULT (CURRENT_DATE - INTERVAL '30 days')::DATE,
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  WITH stats AS (
    SELECT
      COUNT(*) AS total_quotes,
      COUNT(*) FILTER (WHERE status IN ('accepted','po_uploaded','po_confirmed','po_approved','completed')) AS accepted_count,
      COUNT(*) FILTER (WHERE status = 'rejected') AS rejected_count,
      COUNT(*) FILTER (WHERE status = 'expired') AS expired_count,
      COUNT(*) FILTER (WHERE status = 'negotiating') AS negotiating_count,
      AVG(NULLIF(total_revisions, 0)) AS avg_revisions,
      AVG(NULLIF(negotiation_count, 0)) AS avg_negotiation_rounds,
      AVG(grand_total) FILTER (WHERE grand_total > 0) AS avg_quote_value,
      SUM(grand_total) FILTER (WHERE status IN ('accepted','po_uploaded','po_confirmed','po_approved','completed')) AS total_won_value
    FROM quote_requests
    WHERE created_at::DATE BETWEEN p_start_date AND p_end_date
  ),
  discount_stats AS (
    SELECT
      AVG(qrev.discount_percent) FILTER (WHERE qrev.discount_percent > 0) AS avg_discount_given,
      MAX(qrev.discount_percent) AS max_discount_given,
      COUNT(*) FILTER (WHERE qrev.discount_percent > 0) AS quotes_with_discount
    FROM quote_revisions qrev
    INNER JOIN quote_requests q ON q.id = qrev.quote_id
    WHERE q.created_at::DATE BETWEEN p_start_date AND p_end_date
      AND qrev.status IN ('sent','accepted')
  ),
  duration_stats AS (
    SELECT
      AVG(EXTRACT(EPOCH FROM (accepted_at - created_at)) / 86400) AS avg_days_to_close
    FROM quote_requests
    WHERE created_at::DATE BETWEEN p_start_date AND p_end_date
      AND accepted_at IS NOT NULL
  )
  SELECT jsonb_build_object(
    'period_start', p_start_date,
    'period_end', p_end_date,
    'total_quotes', COALESCE(s.total_quotes, 0),
    'accepted_count', COALESCE(s.accepted_count, 0),
    'rejected_count', COALESCE(s.rejected_count, 0),
    'expired_count', COALESCE(s.expired_count, 0),
    'negotiating_count', COALESCE(s.negotiating_count, 0),
    'acceptance_rate', CASE
      WHEN COALESCE(s.total_quotes, 0) > 0 
      THEN ROUND((COALESCE(s.accepted_count, 0)::NUMERIC / s.total_quotes) * 100, 1)
      ELSE 0
    END,
    'avg_revisions', ROUND(COALESCE(s.avg_revisions, 0)::NUMERIC, 1),
    'avg_negotiation_rounds', ROUND(COALESCE(s.avg_negotiation_rounds, 0)::NUMERIC, 1),
    'avg_quote_value', ROUND(COALESCE(s.avg_quote_value, 0)::NUMERIC, 0),
    'total_won_value', ROUND(COALESCE(s.total_won_value, 0)::NUMERIC, 0),
    'avg_discount_given', ROUND(COALESCE(d.avg_discount_given, 0)::NUMERIC, 1),
    'max_discount_given', ROUND(COALESCE(d.max_discount_given, 0)::NUMERIC, 1),
    'quotes_with_discount', COALESCE(d.quotes_with_discount, 0),
    'avg_days_to_close', ROUND(COALESCE(dur.avg_days_to_close, 0)::NUMERIC, 1)
  )
  INTO v_result
  FROM stats s
  LEFT JOIN discount_stats d ON true
  LEFT JOIN duration_stats dur ON true;

  RETURN v_result;
END;
$$;

-- 2. Negotiation Trends — daily counts for chart
CREATE OR REPLACE FUNCTION public.get_negotiation_trends(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  date DATE,
  quotes_created INTEGER,
  quotes_accepted INTEGER,
  quotes_rejected INTEGER,
  total_value NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d::DATE AS date,
    (SELECT COUNT(*)::INTEGER FROM quote_requests 
     WHERE created_at::DATE = d::DATE) AS quotes_created,
    (SELECT COUNT(*)::INTEGER FROM quote_requests 
     WHERE accepted_at::DATE = d::DATE) AS quotes_accepted,
    (SELECT COUNT(*)::INTEGER FROM quote_requests 
     WHERE rejected_at::DATE = d::DATE) AS quotes_rejected,
    COALESCE(
      (SELECT SUM(grand_total) FROM quote_requests 
       WHERE accepted_at::DATE = d::DATE), 
      0
    ) AS total_value
  FROM generate_series(
    CURRENT_DATE - (p_days - 1),
    CURRENT_DATE,
    '1 day'::interval
  ) d
  ORDER BY d::DATE;
$$;

-- 3. Top Sales Performers
CREATE OR REPLACE FUNCTION public.get_top_sales_performers(
  p_limit INTEGER DEFAULT 10,
  p_start_date DATE DEFAULT (CURRENT_DATE - INTERVAL '30 days')::DATE
)
RETURNS TABLE(
  sales_id UUID,
  sales_name TEXT,
  total_revisions INTEGER,
  quotes_handled INTEGER,
  avg_discount NUMERIC,
  acceptance_rate NUMERIC,
  total_value NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH sales_stats AS (
    SELECT
      qrev.created_by AS sales_id,
      qrev.created_by_name AS sales_name,
      COUNT(DISTINCT qrev.id)::INTEGER AS total_revisions,
      COUNT(DISTINCT qrev.quote_id)::INTEGER AS quotes_handled,
      AVG(qrev.discount_percent) FILTER (WHERE qrev.discount_percent > 0) AS avg_discount,
      COUNT(DISTINCT qrev.quote_id) FILTER (
        WHERE EXISTS (
          SELECT 1 FROM quote_requests q 
          WHERE q.id = qrev.quote_id 
            AND q.status IN ('accepted','po_uploaded','po_confirmed','po_approved','completed')
        )
      )::NUMERIC AS accepted_quotes,
      SUM(qrev.grand_total) FILTER (
        WHERE EXISTS (
          SELECT 1 FROM quote_requests q 
          WHERE q.id = qrev.quote_id 
            AND q.status IN ('accepted','po_uploaded','po_confirmed','po_approved','completed')
        )
      ) AS total_value
    FROM quote_revisions qrev
    WHERE qrev.created_at::DATE >= p_start_date
      AND qrev.created_by_role IN ('admin','sales')
      AND qrev.created_by IS NOT NULL
    GROUP BY qrev.created_by, qrev.created_by_name
  )
  SELECT
    sales_id,
    sales_name,
    total_revisions,
    quotes_handled,
    ROUND(COALESCE(avg_discount, 0)::NUMERIC, 1) AS avg_discount,
    ROUND(
      CASE WHEN quotes_handled > 0 
        THEN (accepted_quotes / quotes_handled::NUMERIC) * 100 
        ELSE 0 
      END::NUMERIC, 
      1
    ) AS acceptance_rate,
    ROUND(COALESCE(total_value, 0)::NUMERIC, 0) AS total_value
  FROM sales_stats
  ORDER BY total_value DESC NULLS LAST
  LIMIT p_limit;
$$;

-- 4. Insights for a single quote
CREATE OR REPLACE FUNCTION public.get_quote_negotiation_insights(
  p_quote_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
  v_first_rev RECORD;
  v_last_rev RECORD;
  v_free_items_value NUMERIC := 0;
BEGIN
  SELECT * INTO v_first_rev
  FROM quote_revisions
  WHERE quote_id = p_quote_id
    AND status IN ('sent','accepted','superseded','rejected')
  ORDER BY revision_number ASC
  LIMIT 1;

  SELECT * INTO v_last_rev
  FROM quote_revisions
  WHERE quote_id = p_quote_id
    AND status IN ('sent','accepted')
  ORDER BY revision_number DESC
  LIMIT 1;

  IF v_first_rev IS NULL THEN
    RETURN jsonb_build_object('has_data', false);
  END IF;

  IF v_last_rev IS NOT NULL AND v_last_rev.free_items IS NOT NULL THEN
    SELECT COALESCE(SUM((value->>'total_value')::NUMERIC), 0)
    INTO v_free_items_value
    FROM jsonb_array_elements(v_last_rev.free_items);
  END IF;

  v_result := jsonb_build_object(
    'has_data', true,
    'total_revisions', (SELECT COUNT(*) FROM quote_revisions WHERE quote_id = p_quote_id),
    'negotiation_rounds', (SELECT COUNT(*) FROM quote_negotiation_requests WHERE quote_id = p_quote_id),
    'first_offer', jsonb_build_object(
      'revision_number', v_first_rev.revision_number,
      'grand_total', v_first_rev.grand_total,
      'discount_percent', v_first_rev.discount_percent,
      'created_at', v_first_rev.created_at
    ),
    'current_offer', CASE WHEN v_last_rev IS NOT NULL THEN jsonb_build_object(
      'revision_number', v_last_rev.revision_number,
      'grand_total', v_last_rev.grand_total,
      'discount_percent', v_last_rev.discount_percent,
      'free_items_value', v_free_items_value,
      'created_at', v_last_rev.created_at
    ) ELSE NULL END,
    'customer_savings', CASE 
      WHEN v_last_rev IS NOT NULL AND v_first_rev.grand_total > 0
      THEN v_first_rev.grand_total - v_last_rev.grand_total
      ELSE 0
    END,
    'savings_percent', CASE 
      WHEN v_last_rev IS NOT NULL AND v_first_rev.grand_total > 0
      THEN ROUND(((v_first_rev.grand_total - v_last_rev.grand_total) / v_first_rev.grand_total * 100)::NUMERIC, 1)
      ELSE 0
    END
  );

  RETURN v_result;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_negotiation_stats(DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_negotiation_trends(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_sales_performers(INTEGER, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_quote_negotiation_insights(UUID) TO authenticated;