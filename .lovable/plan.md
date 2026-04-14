

## Plan: Phase 4A.1 — Customer Invoice Access

เพิ่มระบบให้ลูกค้าดูใบวางบิลของตัวเองผ่าน `/my-invoices`

### สิ่งที่ทำ
1. **Fix CreateInvoiceFromSODialog** — set `customer_id` จาก `quote_requests.created_by` ตอนสร้าง invoice
2. **New: MyInvoices.tsx** — หน้ารายการใบวางบิล (filter: ทั้งหมด/รอชำระ/ชำระแล้ว/เกินกำหนด)
3. **New: MyInvoiceDetail.tsx** — หน้ารายละเอียดใบวางบิล + พิมพ์ PDF + แสดงบัญชีธนาคาร
4. **App.tsx** — เพิ่ม 2 routes: `/my-invoices` + `/my-invoices/:id`
5. **Migration** — backfill `customer_id` จาก `quote_requests.created_by` สำหรับ invoice เดิม
