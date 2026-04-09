

## Plan: อัปเดต AdminQuoteDetail.tsx

แทนที่ไฟล์ `src/pages/admin/AdminQuoteDetail.tsx` ด้วยเวอร์ชันที่อัปโหลดมา (AdminQuoteDetail-3.tsx) — เป็นเวอร์ชันที่ลดความซับซ้อนลง มี UI สะอาดขึ้น

### สิ่งที่เปลี่ยน
- ตัด dependencies ที่ไม่จำเป็นออก (เช่น QuoteStatusFlow, Select, Tabs)
- ใช้ interface แบบ inline แทน import จาก quote-utils
- UI แบบ 3-column layout: ซ้าย (ข้อมูลลูกค้า + สินค้า + ไฟล์แนบ) / ขวา (แชท + ข้อมูลเพิ่มเติม)
- Action bar สำหรับ PO review (อนุมัติ/ปฏิเสธ) เมื่อ status = po_uploaded

### Technical
- แทนที่ไฟล์เดียว: `src/pages/admin/AdminQuoteDetail.tsx`
- ไม่ต้อง migration หรือแก้ไขไฟล์อื่น

