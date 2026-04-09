ALTER TABLE quote_line_items ADD COLUMN IF NOT EXISTS description TEXT;

UPDATE quote_line_items qli
SET description = pc.description
FROM product_catalog pc
WHERE qli.product_id = pc.id
  AND qli.description IS NULL
  AND pc.description IS NOT NULL;

COMMENT ON COLUMN quote_line_items.description IS
  'รายละเอียดสินค้าที่แสดงให้ลูกค้าเห็นในใบเสนอราคา ดึงเริ่มจาก product_catalog.description แต่แก้ไขได้รายใบ';