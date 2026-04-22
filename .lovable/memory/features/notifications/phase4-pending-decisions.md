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
