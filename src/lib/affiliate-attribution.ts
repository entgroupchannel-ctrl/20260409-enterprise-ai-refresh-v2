// Client-side helpers สำหรับ attribution Affiliate
// เก็บ cookie 90 วัน เพื่อให้ฟอร์มต่างๆ (RFQ, ติดต่อเรา, สมัครสมาชิก) อ่านได้
import { supabase } from "@/integrations/supabase/client";

const COOKIE_NAME = "ent_aff";
const COOKIE_DAYS = 90;

export interface AffiliateAttribution {
  code: string;
  click_id?: string;
  affiliate_id?: string;
  ts: number;
}

export function setAffiliateCookie(data: AffiliateAttribution) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  const value = encodeURIComponent(JSON.stringify(data));
  document.cookie = `${COOKIE_NAME}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function getAffiliateAttribution(): AffiliateAttribution | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=")[1])) as AffiliateAttribution;
  } catch {
    return null;
  }
}

export function clearAffiliateCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

/**
 * Returns affiliate fields to merge into a `quote_requests` or `contact_submissions` insert.
 * Returns empty object if no attribution cookie present.
 */
export function getAttributionFields(): {
  affiliate_id?: string;
  affiliate_code?: string;
  attribution_source?: string;
} {
  const attr = getAffiliateAttribution();
  if (!attr || !attr.affiliate_id) return {};
  return {
    affiliate_id: attr.affiliate_id,
    affiliate_code: attr.code,
    attribution_source: "affiliate_link",
  };
}

/**
 * Creates an `affiliate_leads` row after a successful submission.
 * Best-effort — never throws (errors logged only).
 */
export async function createAffiliateLead(params: {
  source_type: "quote_request" | "contact_submission";
  source_id: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_company?: string | null;
  deal_value?: number | null;
}): Promise<void> {
  const attr = getAffiliateAttribution();
  if (!attr || !attr.affiliate_id || !attr.code) return;
  try {
    await (supabase.from as any)("affiliate_leads").insert({
      affiliate_id: attr.affiliate_id,
      affiliate_code: attr.code,
      click_id: attr.click_id || null,
      source_type: params.source_type,
      source_id: params.source_id,
      customer_name: params.customer_name || null,
      customer_email: params.customer_email || null,
      customer_company: params.customer_company || null,
      deal_value: params.deal_value || null,
      status: "new",
    });
  } catch (e) {
    console.warn("createAffiliateLead failed", e);
  }
}
