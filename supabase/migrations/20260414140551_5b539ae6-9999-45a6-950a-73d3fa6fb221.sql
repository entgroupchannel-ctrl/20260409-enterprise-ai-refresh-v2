
-- ============================================================
-- Fix all RLS policies to include 'super_admin' role
-- ============================================================

-- 1. company_bank_accounts
DROP POLICY IF EXISTS "bank_accounts_admin_delete" ON public.company_bank_accounts;
CREATE POLICY "bank_accounts_admin_delete" ON public.company_bank_accounts FOR DELETE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

DROP POLICY IF EXISTS "bank_accounts_admin_insert" ON public.company_bank_accounts;
CREATE POLICY "bank_accounts_admin_insert" ON public.company_bank_accounts FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

DROP POLICY IF EXISTS "bank_accounts_admin_update" ON public.company_bank_accounts;
CREATE POLICY "bank_accounts_admin_update" ON public.company_bank_accounts FOR UPDATE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

-- 2. company_settings
DROP POLICY IF EXISTS "company_settings_admin_insert" ON public.company_settings;
CREATE POLICY "company_settings_admin_insert" ON public.company_settings FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

DROP POLICY IF EXISTS "company_settings_admin_update" ON public.company_settings;
CREATE POLICY "company_settings_admin_update" ON public.company_settings FOR UPDATE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

-- 3. contact_submissions
DROP POLICY IF EXISTS "contact_select_admin" ON public.contact_submissions;
CREATE POLICY "contact_select_admin" ON public.contact_submissions FOR SELECT
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

DROP POLICY IF EXISTS "contact_update_admin" ON public.contact_submissions;
CREATE POLICY "contact_update_admin" ON public.contact_submissions FOR UPDATE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 4. contacts
DROP POLICY IF EXISTS "contacts_delete_admin" ON public.contacts;
CREATE POLICY "contacts_delete_admin" ON public.contacts FOR DELETE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

DROP POLICY IF EXISTS "contacts_insert_admin_sales" ON public.contacts;
CREATE POLICY "contacts_insert_admin_sales" ON public.contacts FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

DROP POLICY IF EXISTS "contacts_read_admin_sales" ON public.contacts;
CREATE POLICY "contacts_read_admin_sales" ON public.contacts FOR SELECT
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

DROP POLICY IF EXISTS "contacts_update_admin_sales" ON public.contacts;
CREATE POLICY "contacts_update_admin_sales" ON public.contacts FOR UPDATE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 5. document_downloads
DROP POLICY IF EXISTS "doc_downloads_select_admin" ON public.document_downloads;
CREATE POLICY "doc_downloads_select_admin" ON public.document_downloads FOR SELECT
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

-- 6. documents
DROP POLICY IF EXISTS "documents_delete_admin" ON public.documents;
CREATE POLICY "documents_delete_admin" ON public.documents FOR DELETE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

DROP POLICY IF EXISTS "documents_insert_admin" ON public.documents;
CREATE POLICY "documents_insert_admin" ON public.documents FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

DROP POLICY IF EXISTS "documents_select_admin" ON public.documents;
CREATE POLICY "documents_select_admin" ON public.documents FOR SELECT
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

DROP POLICY IF EXISTS "documents_update_admin" ON public.documents;
CREATE POLICY "documents_update_admin" ON public.documents FOR UPDATE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

-- 7. invoice_items
DROP POLICY IF EXISTS "billing_invoice_items_admin_all" ON public.invoice_items;
CREATE POLICY "billing_invoice_items_admin_all" ON public.invoice_items FOR ALL
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')))
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 8. invoices
DROP POLICY IF EXISTS "billing_invoices_admin_all" ON public.invoices;
CREATE POLICY "billing_invoices_admin_all" ON public.invoices FOR ALL
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')))
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 9. payment_records
DROP POLICY IF EXISTS "billing_payments_admin_all" ON public.payment_records;
CREATE POLICY "billing_payments_admin_all" ON public.payment_records FOR ALL
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')))
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 10. po_change_requests
DROP POLICY IF EXISTS "po_change_admin_all" ON public.po_change_requests;
CREATE POLICY "po_change_admin_all" ON public.po_change_requests FOR ALL
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')))
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 11. po_versions
DROP POLICY IF EXISTS "po_versions_admin_all" ON public.po_versions;
CREATE POLICY "po_versions_admin_all" ON public.po_versions FOR ALL
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')))
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 12. product_categories
DROP POLICY IF EXISTS "Admin can manage categories" ON public.product_categories;
CREATE POLICY "Admin can manage categories" ON public.product_categories FOR ALL TO authenticated
USING (get_user_role(auth.uid()) IN ('super_admin','admin','sales'))
WITH CHECK (get_user_role(auth.uid()) IN ('super_admin','admin','sales'));

-- 13. product_files
DROP POLICY IF EXISTS "Admin can manage product files" ON public.product_files;
CREATE POLICY "Admin can manage product files" ON public.product_files FOR ALL TO authenticated
USING (get_user_role(auth.uid()) IN ('super_admin','admin','sales'))
WITH CHECK (get_user_role(auth.uid()) IN ('super_admin','admin','sales'));

-- 14. product_tags
DROP POLICY IF EXISTS "Admin can manage tags" ON public.product_tags;
CREATE POLICY "Admin can manage tags" ON public.product_tags FOR ALL TO authenticated
USING (get_user_role(auth.uid()) IN ('super_admin','admin','sales'))
WITH CHECK (get_user_role(auth.uid()) IN ('super_admin','admin','sales'));

-- 15. product_variants
DROP POLICY IF EXISTS "Admin can manage variants" ON public.product_variants;
CREATE POLICY "Admin can manage variants" ON public.product_variants FOR ALL TO authenticated
USING (get_user_role(auth.uid()) IN ('super_admin','admin','sales'))
WITH CHECK (get_user_role(auth.uid()) IN ('super_admin','admin','sales'));

