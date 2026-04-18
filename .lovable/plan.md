
ผู้ใช้ต้องการ 2 จุดอีเมลอัตโนมัติสำหรับ guest ที่ส่ง RFQ:

**Flow A — ทันทีหลังส่ง RFQ (guest):**
- Insert quote_requests สำเร็จ + ไม่มี created_by → เรียก `send-transactional-email` ด้วย template `quote-received-invite`
- เนื้อหา: ขอบคุณ + เลขใบเสนอราคา + ปุ่ม "สมัครสมาชิกเพื่อติดตาม" (link ไป `/member-register?email=...&ref=quote_number`)

**Flow B — เมื่อ admin เปลี่ยนสถานะเป็น approved/sent:**
- ใน `QuoteStatusDropdown` หลัง update status → ถ้า quote ไม่มี created_by (guest) → ส่ง template `quote-sent-guest-invite`
- เนื้อหา: ใบเสนอราคาพร้อมแล้ว + ลิงก์ดูใบเสนอราคา (shared link) + ปุ่มสมัครสมาชิก
- ถ้ามี created_by อยู่แล้ว → ใช้ template `quote-sent` เดิม (มีอยู่แล้ว)

**สิ่งที่ต้องทำ:**

1. **ตรวจ prerequisites** — โปรเจกต์มี `send-transactional-email`, `quote-sent.tsx`, registry แล้ว = infra พร้อม ✅

2. **สร้าง 2 templates ใหม่** ใน `supabase/functions/_shared/transactional-email-templates/`:
   - `quote-received-invite.tsx` — ยืนยันรับ RFQ + invite สมัคร (ภาษาไทย, brand ENT Group teal #0fa888)
   - `quote-sent-guest-invite.tsx` — ส่งใบเสนอราคา + invite สมัคร

3. **Update `registry.ts`** เพิ่ม 2 entries

4. **Wire triggers (client-side):**
   - `src/pages/customer/QuoteRequestForm.tsx` — หลัง insert สำเร็จ ถ้า user ไม่ได้ login → invoke send-transactional-email (`quote-received-invite`) ด้วย idempotencyKey `quote-received-${quoteId}`
   - `src/components/shop/QuickRFQForm.tsx` — เช่นเดียวกัน (ฟอร์มสแกนนามบัตร)
   - `src/components/admin/QuoteStatusDropdown.tsx` — เมื่อเปลี่ยนเป็น `approved` และ quote ไม่มี created_by → ส่ง `quote-sent-guest-invite` ไปที่ customer_email

5. **Deploy edge functions** — redeploy `send-transactional-email` (templates อยู่ใน _shared, ต้อง redeploy)

**Register link format:** `https://entgroup.co.th/member-register?email={email}&ref={quote_number}`
(หน้า Register สามารถ pre-fill email จาก query param ได้ — ต้องเช็คเพิ่มว่ารองรับหรือไม่ ถ้ายังไม่รองรับจะเพิ่ม pre-fill ในหน้า Register ด้วย)

**ขอบเขตไฟล์ที่จะแก้:**
- `supabase/functions/_shared/transactional-email-templates/quote-received-invite.tsx` (ใหม่)
- `supabase/functions/_shared/transactional-email-templates/quote-sent-guest-invite.tsx` (ใหม่)
- `supabase/functions/_shared/transactional-email-templates/registry.ts`
- `src/pages/customer/QuoteRequestForm.tsx`
- `src/components/shop/QuickRFQForm.tsx`
- `src/components/admin/QuoteStatusDropdown.tsx`
- `src/pages/auth/Register.tsx` (เฉพาะถ้ายังไม่ pre-fill email จาก query)

ยืนยัน scope นี้ไหมครับ? ถ้า ok จะลงมือทันที
