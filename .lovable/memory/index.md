# Memory: index.md
Updated: today

# Project Memory

## Core
ENT Group — B2B Industrial Computing Platform ภาษาไทย. Supabase backend.
ใช้ semantic tokens จาก design system. ห้ามใช้สี hardcode ใน components.
ก่อนแก้หรือ deploy ต้องยืนยัน scope ตามข้อความที่ผู้ใช้กำหนด และห้ามแตะไฟล์นอก prompt.
ลิงก์แชร์เอกสารสาธารณะใช้ base URL `https://www.entgroup.co.th` เสมอ (ห้าม window.location.origin).
ลูกค้าห้ามเห็นใบเสนอราคา status='draft' — query ฝั่งลูกค้าต้อง .neq('status','draft') เสมอ.

## Memories
- [Quote Visibility Rule](mem://features/quote-visibility-rule) — กฎ sensitive: ซ่อน draft จากลูกค้า ต้อง admin ส่งก่อนเท่านั้น
- [Cart System](mem://features/cart-system) — ระบบตะกร้า + โปรไฟล์ลูกค้า (cart_items, user_profiles) สร้าง quote แบบ batch
- [Quote Builder UX](mem://features/quote-builder/ux-refinement) — การปรับปรุง UX ในหน้า Quote Builder
- [Auth Registration](mem://auth/registration-process) — ระบบสมัครสมาชิกและ error handling ภาษาไทย
- [Brand Identity](mem://brand/corporate-identity) — ชื่อบริษัท ที่อยู่ โลโก้
- [RBAC System](mem://infrastructure/auth/rbac-system) — ระบบสิทธิ์ user_roles, admin_permissions
- [Line Contact](mem://features/line-contact-policy) — LINE @entgroup ใช้ Modal QR Code
- [Deployment Rules](mem://project/deployment-rules) — กฎ 5 ข้อป้องกัน regression + ข้อความยืนยันก่อนแก้ทุกครั้ง
- [Document Management Template](mem://features/document-management-template) — Template 5 ฟีเจอร์ (Duplicate/Download/Share/Audit/Activity) สำหรับขยายไปยังเอกสารทุกประเภทใน Sales Flow ใช้ quote_share_* เป็นต้นแบบ
