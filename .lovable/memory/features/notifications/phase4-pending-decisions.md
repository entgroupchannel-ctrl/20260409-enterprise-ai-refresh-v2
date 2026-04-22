---
name: Phase 4 Business Decisions — Notification Migration
description: รายการ call sites ที่ต้อง business decision ก่อน migrate ไป dispatcher (เลื่อนจาก Phase 2)
type: feature
---

# Phase 4 Pending Business Decisions

## A-4: QuoteStatusDropdown semantic redesign

**File:** `src/components/admin/QuoteStatusDropdown.tsx`

**Current state:**
- 1 generic `createNotification({ type: 'quote_status_change' })` call ครอบคลุม pending/approved/rejected
- Guest branch ใช้ `send-transactional-email` (`quote-sent-guest-invite`) โดยตรง

**Gaps:**
1. Dropdown statuses (`pending` / `approved` / `rejected`) **ไม่ตรง** registry events (`quote.sent` / `quote.accepted` / `quote.rejected` / `quote.expired` / `quote.revised`)
2. `quote.rejected` ใน registry: `notify_customer_in_app=false`, `notify_customer_email=false` — แต่ code ปัจจุบันแจ้งลูกค้า → migrate ตรง = **regression**
3. ไม่มี `quote.pending` หรือ `quote.approved` ใน registry

**Stakeholder questions (rungarun / business team):**
1. ความหมายของ "อนุมัติ" ใน dropdown = internal approval หรือ send to customer?
2. ใบเสนอราคาที่ rejected ควรแจ้งลูกค้าหรือไม่? (registry บอกไม่, code บอกใช่)
3. ต้องสร้าง `quote.pending` event หรือข้าม notification ไป?

**After decision:** migrate ตาม A-3 pattern (single `dispatchNotification` per branch, preserve 5 fields, idempotencyKey)

**Decision owner:** rungarun / business team
**Status:** ⏸️ DEFERRED — รอ business input

---

## P6-R1: receipt.cancelled — no clean replacement

**Files:** `src/pages/admin/AdminReceiptDetail.tsx`, `src/pages/admin/AdminTrash.tsx`

**Current state:**
- 2 callers ใช้ `dispatchNotification({ eventKey: 'receipt.cancelled' })`
- Registry row `receipt.cancelled` **inactive** + ทุก channel flag = false
- ผล: ลูกค้าไม่ได้รับ notification เมื่อใบเสร็จถูกยกเลิก (silent no-op — latent bug)

**Why deferred (Phase 6 audit, 2026-04-22):**
- ไม่มี active event ที่ semantic ตรง:
  - `receipt.issued` = "ออกแล้ว" (ตรงข้าม cancelled)
  - `receipt.created` = "สร้างใหม่" (ตรงข้าม cancelled)
  - `tax_invoice.cancelled` = entity ผิด
- Activate registry row `receipt.cancelled` = ต้อง business approve channel flags

**Stakeholder questions:**
1. ลูกค้าต้องรู้เมื่อใบเสร็จถูกยกเลิกหรือไม่?
2. ถ้าใช่ — ผ่านช่องทางไหน (in-app เท่านั้น / email ด้วย)?
3. ถ้าใช่ — Activate `receipt.cancelled` row พร้อมตั้งค่า `notify_customer_in_app=true` (+ optional email)?

**After decision:** activate registry flags (no code change needed in callers — they already use correct eventKey)

**Decision owner:** business team
**Status:** ⏸️ DEFERRED — รอ business input

---

## P6-Cleanup: tax_invoice.created row safe to DELETE

**Status:** Ready for next maintenance window (zero risk)

- Phase 6 D-1 (2026-04-22) migrated `CreateTaxInvoiceFromInvoiceDialog.tsx` → `tax_invoice.issued`
- After migration: 0 callers, 0 dispatch_log uses in last 30 days
- Registry row `tax_invoice.created` (inactive) is now orphan — symmetric to credit_note.created cleanup

**Suggested migration (next session):**
```sql
DELETE FROM public.notification_events
 WHERE event_key = 'tax_invoice.created' AND is_active = false;
```

Also recommend cleaning dead entries in `EVENT_EMAIL_STRATEGY` map of
`supabase/functions/dispatch-notification/index.ts` for keys:
`credit_note.created`, `quote.cancelled`, `tax_invoice.created` (after row delete).

---

## P6-Smoke leftovers (manual cleanup needed next session)

Smoke test `smoke-p6-fix1` left 1 row in `notification_dispatch_log`
(no in-app notification rows, no email_send_log entries to clean).
REST DELETE returned 401 (service-role key mismatch in sandbox).

**Suggested cleanup migration (next session):**
```sql
DELETE FROM public.notification_dispatch_log WHERE idempotency_key LIKE 'smoke-p6-%';
DELETE FROM public.notifications WHERE title LIKE 'SMOKE-P6-%';
DELETE FROM public.email_send_log
 WHERE created_at > now() - interval '24 hours'
   AND subject ILIKE '%SMOKE-P6-%';
```