-- 16. products
DROP POLICY IF EXISTS "Admin can delete products" ON public.products;
CREATE POLICY "Admin can delete products" ON public.products FOR DELETE TO authenticated
USING (get_user_role(auth.uid()) IN ('super_admin','admin','sales'));

DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
CREATE POLICY "Admin can insert products" ON public.products FOR INSERT TO authenticated
WITH CHECK (get_user_role(auth.uid()) IN ('super_admin','admin','sales'));

DROP POLICY IF EXISTS "Admin can update products" ON public.products;
CREATE POLICY "Admin can update products" ON public.products FOR UPDATE TO authenticated
USING (get_user_role(auth.uid()) IN ('super_admin','admin','sales'));

-- 17. quote_files
DROP POLICY IF EXISTS "quote_files_delete_admin" ON public.quote_files;
CREATE POLICY "quote_files_delete_admin" ON public.quote_files FOR DELETE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

DROP POLICY IF EXISTS "quote_files_select" ON public.quote_files;
CREATE POLICY "quote_files_select" ON public.quote_files FOR SELECT
USING (EXISTS (
  SELECT 1 FROM quote_requests qr
  WHERE qr.id = quote_files.quote_id
  AND (
    qr.customer_email = (SELECT email FROM users WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales'))
  )
));

-- 18. quote_messages
DROP POLICY IF EXISTS "quote_messages_select" ON public.quote_messages;
CREATE POLICY "quote_messages_select" ON public.quote_messages FOR SELECT
USING (EXISTS (
  SELECT 1 FROM quote_requests qr
  WHERE qr.id = quote_messages.quote_id
  AND (
    qr.customer_email = (SELECT email FROM users WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales'))
  )
));

-- 19. quote_negotiation_requests
DROP POLICY IF EXISTS "negotiation_admin_all" ON public.quote_negotiation_requests;
CREATE POLICY "negotiation_admin_all" ON public.quote_negotiation_requests FOR ALL TO authenticated
USING (get_user_role(auth.uid()) IN ('super_admin','admin','sales'))
WITH CHECK (get_user_role(auth.uid()) IN ('super_admin','admin','sales'));

-- 20. quote_requests
DROP POLICY IF EXISTS "quote_select_admin" ON public.quote_requests;
CREATE POLICY "quote_select_admin" ON public.quote_requests FOR SELECT
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

DROP POLICY IF EXISTS "quote_update_admin" ON public.quote_requests;
CREATE POLICY "quote_update_admin" ON public.quote_requests FOR UPDATE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 21. quote_revisions
DROP POLICY IF EXISTS "revisions_admin_all" ON public.quote_revisions;
CREATE POLICY "revisions_admin_all" ON public.quote_revisions FOR ALL TO authenticated
USING (get_user_role(auth.uid()) IN ('super_admin','admin','sales'))
WITH CHECK (get_user_role(auth.uid()) IN ('super_admin','admin','sales'));

-- 22. quote_term_templates
DROP POLICY IF EXISTS "term_templates_admin" ON public.quote_term_templates;
CREATE POLICY "term_templates_admin" ON public.quote_term_templates FOR ALL TO authenticated
USING (get_user_role(auth.uid()) IN ('super_admin','admin','sales'))
WITH CHECK (get_user_role(auth.uid()) IN ('super_admin','admin','sales'));

-- 23. receipts
DROP POLICY IF EXISTS "billing_receipts_admin_all" ON public.receipts;
CREATE POLICY "billing_receipts_admin_all" ON public.receipts FOR ALL
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')))
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 24. sale_orders
DROP POLICY IF EXISTS "sale_orders_delete_admin" ON public.sale_orders;
CREATE POLICY "sale_orders_delete_admin" ON public.sale_orders FOR DELETE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

DROP POLICY IF EXISTS "sale_orders_insert_admin" ON public.sale_orders;
CREATE POLICY "sale_orders_insert_admin" ON public.sale_orders FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

DROP POLICY IF EXISTS "sale_orders_select_admin" ON public.sale_orders;
CREATE POLICY "sale_orders_select_admin" ON public.sale_orders FOR SELECT
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

DROP POLICY IF EXISTS "sale_orders_update_admin" ON public.sale_orders;
CREATE POLICY "sale_orders_update_admin" ON public.sale_orders FOR UPDATE
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 25. subscribers
DROP POLICY IF EXISTS "subscribers_select_admin" ON public.subscribers;
CREATE POLICY "subscribers_select_admin" ON public.subscribers FOR SELECT
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin')));

-- 26. tax_invoice_items
DROP POLICY IF EXISTS "billing_tax_invoice_items_admin_all" ON public.tax_invoice_items;
CREATE POLICY "billing_tax_invoice_items_admin_all" ON public.tax_invoice_items FOR ALL
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')))
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 27. tax_invoices
DROP POLICY IF EXISTS "billing_tax_invoices_admin_all" ON public.tax_invoices;
CREATE POLICY "billing_tax_invoices_admin_all" ON public.tax_invoices FOR ALL
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')))
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin','admin','sales')));

-- 28. user_profiles
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.user_profiles;
CREATE POLICY "Admin can view all profiles" ON public.user_profiles FOR SELECT
USING (get_user_role(auth.uid()) IN ('super_admin','admin','sales'));

-- 29. users
DROP POLICY IF EXISTS "admin_select_all_users" ON public.users;
CREATE POLICY "admin_select_all_users" ON public.users FOR SELECT
USING (auth.uid() = id OR get_user_role(auth.uid()) IN ('super_admin','admin','sales'));
