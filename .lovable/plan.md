

## ปัญหาปัจจุบัน
- `WelcomeDialog` mount ใน `App.tsx` แล้ว — ไม่ได้พัง
- เหตุที่ทดสอบไม่เห็น: `localStorage` มี key `ent_welcome_dialog_v2:/` แล้ว → bypass ถาวร
- เงื่อนไขปัจจุบันคือ "ครั้งแรกต่อ path **ตลอดกาล**" ซึ่งเข้มไป

## เงื่อนไขใหม่ที่แนะนำ (สมดุล UX + ทดสอบได้)

**1. Cooldown แทน "ครั้งเดียวตลอดกาล"**
- เห็นแล้วบนหน้าเดียวกัน → ไม่แสดงอีก **7 วัน** (ไม่ใช่ตลอดกาล)
- เห็นแล้วบนเว็บ (global) → ไม่แสดงข้ามหน้าอีก **30 นาที** (กัน spam ตอนเปิดหลายแท็บ/หลายหน้าในเซสชันเดียว)
- ผลลัพธ์: ลูกค้าใหม่เห็น 1 ครั้งต่อหน้าใน 7 วัน, กลับมาใน 8 วันได้เห็นอีก (เผื่อยังไม่สมัคร)

**2. โหมดทดสอบ (Dev/QA bypass)**
- ถ้า URL มี query `?welcome=1` → force แสดงทันที (ข้าม localStorage) — สำหรับ QA/admin ทดสอบ
- ถ้า URL มี query `?welcome=reset` → ล้าง localStorage keys ทั้งหมดของ welcome dialog แล้วแสดงใหม่

**3. ปรับ delay ให้แสดงเร็วขึ้นสำหรับ first-time**
- เพิ่ม delay จาก 600ms → **1500ms** เพื่อให้หน้าโหลดเสร็จ ลูกค้าตั้งสติได้ก่อน
- ไม่แสดงหากผู้ใช้ scroll ลงเกิน 200px ก่อน timer ทำงาน (= ลูกค้ากำลังอ่านอยู่ อย่ารบกวน)

**4. คงพฤติกรรมเดิมที่ดีอยู่แล้ว**
- Logged-in users → ไม่แสดงเลย
- Internal routes (`/admin`, `/my-*`, ฯลฯ) → ไม่แสดง
- Hover เพื่อ pause + extend เวลา (ดีอยู่แล้ว 15s)
- Circular countdown SVG (ดีอยู่แล้ว)

## สรุปการแก้ไข

แก้ไฟล์เดียว: `src/components/WelcomeDialog.tsx`

```text
ก่อน:                              หลัง:
seenPath มี → return              seenPath < 7 วัน → return
                                  seenGlobal < 30 นาที → return
                                  ?welcome=1 → force แสดง
                                  ?welcome=reset → ล้าง + แสดง
delay 600ms                       delay 1500ms + ตรวจ scrollY < 200
```

## วิธีทดสอบหลังแก้
1. เปิด `https://www.entgroup.co.th/?welcome=reset` → เห็น dialog ใหม่ทันที
2. เปิด `/?welcome=1` → force แสดงทุกครั้ง (ไม่ผูก localStorage)
3. รอ 7 วันหรือล้าง localStorage → กลับมาเห็นปกติ

