// Client-side helpers สำหรับ attribution Affiliate
// เก็บ cookie 90 วัน เพื่อให้ฟอร์มต่างๆ (RFQ, ติดต่อเรา, สมัครสมาชิก) อ่านได้

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
