
-- Engagement Events table
CREATE TABLE public.engagement_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  product_id text,
  product_name text,
  product_category text,
  channel text,
  metadata jsonb DEFAULT '{}'::jsonb,
  page_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX idx_engagement_session ON public.engagement_events(session_id);
CREATE INDEX idx_engagement_event_type ON public.engagement_events(event_type);
CREATE INDEX idx_engagement_product ON public.engagement_events(product_id);
CREATE INDEX idx_engagement_created ON public.engagement_events(created_at DESC);
CREATE INDEX idx_engagement_user ON public.engagement_events(user_id);

-- RLS
ALTER TABLE public.engagement_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous tracking)
CREATE POLICY "Anyone can insert engagement events"
  ON public.engagement_events FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Admins can view engagement events"
  ON public.engagement_events FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- View for lead scoring aggregation
CREATE OR REPLACE VIEW public.engagement_lead_scores AS
SELECT
  session_id,
  user_id,
  SUM(CASE
    WHEN event_type = 'quote_request' THEN 20
    WHEN event_type = 'contact_submit' THEN 15
    WHEN event_type = 'chat_inquiry' THEN 10
    WHEN event_type = 'share' THEN 8
    WHEN event_type = 'wishlist_add' THEN 5
    WHEN event_type = 'wishlist_remove' THEN -3
    WHEN event_type = 'product_view' THEN 1
    ELSE 0
  END) AS total_score,
  COUNT(*) AS total_events,
  COUNT(DISTINCT product_id) AS unique_products,
  MAX(created_at) AS last_activity,
  MIN(created_at) AS first_activity,
  ARRAY_AGG(DISTINCT product_category) FILTER (WHERE product_category IS NOT NULL) AS categories
FROM public.engagement_events
GROUP BY session_id, user_id;
