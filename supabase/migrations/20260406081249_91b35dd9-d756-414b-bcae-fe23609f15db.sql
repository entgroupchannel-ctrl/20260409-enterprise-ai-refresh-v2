-- Fix: Allow users to INSERT/UPDATE/DELETE their own quote_line_items
CREATE POLICY "Users can insert own quote line items"
  ON quote_line_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quote_requests q
      WHERE q.id = quote_line_items.quote_id
      AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own quote line items"
  ON quote_line_items FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quote_requests q
      WHERE q.id = quote_line_items.quote_id
      AND q.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quote_requests q
      WHERE q.id = quote_line_items.quote_id
      AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own quote line items"
  ON quote_line_items FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quote_requests q
      WHERE q.id = quote_line_items.quote_id
      AND q.user_id = auth.uid()
    )
  );