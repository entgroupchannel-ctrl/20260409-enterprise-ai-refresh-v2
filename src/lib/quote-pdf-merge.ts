// src/lib/quote-pdf-merge.ts
// Defensive merge between a quote_requests row and a quote_revisions row
// for PDF rendering only. The PDF template reads from `revision`, but some
// older revisions were stored before pricing was finalized and therefore
// contain unit_price=0 / line_total=0 / subtotal=0 / grand_total=0 while
// the canonical pricing now lives on the quote row.
//
// This helper returns a revision-shaped object where any missing/zero
// numeric/array fields fall back to the corresponding field on the quote.
// It does NOT touch the database and does NOT change any save flow — it
// only affects what the PDF template sees at render time.

const isMissingNum = (v: any) => v === null || v === undefined || Number(v) === 0;
const isEmptyArr = (v: any) => !Array.isArray(v) || v.length === 0;

interface AnyObj { [k: string]: any }

/** Merge a single product line, preferring non-zero values from the quote-side line. */
function mergeProductLine(revLine: AnyObj, qLine?: AnyObj): AnyObj {
  if (!qLine) return revLine;
  const merged: AnyObj = { ...qLine, ...revLine };
  // Numeric fields: if revision has 0/missing, use quote value
  for (const k of ['unit_price', 'line_total', 'discount_amount', 'discount_percent', 'qty', 'quantity']) {
    if (isMissingNum(revLine?.[k]) && !isMissingNum(qLine?.[k])) {
      merged[k] = qLine[k];
    }
  }
  // Text fields: prefer revision if present, else quote
  for (const k of ['name', 'model', 'notes']) {
    if (!revLine?.[k] && qLine?.[k]) merged[k] = qLine[k];
  }
  // Description / specs: prefer the LONGER one (revision often stores only the headline,
  // while the quote row keeps the full spec sheet). This ensures full specs reach the PDF.
  for (const k of ['description', 'specs']) {
    const rv = (revLine?.[k] ?? '').toString();
    const qv = (qLine?.[k] ?? '').toString();
    merged[k] = qv.length > rv.length ? qv : rv;
  }
  return merged;
}

/**
 * Returns a revision-shaped object that the QuotePDFTemplate can safely render.
 * Fallback rules:
 *   - revision.products: if empty, use quote.products
 *   - per-line numeric fields: if 0/missing, use the matching quote line (by index, then by model)
 *   - subtotal / vat_amount / vat_percent / grand_total: if 0/missing, use quote's
 *   - discount_amount / discount_percent: same
 *   - valid_until / customer_message: keep revision if set, else quote
 */
export function mergeRevisionWithQuote(revision: AnyObj | null | undefined, quote: AnyObj | null | undefined): any {
  const rev: AnyObj = revision ? { ...revision } : {};
  const q: AnyObj = quote || {};

  const qProducts: AnyObj[] = Array.isArray(q.products) ? q.products : [];
  const revProducts: AnyObj[] = Array.isArray(rev.products) ? rev.products : [];

  // Build merged product list
  let mergedProducts: AnyObj[];
  if (isEmptyArr(revProducts)) {
    mergedProducts = qProducts;
  } else {
    mergedProducts = revProducts.map((rp, idx) => {
      // Try index match first, then model match
      const qp = qProducts[idx]
        || qProducts.find((x) => x?.model && rp?.model && x.model === rp.model);
      return mergeProductLine(rp, qp);
    });
  }

  // Free items: keep revision if non-empty, else quote
  const mergedFreeItems = !isEmptyArr(rev.free_items)
    ? rev.free_items
    : (Array.isArray(q.free_items) ? q.free_items : []);

  // Numeric totals fallback
  const num = (rk: string, qk = rk) => (isMissingNum(rev[rk]) && !isMissingNum(q[qk]) ? q[qk] : rev[rk]);

  return {
    ...rev,
    products: mergedProducts,
    free_items: mergedFreeItems,
    subtotal: num('subtotal'),
    discount_amount: num('discount_amount'),
    discount_percent: num('discount_percent'),
    vat_percent: rev.vat_percent ?? q.vat_percent ?? 7,
    vat_amount: num('vat_amount'),
    grand_total: num('grand_total'),
    valid_until: rev.valid_until ?? q.valid_until,
    customer_message: rev.customer_message ?? null,
  };
}

/* ---------------------------------------------------------------------- */
/* Consistency check                                                       */
/* ---------------------------------------------------------------------- */

export interface ConsistencyMismatch {
  field: string;          // 'unit_price' | 'subtotal' | 'grand_total' | 'line_total[idx]' | ...
  label: string;          // Human-readable Thai label
  quoteValue: number;
  revisionValue: number;
  diff: number;
}

export interface ConsistencyResult {
  ok: boolean;
  mismatches: ConsistencyMismatch[];
}

const eq = (a: any, b: any, tol = 0.01) => Math.abs(Number(a || 0) - Number(b || 0)) < tol;

/**
 * Compare key pricing fields between the canonical quote_requests row and the
 * quote_revisions row that the PDF will render from. Returns mismatches so the
 * UI can surface a warning before the user generates / sends the PDF.
 *
 * Read-only — never mutates either side.
 */
export function checkQuoteRevisionConsistency(
  revision: AnyObj | null | undefined,
  quote: AnyObj | null | undefined
): ConsistencyResult {
  const mismatches: ConsistencyMismatch[] = [];
  if (!revision || !quote) return { ok: true, mismatches };

  const push = (field: string, label: string, qv: any, rv: any) => {
    const q = Number(qv || 0);
    const r = Number(rv || 0);
    if (!eq(q, r)) {
      mismatches.push({ field, label, quoteValue: q, revisionValue: r, diff: q - r });
    }
  };

  // Top-level totals
  push('subtotal', 'ยอดรวม (Subtotal)', quote.subtotal, revision.subtotal);
  push('vat_amount', 'VAT', quote.vat_amount, revision.vat_amount);
  push('grand_total', 'รวมสุทธิ (Grand Total)', quote.grand_total, revision.grand_total);
  push('discount_amount', 'ส่วนลด', quote.discount_amount, revision.discount_amount);

  // Per-line check (matched by index, fallback by model)
  const qProducts: AnyObj[] = Array.isArray(quote.products) ? quote.products : [];
  const rProducts: AnyObj[] = Array.isArray(revision.products) ? revision.products : [];
  const max = Math.max(qProducts.length, rProducts.length);
  for (let i = 0; i < max; i++) {
    const rp = rProducts[i];
    const qp = qProducts[i] || qProducts.find((x) => x?.model && rp?.model && x.model === rp.model);
    if (!rp || !qp) continue;
    const tag = `[${i + 1}] ${rp.model || qp.model || ''}`;
    push(`unit_price#${i}`, `${tag} ราคา/หน่วย`, qp.unit_price, rp.unit_price);
    push(`line_total#${i}`, `${tag} รวม`, qp.line_total, rp.line_total);
    push(`qty#${i}`, `${tag} จำนวน`, qp.qty ?? qp.quantity, rp.qty ?? rp.quantity);
  }

  return { ok: mismatches.length === 0, mismatches };
}
