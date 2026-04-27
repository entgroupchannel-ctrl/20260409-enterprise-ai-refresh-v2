UPDATE public.products SET series = 'Interactive Display' WHERE sku IN ('ITD-HD32','ITD-HR43','ITD-HR55','ITD-HR65');

UPDATE public.products SET image_url = '/images/touchwo/hr43.jpg' WHERE sku = 'ITD-HR43';
UPDATE public.products SET image_url = '/images/touchwo/hr55.jpg' WHERE sku = 'ITD-HR55';
UPDATE public.products SET image_url = '/images/touchwo/hr65.jpg' WHERE sku = 'ITD-HR65';