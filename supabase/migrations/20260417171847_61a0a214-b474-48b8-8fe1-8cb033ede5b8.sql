-- Update Jetson product image paths to use copied assets in /jetson-images/
UPDATE public.products
SET image_url = REPLACE(image_url, '/images/', '/jetson-images/'),
    updated_at = now()
WHERE sku LIKE 'JTSN-%' AND image_url LIKE '/images/%';