DROP TRIGGER IF EXISTS trg_notify_tax_invoice ON public.tax_invoices;
DROP FUNCTION IF EXISTS public.notify_tax_invoice_created();