# Post-Deploy Smoke Test Checklist

ใช้หลัง deploy หรือหลังแก้ schema/trigger เพื่อจับปัญหาก่อนลูกค้าเจอ

## 0. Database Health (1 นาที)
- [ ] รัน `supabase--linter` — ตรวจ ERROR ใหม่ (WARN/INFO ที่มีอยู่เดิมข้ามได้)
- [ ] Trigger column-mismatch scan: รัน query ด้านล่าง ต้องคืน `[]`
  ```sql
  WITH trig AS (
    SELECT t.tgname, c.relname AS table_name, pg_get_functiondef(p.oid) AS def
    FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
    JOIN pg_proc p ON p.oid=t.tgfoid
    JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND NOT t.tgisinternal
  ),
  refs AS (
    SELECT tgname, table_name,
           (regexp_matches(def, 'NEW\.([a-z_][a-z0-9_]*)', 'g'))[1] AS col
    FROM trig
  )
  SELECT DISTINCT r.tgname, r.table_name, r.col
  FROM refs r
  LEFT JOIN information_schema.columns c
    ON c.table_schema='public' AND c.table_name=r.table_name AND c.column_name=r.col
  WHERE c.column_name IS NULL
    AND r.col NOT IN ('op','tg_op','tg_name','tg_when','tg_level','tg_relid');
  ```

## 1. B2B Document Chain (5 นาที)
ทดสอบเป็นลูกค้าทดสอบ + admin เป็นรอบเดียวจบ:

- [ ] **Quote**: สร้างใบเสนอราคาใหม่ → ส่ง → admin เห็นในรายการ → notification ขึ้น 🔔
- [ ] **PO Upload**: ลูกค้าอัปโหลด PO → status เป็น `po_uploaded` → admin ได้ notification
- [ ] **Sale Order**: admin สร้าง SO จาก quote → เลขเอกสารถูก format
- [ ] **Invoice**: สร้างใบวางบิลจาก SO → ลูกค้าเห็นในพอร์ทัล
- [ ] **Payment Slip**: ลูกค้าอัปโหลดสลิป → admin เห็นภาพได้ (super_admin/admin/sales)
- [ ] **Tax Invoice**: admin สร้างใบกำกับภาษีจาก invoice ที่ verified → ไม่มี error
- [ ] **Receipt**: ออกใบเสร็จ → ลูกค้าเห็น
- [ ] **Credit Note**: สร้าง credit note จาก tax invoice → ยอด/เลขถูก

## 2. Auth & Permissions (2 นาที)
- [ ] Login ด้วย super_admin → เห็นเมนูครบ
- [ ] Login ด้วย sales → เห็นเฉพาะที่อนุญาต
- [ ] Login ด้วย customer → เห็นเฉพาะข้อมูลตัวเอง

## 3. Storage Access (1 นาที)
- [ ] Customer เห็น signed URL ของสลิปตัวเอง
- [ ] Admin/super_admin เห็น signed URL สลิปทุกคน
- [ ] PDF/datasheet download ได้

## 4. Notifications (1 นาที)
- [ ] กระดิ่ง 🔔 แสดงตัวเลข unread ถูก
- [ ] คลิก notification → ไปหน้าที่ถูกต้อง

## 🚨 Red Flags (ต้องหยุดทันที)
- Error toast ที่มีคำว่า `column ... does not exist` → schema/trigger mismatch
- Error toast `record "new" has no field` → trigger อ้างคอลัมน์ผิด
- `permission denied for table` → RLS policy หาย/ผิด
- White screen ตอน Login → useAuth/permissions hook ค้าง

## 📌 หมายเหตุ
- ปัญหาที่เคยเจอ (เก็บไว้กันลืม):
  - `tax_invoices.customer_email` ไม่มี — โค้ด insert ผิด (แก้แล้ว 2026-04-17)
  - Trigger `notify_tax_invoice_created` อ้าง `NEW.invoice_number` (แก้แล้ว 2026-04-17)
  - Storage RLS `payment-slips` ไม่รวม super_admin (แก้แล้ว 2026-04-17)
