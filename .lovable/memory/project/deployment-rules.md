---
name: Deployment Rules
description: กฎ deploy — ทำตามที่ผู้ใช้แจ้งเท่านั้น ไม่ refactor/rename/แตะไฟล์อื่น
type: preference
---

ทำตามที่ผู้ใช้แจ้งใน prompt เท่านั้น
- ห้ามแตะไฟล์นอกเหนือจากที่ระบุ
- ห้าม refactor, clean up, rename variable/function/type
- ห้าม reorder หรือลบ imports ที่คิดว่า "ไม่ใช้"
- ไม่ต้องพิมพ์ข้อความยืนยัน "ฉันจะแก้เฉพาะ..." ก่อนทุกครั้ง — แค่ทำตามขอบเขตที่แจ้ง
