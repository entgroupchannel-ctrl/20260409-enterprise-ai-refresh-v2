
-- Attach auto_create_sales_order trigger to quote_requests
CREATE TRIGGER trg_auto_create_sales_order
  AFTER UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_sales_order();

-- Attach auto_create_billing_note trigger to quote_requests
CREATE TRIGGER trg_auto_create_billing_note
  AFTER UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_billing_note();

-- Attach auto_assign_quote trigger to quote_requests
CREATE TRIGGER trg_auto_assign_quote
  BEFORE INSERT ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_quote();

-- Attach generate_quote_number trigger
CREATE TRIGGER trg_generate_quote_number
  BEFORE INSERT ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_quote_number();

-- Attach generate_order_number trigger
CREATE TRIGGER trg_generate_order_number
  BEFORE INSERT ON public.sales_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_order_number();

-- Attach generate_billing_number trigger
CREATE TRIGGER trg_generate_billing_number
  BEFORE INSERT ON public.billing_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_billing_number();

-- Attach generate_invoice_number trigger
CREATE TRIGGER trg_generate_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_invoice_number();

-- Attach generate_delivery_number trigger
CREATE TRIGGER trg_generate_delivery_number
  BEFORE INSERT ON public.delivery_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_delivery_number();

-- Attach generate_payment_number trigger
CREATE TRIGGER trg_generate_payment_number
  BEFORE INSERT ON public.payment_records
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_payment_number();

-- Attach generate_receipt_number trigger
CREATE TRIGGER trg_generate_receipt_number
  BEFORE INSERT ON public.receipts
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_receipt_number();

-- Attach generate_tax_invoice_number trigger
CREATE TRIGGER trg_generate_tax_invoice_number
  BEFORE INSERT ON public.tax_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_tax_invoice_number();

-- Attach calculate_lead_score triggers
CREATE TRIGGER trg_calculate_lead_score_quotes
  BEFORE INSERT OR UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_lead_score();

CREATE TRIGGER trg_calculate_lead_score_contacts
  BEFORE INSERT OR UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_lead_score();

-- Attach ensure_super_admin_permissions trigger
CREATE TRIGGER trg_ensure_super_admin_permissions
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_super_admin_permissions();
