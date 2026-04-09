/* ─── Professional Quote Print v2 — PRINT_QUOTE_DESIGN_SPEC_V2 ─── */

/* ── i18n ── */
type Lang = 'th' | 'en';

export type DocumentType = 'quote' | 'sales_order' | 'billing' | 'invoice' | 'delivery' | 'receipt_full' | 'receipt_simple';

const DOC_TITLES: Record<Lang, Record<DocumentType, string>> = {
  th: {
    quote: 'ใบเสนอราคา',
    sales_order: 'ใบสั่งขาย',
    billing: 'ใบวางบิล',
    invoice: 'ใบกำกับภาษี',
    delivery: 'ใบส่งของ',
    receipt_full: 'ใบเสร็จรับเงิน/ใบกำกับภาษี',
    receipt_simple: 'ใบเสร็จรับเงิน',
  },
  en: {
    quote: 'Quotation',
    sales_order: 'Sales Order',
    billing: 'Billing Note',
    invoice: 'Tax Invoice',
    delivery: 'Delivery Note',
    receipt_full: 'Receipt / Tax Invoice',
    receipt_simple: 'Receipt',
  },
};

const i18n: Record<Lang, Record<string, string>> = {
  th: {
    title: 'ใบเสนอราคา',
    quote_number: 'เลขที่',
    date: 'วันที่',
    valid_until: 'ยืนราคาถึง',
    salesperson: 'ผู้ขาย',
    job_name: 'ชื่องาน',
    customer: 'ลูกค้า',
    contact: 'ผู้ติดต่อ',
    email: 'อีเมล',
    phone: 'โทร',
    tax_id: 'เลขประจำตัวผู้เสียภาษี',
    payment_date_label: 'วันที่ชำระเงิน',
    payment_method_label: 'วิธีชำระเงิน',
    amount_paid: 'จำนวนเงินที่รับ',
    receiver_signature: 'ผู้รับเงิน',
    receiver_position: 'ตำแหน่ง',
    signed_date: 'วันที่',
    item_no: '#',
    description: 'รายละเอียด',
    quantity: 'จำนวน',
    unit_price: 'ราคาต่อหน่วย',
    discount: 'ส่วนลด',
    amount: 'มูลค่า',
    subtotal: 'รวมเป็นเงิน',
    discount_total: 'ส่วนลด',
    after_discount: 'จำนวนเงินหลังหักส่วนลด',
    vat: 'ภาษีมูลค่าเพิ่ม',
    grand_total: 'จำนวนเงินรวมทั้งสิ้น',
    wht: 'หัก ณ ที่จ่าย',
    net_payable: 'ยอดชำระ',
    currency: 'บาท',
    notes: 'หมายเหตุ',
    payment_method: 'วิธีการชำระเงิน',
    payment_note: 'ลูกค้าเป็นผู้รับผิดชอบค่าใช้จ่าย ค่าธรรมเนียมในการโอนเงิน',
    terms: 'เงื่อนไข',
    purchaser: 'ผู้สั่งซื้อสินค้า',
    authorized: 'ผู้อนุมัติ',
    company_seal: 'ตราประทับ',
    page_of: 'หน้าที่',
    by_name: 'ในนาม',
    date_label: 'วันที่',
    payslip: 'Pay in slip มายัง',
    savings: 'ออมทรัพย์',
  },
  en: {
    title: 'Quotation',
    quote_number: 'Quote No.',
    date: 'Date',
    valid_until: 'Valid Until',
    salesperson: 'Salesperson',
    job_name: 'Job Name',
    customer: 'Customer',
    contact: 'Contact',
    email: 'Email',
    phone: 'Tel',
    tax_id: 'Tax ID',
    payment_date_label: 'Payment Date',
    payment_method_label: 'Payment Method',
    amount_paid: 'Amount Paid',
    receiver_signature: 'Receiver',
    receiver_position: 'Position',
    signed_date: 'Date',
    item_no: '#',
    description: 'Description',
    quantity: 'Qty',
    unit_price: 'Unit Price',
    discount: 'Discount',
    amount: 'Amount',
    subtotal: 'Subtotal',
    discount_total: 'Discount',
    after_discount: 'After Discount',
    vat: 'VAT',
    grand_total: 'Grand Total',
    wht: 'Withholding Tax',
    net_payable: 'Net Payable',
    currency: 'THB',
    notes: 'Notes',
    payment_method: 'Payment Method',
    payment_note: 'Customer is responsible for all bank transfer fees.',
    terms: 'Terms & Conditions',
    purchaser: 'Purchaser',
    authorized: 'Authorized',
    company_seal: 'Company Seal',
    page_of: 'Page',
    by_name: 'By',
    date_label: 'Date',
    payslip: 'Pay in slip to',
    savings: 'Savings',
  },
};

const SPEC_LABELS: Record<string, string> = {
  cpu: "CPU", ram: "RAM", com: "COM", usb: "USB", lan: "LAN", display: "จอ",
  gpio: "GPIO", sim: "SIM", gen: "Gen", fanless: "Fanless", ip_rating: "IP",
  os: "OS", power: "Power", dimension: "ขนาด", weight: "น้ำหนัก", certification: "Cert",
};

/* ── Interfaces ── */
interface PrintQuote {
  quote_number: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  details: string | null;
  company_address?: string | null;
  tax_id?: string | null;
  branch?: string | null;
  payment_date?: string | null;
  payment_method?: string | null;
  amount_paid?: number | null;
  receiver_name?: string | null;
  receiver_position?: string | null;
}

interface PrintLineItem {
  model: string;
  qty: number;
  unit_price: number;
  discount_percent: number;
  line_total: number;
  admin_notes: string | null;
  description?: string | null;
  _name?: string;
  _desc?: string;
  _specs?: Record<string, string>;
  _unit?: string;
  custom_specs?: Record<string, string>;
}

interface PrintTerms {
  discount_amount: number;
  valid_until: string;
  payment_terms: string;
  delivery_terms: string;
  include_vat?: boolean;
  vat_percent?: number;
  include_withholding_tax?: boolean;
  withholding_tax_percent?: number;
}

interface CompanyInfo {
  company_name_th?: string;
  company_name_en?: string;
  branch?: string;
  address_line1?: string;
  address_line2?: string;
  district?: string;
  province?: string;
  tax_id?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  website?: string;
  email?: string;
  logo_url?: string;
  bank_accounts?: { bank: string; branch: string; type: string; number: string }[];
  quote_terms?: string;
  vat_percent?: number;
  withholding_tax_percent?: number;
}

const DEFAULT_COMPANY: CompanyInfo = {
  company_name_th: "บริษัท อี เอ็น ที กรุ๊ป จำกัด",
  company_name_en: "ENT Group Co., Ltd.",
  branch: "สำนักงานใหญ่",
  address_line1: "เลขที่ 70/5",
  address_line2: "หมู่บ้าน เมทโทร บิซทาวน์ แจ้งวัฒนะ 2 หมู่ 4",
  district: "ตำบลคลองพระอุดม อำเภอปากเกร็ด",
  province: "จังหวัดนนทบุรี 11120",
  tax_id: "0135558013167",
  phone: "02-045-6104",
  mobile: "095-7391053, 082-2497922",
  fax: "02-045-6105",
  website: "www.entgroup.co.th",
  email: "sales@entgroup.co.th",
  logo_url: "/images/ent-logo.png",
  bank_accounts: [
    { bank: "ธนาคารกสิกรไทย", branch: "สาขา ปทุมธานี", type: "ออมทรัพย์", number: "841-2-05851-9" },
    { bank: "ธนาคารไทยพาณิชย์", branch: "สาขาบางบัวทอง (ปทุมธานี)", type: "ออมทรัพย์", number: "406-817747-1" },
  ],
  quote_terms: `1.) บริษัทฯ สงวนสิทธิ์ในการเรียกค่าปรับ 30% สำหรับการยกเลิก PO หรือการสั่งซื้อในทุกกรณี
2.) กรณีสินค้าพร้อมส่ง ลูกค้าต้องชำระค่าสินค้าและพร้อมรับสินค้าภายใน 15 วัน มิฉะนั้นถือว่าลูกค้าไม่พร้อมรับสินค้า ขอสงวนสิทธิ์ปล่อยสินค้าออกจากสต็อกทันที โดยไม่ต้องแจ้งให้ทราบ
3.) กรณีลูกค้าไม่พร้อมรับสินค้า บริษัทฯ ขอสงวนสิทธิ์ในการเรียกเก็บเงินมัดจำ 30% โดยลูกค้าไม่สามารถเรียกร้องใดๆ`,
  vat_percent: 7,
  withholding_tax_percent: 3,
};

/* ── Thai number text ── */
function numberToThaiText(num: number): string {
  const digits = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const units = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
  if (num === 0) return "ศูนย์บาทถ้วน";
  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  let result = "";
  const str = intPart.toString();
  const len = str.length;
  for (let i = 0; i < len; i++) {
    const d = parseInt(str[i]);
    const pos = len - i - 1;
    if (d === 0) continue;
    if (pos === 1 && d === 1) { result += "สิบ"; continue; }
    if (pos === 1 && d === 2) { result += "ยี่สิบ"; continue; }
    if (pos === 0 && d === 1 && len > 1) { result += "เอ็ด"; continue; }
    result += digits[d] + units[pos];
  }
  result += "บาท";
  if (decPart > 0) {
    const d1 = Math.floor(decPart / 10);
    const d2 = decPart % 10;
    if (d1 === 1) result += "สิบ";
    else if (d1 === 2) result += "ยี่สิบ";
    else if (d1 > 0) result += digits[d1] + "สิบ";
    if (d2 === 1 && d1 > 0) result += "เอ็ด";
    else if (d2 > 0) result += digits[d2];
    result += "สตางค์";
  } else {
    result += "ถ้วน";
  }
  return result;
}

/* ── Number to English text (simple) ── */
function numberToEnglishText(num: number): string {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function convert(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    return convert(Math.floor(n / 1000000)) + ' million' + (n % 1000000 ? ' ' + convert(n % 1000000) : '');
  }

  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  let result = (convert(intPart) || 'zero') + ' baht';
  if (decPart > 0) {
    result += ' and ' + (convert(decPart) || 'zero') + ' satang';
  } else {
    result += ' only';
  }
  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/* ── Clean description ── */
function cleanDescription(desc: string): string {
  if (!desc) return "";
  let cleaned = desc;
  cleaned = cleaned.replace(/\|?\s*ราคา\s*[฿$]?[\d,]+\s*-\s*[฿$]?[\d,]+\s*\(\d+\s*configs?\)/gi, '');
  cleaned = cleaned.replace(/\s*\|\s*ราคา\s*[฿$]?[\d,]+\s*-\s*[฿$]?[\d,]+\s*\(.*?\)/gi, '');
  cleaned = cleaned.replace(/[฿$][\d,]+\s*-\s*[฿$][\d,]+\s*\(\d+\s*configs?\)/gi, '');
  cleaned = cleaned.replace(/\|\s*$/, '');
  return cleaned.trim();
}

/* ── Format specs ── */
function formatSpecLines(specs: Record<string, string>): string {
  return Object.entries(specs)
    .filter(([, v]) => v && v !== "No" && v !== "-")
    .map(([k, v]) => {
      const label = SPEC_LABELS[k] || k;
      const val = v === "Yes" ? "✓" : v;
      return `<div class="spec-line">${label}: ${val}</div>`;
    })
    .join("");
}

/* ═══════════════════════════════════════════ */
/*  MAIN EXPORT                                */
/* ═══════════════════════════════════════════ */
export const printQuote = (
  q: PrintQuote,
  items: PrintLineItem[],
  terms: PrintTerms,
  company?: CompanyInfo,
  saleName?: string,
  salePhone?: string,
  saleEmail?: string,
  lang: Lang = 'th',
  documentType: DocumentType = 'quote',
) => {
  const c = { ...DEFAULT_COMPANY, ...company };
  const t = i18n[lang];
  const fp = (n: number) => new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  const today = new Date().toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });
  const validDate = terms.valid_until
    ? new Date(terms.valid_until).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "—";

  /* ── Financial calc ── */
  const subtotal = items.reduce((s, i) => s + i.line_total, 0);
  const discountAmt = items.reduce((s, i) => {
    return s + (i.discount_percent > 0 ? Math.round(i.unit_price * i.qty * i.discount_percent / 100 * 100) / 100 : 0);
  }, 0);
  // terms.discount_amount = ส่วนลดท้ายบิล (เพิ่มเติมจาก discount per item)
  const extraDiscount = terms.discount_amount || 0;
  const totalDiscount = extraDiscount + discountAmt;
  // ฐาน VAT = subtotal (ที่หัก discount per-item แล้วใน line_total) - extraDiscount (ส่วนลดท้ายบิล)
  const afterDiscount = subtotal - extraDiscount;
  const beforeVat = afterDiscount;
  // บังคับ VAT สำหรับใบกำกับภาษีและใบวางบิล (กฎหมายสรรพากรไทย)
  const forceVat = documentType === 'invoice' || documentType === 'billing' || documentType === 'receipt_full';
  const includeVat = forceVat || terms.include_vat !== false;
  const vatPercent = includeVat ? (terms.vat_percent || c.vat_percent || 7) : 0;
  const vatAmount = vatPercent > 0 ? Math.round(beforeVat * vatPercent / 100 * 100) / 100 : 0;
  const grandTotal = beforeVat + vatAmount;
  const whtPercent = terms.include_withholding_tax ? (terms.withholding_tax_percent || c.withholding_tax_percent || 3) : 0;
  const whtAmount = whtPercent > 0 ? Math.round(beforeVat * whtPercent / 100 * 100) / 100 : 0;
  const netPayable = grandTotal - whtAmount;
  const finalAmount = whtPercent > 0 ? netPayable : grandTotal;
  const amountText = lang === 'th' ? numberToThaiText(finalAmount) : numberToEnglishText(finalAmount);

  /* ── Logo URL ── */
  const logoUrl = c.logo_url || '/images/ent-logo.png';
  const fullLogoUrl = logoUrl.startsWith('http') ? logoUrl : `${window.location.origin}${logoUrl}`;

  /* ── Item rows ── */
  const itemRows = items.map((item, i) => {
    const specs = item._specs || item.custom_specs || {};
    // Prefer admin's edited description, fall back to catalog description
    const rawDesc = item.description || item._desc || item._name || "";
    const desc = cleanDescription(rawDesc);
    const specHtml = formatSpecLines(specs);
    const lineDiscount = item.discount_percent > 0 ? Math.round(item.unit_price * item.qty * item.discount_percent / 100 * 100) / 100 : 0;

    return `<tr>
      <td class="c">${i + 1}</td>
      <td class="desc-cell">
        <div class="product-name">${item.model}</div>
        ${desc ? `<div class="product-desc">${desc}</div>` : ""}
        ${specHtml ? `<div class="spec-block">${specHtml}</div>` : ""}
      </td>
      <td class="c">${item.qty}</td>
      <td class="r">${fp(item.unit_price)}</td>
      <td class="r">${lineDiscount > 0 ? fp(lineDiscount) : "-"}</td>
      <td class="r">${fp(item.line_total)}</td>
    </tr>`;
  }).join("");

  /* ── Company name by lang ── */
  const coName = lang === 'th' ? c.company_name_th : c.company_name_en;
  const coNameFull = lang === 'th' ? c.company_name_th : c.company_name_en;

  const html = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8">
<title>${DOC_TITLES[lang][documentType]} ${q.quote_number || ""}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=block">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Sarabun','THSarabunNew','Helvetica','Arial',sans-serif;font-size:10pt;color:#333;padding:0;margin:0}

/* ── A4 Page Setup ── */
@media print{
  body{padding:0}
  @page{size:A4 portrait;margin:15mm 12mm 15mm 12mm}
  .page-break{page-break-before:always}
  .no-break{page-break-inside:avoid}
  .print-tip{display:none !important}
}
@media screen{
  body{max-width:210mm;margin:0 auto;padding:20mm 15mm;background:#f0f0f0}
  .page-container{background:#fff;padding:20mm 15mm;min-height:297mm;box-shadow:0 2px 20px rgba(0,0,0,0.15);margin-bottom:10mm}
  .print-tip{position:fixed;top:10px;left:50%;transform:translateX(-50%);background:#fff8e1;border:1px solid #ffc107;border-radius:8px;padding:10px 16px;font-size:11pt;color:#5d4037;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;max-width:90%;text-align:center;font-family:'Sarabun',sans-serif}
  .print-tip strong{color:#e65100}
  .print-tip button{margin-left:12px;padding:4px 12px;background:#e87722;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:10pt;font-family:inherit}
}

/* ── Colors ── */
:root{
  --primary:#13AE8F;
  --primary-dark:#0F8971;
  --text-dark:#333333;
  --text-light:#666666;
  --border:#E0E0E0;
  --bg-light:#F0FAF7;
  --table-header:#F5F5F5;
}

/* ── Header ── */
.header{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px;padding-bottom:12px;border-bottom:3px solid var(--primary)}
.header-left{font-size:9pt;line-height:1.8;color:var(--text-light)}
.header-left .logo{height:55px;margin-bottom:6px;display:block}
.header-left .co-name{font-size:14pt;font-weight:700;color:var(--text-dark);display:block;margin-bottom:1px}
.header-left .co-en{font-size:9pt;color:var(--text-light)}
.header-left .tax-line{color:#888;font-size:9pt}
.header-right{text-align:right}
.header-right .title{font-size:24pt;font-weight:700;color:var(--primary);margin-bottom:8px}
.header-right .info-box{background:var(--bg-light);border:1.5px solid var(--border);border-radius:6px;padding:10px 14px;text-align:left}
.header-right .info-row{display:flex;justify-content:space-between;padding:2px 0;font-size:10pt}
.header-right .info-row .lb{color:var(--text-light);font-weight:600;min-width:90px}
.header-right .info-row .vl{color:var(--text-dark);text-align:right;flex:1}

/* ── Compact Header (page 2+) ── */
.header-compact{display:flex;align-items:center;justify-content:space-between;padding:6px 0 10px;margin-bottom:10px;border-bottom:2px solid var(--primary)}
.header-compact .logo-sm{height:30px}
.header-compact .compact-title{font-size:14pt;font-weight:700;color:var(--primary)}
.header-compact .compact-qn{font-size:10pt;color:var(--text-light)}

/* ── Customer Info ── */
.customer-box{border:1.5px solid var(--border);border-radius:6px;padding:12px 16px;margin-bottom:14px;background:var(--bg-light)}
.customer-box .section-label{font-size:10pt;font-weight:700;color:var(--primary);letter-spacing:0.5px;margin-bottom:4px}
.customer-box p{font-size:10pt;line-height:1.7;color:#333}
.customer-box .cust-name{font-weight:700;font-size:11pt;color:var(--text-dark)}

/* ── Product Table ── */
table.items{width:100%;border-collapse:collapse;margin-bottom:0}
table.items th{background:var(--text-dark);color:#fff;font-size:10pt;font-weight:600;padding:8px 6px;text-align:left;white-space:nowrap}
table.items th.c{text-align:center}
table.items th.r{text-align:right}
table.items td{padding:8px 6px;border-bottom:1px solid #e5e7eb;font-size:10pt;vertical-align:top}
table.items td.c{text-align:center}
table.items td.r{text-align:right;white-space:nowrap}
table.items tr:nth-child(even){background:#fafbfc}
.product-name{font-weight:700;font-size:11pt;color:var(--text-dark)}
.product-desc{font-size:9pt;color:#555;margin-top:3px;line-height:1.6}
.spec-block{margin-top:4px}
.spec-line{font-size:8.5pt;color:#666;line-height:1.7;padding-left:10px}
.admin-note{font-size:9pt;color:var(--primary);margin-top:3px;font-style:italic}
.desc-cell{max-width:360px}

/* ── Totals ── */
.totals-section{margin-top:14px;display:flex;justify-content:flex-end}
.totals{width:340px}
.totals .row{display:flex;justify-content:space-between;padding:4px 0;font-size:10pt;color:#444}
.totals .row.sub{border-top:1px solid var(--border);padding-top:6px;margin-top:2px}
.totals .row.vat{color:var(--primary);font-weight:600}
.totals .row.grand{font-weight:700;font-size:14pt;color:var(--text-dark);border-top:3px double var(--primary);padding-top:8px;margin-top:6px}
.totals .row.wht{color:#dc2626;font-size:10pt}
.totals .row.net{font-weight:700;font-size:12pt;color:var(--text-dark);border-top:2px solid var(--text-dark);padding-top:6px;margin-top:4px}
.thai-text{font-size:10pt;color:var(--text-light);margin:8px 0 16px;text-align:right;font-style:italic}

/* ── Notes & Bank ── */
.notes-section{margin-top:18px;padding-top:12px;border-top:2px solid var(--border)}
.notes-section h3{font-size:12pt;font-weight:700;color:var(--primary);margin-bottom:8px}
.notes-section p,.notes-section div{font-size:10pt;line-height:1.7;color:#444}
.bank-block{margin-top:10px;padding:10px 14px;background:var(--bg-light);border:1px solid var(--border);border-radius:6px}
.bank-item{margin-bottom:8px}
.bank-item strong{color:var(--text-dark);font-size:10pt}
.bank-item div{font-size:9.5pt;color:var(--text-light)}
.payslip-note{font-size:10pt;color:var(--primary);font-weight:600;margin-top:8px}

/* ── Terms ── */
.terms-section{margin-top:16px;padding-top:12px;border-top:2px solid var(--border)}
.terms-section h3{font-size:12pt;font-weight:700;color:var(--primary);margin-bottom:8px}
.terms-section .terms-body{font-size:9pt;line-height:1.9;color:#555;white-space:pre-line}

/* ── Signatures ── */
.sigs{display:grid;grid-template-columns:1fr auto 1fr;gap:24px;margin:45px 10px 20px;align-items:end;page-break-inside:avoid}
.sig{text-align:center;padding-top:55px;border-top:1px solid #999}
.sig p{font-size:10pt;color:var(--text-light);margin-top:4px}
.sig .name{font-size:10pt;color:var(--text-dark);font-weight:600}
.sig-stamp{text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:flex-end}
.sig-stamp .stamp-placeholder{width:85px;height:85px;border:2px dashed var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9pt;color:#ccc;margin-bottom:8px}

/* ── Footer ── */
.page-footer{text-align:center;padding-top:12px;border-top:1px solid #e5e7eb;font-size:8pt;color:#999;margin-top:24px}
.page-footer .page-num{margin-top:4px;font-size:9pt;color:var(--text-light);text-align:right}
${documentType === 'delivery' ? `
table.items th:nth-child(4),
table.items th:nth-child(5),
table.items th:nth-child(6),
table.items td:nth-child(4),
table.items td:nth-child(5),
table.items td:nth-child(6) { display: none !important; }
` : ''}
${documentType === 'receipt_simple' ? `
table.items { display: none !important; }
` : ''}

/* ── Payment Info (Receipt) ── */
.payment-info-section{margin:16px 0;padding:14px 18px;border:1.5px solid var(--primary);border-radius:8px;background:var(--bg-light)}
.payment-info-grid{display:flex;flex-direction:column;gap:6px}
.payment-info-row{display:flex;justify-content:space-between;align-items:center;font-size:10pt}
.payment-lb{color:var(--text-light);font-weight:500}
.payment-vl{color:var(--text-dark);font-weight:600}
.payment-amount-row{margin-top:6px;padding-top:8px;border-top:1px dashed var(--border)}
.payment-amount{color:var(--primary);font-size:14pt;font-weight:700}

/* ── Signature Block (Receipt) ── */
.receipt-signature-section{margin-top:32px;display:flex;justify-content:flex-end}
.receipt-signature-box{width:240px;text-align:center}
.receipt-signature-line{border-top:1px solid var(--text-dark);margin-bottom:6px;height:1px}
.receipt-signature-label{font-size:10pt;color:var(--text-light);margin-bottom:2px}
.receipt-signature-name{font-size:11pt;color:var(--text-dark);font-weight:600;margin-bottom:2px}
.receipt-signature-position{font-size:9pt;color:var(--text-light);margin-bottom:6px}
.receipt-signature-date{font-size:9pt;color:var(--text-light);margin-top:8px}
</style></head><body>
<div class="print-tip">
  💡 <strong>เคล็ดลับ:</strong> เพื่อให้ใบเสนอราคาดูสวยที่สุด ใน print dialog กรุณาเลือก <strong>"More settings"</strong> แล้วปิด <strong>"Headers and footers"</strong>
  <button onclick="window.print()">พิมพ์อีกครั้ง</button>
</div>

<div class="page-container">

<!-- ═══ HEADER ═══ -->
<div class="header">
  <div class="header-left">
    <img src="${fullLogoUrl}" alt="ENT Group" class="logo" onerror="this.style.display='none'">
    <span class="co-name">${c.company_name_th}</span>
    <span class="co-en">${c.company_name_en} (${c.branch})</span><br>
    ${c.address_line1} ${c.address_line2}<br>
    ${c.district} ${c.province}<br>
    <span class="tax-line">${t.tax_id} ${c.tax_id}</span><br>
    ${t.phone}. ${c.phone} | แฟกซ์ ${c.fax}<br>
    เบอร์มือถือ ${c.mobile}<br>
    ${c.website}
  </div>
  <div class="header-right">
    <div class="title">${DOC_TITLES[lang][documentType]}</div>
    <div class="info-box">
      <div class="info-row"><span class="lb">${t.quote_number}:</span><span class="vl">${q.quote_number || "—"}</span></div>
      <div class="info-row"><span class="lb">${t.date}:</span><span class="vl">${today}</span></div>
      ${documentType === 'quote' ? `<div class="info-row"><span class="lb">${t.valid_until}:</span><span class="vl">${validDate}</span></div>` : ""}
      ${saleName || saleEmail ? `<div class="info-row"><span class="lb">${t.salesperson}:</span><span class="vl">${saleName || ""}</span></div>` : ""}
      ${saleEmail ? `<div class="info-row"><span class="lb"></span><span class="vl" style="font-size:9pt;color:var(--text-light)">${saleEmail}</span></div>` : ""}
      ${salePhone ? `<div class="info-row"><span class="lb"></span><span class="vl" style="font-size:9pt;color:var(--text-light)">${salePhone}</span></div>` : ""}
      <div class="info-row"><span class="lb">${t.job_name}:</span><span class="vl">${items.length > 0 ? items[0].model : "-"}</span></div>
    </div>
  </div>
</div>

<!-- ═══ CUSTOMER INFO ═══ -->
<div class="customer-box">
  <div class="section-label">${t.customer}</div>
  ${q.company
    ? `<p class="cust-name">${q.company}${q.branch ? ` (${q.branch})` : ""}</p>
       ${q.name ? `<p style="font-size:9.5pt;color:#666">${t.contact}: ${q.name}</p>` : ""}`
    : `<p class="cust-name">${q.name}${q.branch ? ` (${q.branch})` : ""}</p>`
  }
  ${q.company_address ? `<p>${q.company_address}</p>` : ""}
  ${q.tax_id ? `<p style="font-size:9pt;color:#888">${t.tax_id} ${q.tax_id}</p>` : ""}
  <p><span style="color:#888">${t.email}:</span> ${q.email}${q.phone ? ` | <span style="color:#888">${t.phone}:</span> ${q.phone}` : ""}</p>
</div>

<!-- ═══ PRODUCT TABLE ═══ -->
<table class="items">
  <thead>
    <tr>
      <th class="c" style="width:5%">${t.item_no}</th>
      <th style="width:45%">${t.description}</th>
      <th class="c" style="width:10%">${t.quantity}</th>
      <th class="r" style="width:15%">${t.unit_price}</th>
      <th class="r" style="width:10%">${t.discount}</th>
      <th class="r" style="width:15%">${t.amount}</th>
    </tr>
  </thead>
  <tbody>
    ${itemRows}
  </tbody>
</table>

${(documentType !== 'delivery' && documentType !== 'receipt_simple') ? `
<!-- ═══ TOTALS ═══ -->
<div class="totals-section no-break">
  <div class="totals">
    <div class="row"><span>${t.subtotal}</span><span>${fp(subtotal + totalDiscount)} ${t.currency}</span></div>
    ${totalDiscount > 0 ? `<div class="row"><span>${t.discount_total}</span><span>${fp(totalDiscount)} ${t.currency}</span></div>
    <div class="row sub"><span>${t.after_discount}</span><span>${fp(afterDiscount)} ${t.currency}</span></div>` : ""}
    ${vatPercent > 0 ? `<div class="row vat"><span>${t.vat} ${vatPercent}%</span><span>${fp(vatAmount)} ${t.currency}</span></div>` : ""}
    <div class="row grand"><span>${t.grand_total}</span><span>${fp(grandTotal)} ${t.currency}</span></div>
    ${whtPercent > 0 ? `<div class="row wht"><span>${t.wht} ${whtPercent}%</span><span>-${fp(whtAmount)} ${t.currency}</span></div>
    <div class="row net"><span>${t.net_payable}</span><span>${fp(netPayable)} ${t.currency}</span></div>` : ""}
  </div>
</div>
<div class="thai-text">(${amountText})</div>
` : ''}

<!-- ═══ NOTES & BANK ═══ -->
<div class="notes-section no-break">
  <h3>${t.notes}</h3>
  <p>${t.payment_method}</p>
  <p>${t.payment_note}</p>
  ${(c.bank_accounts || []).length > 0 ? `
  <div class="bank-block">
    ${c.bank_accounts!.map(b => `<div class="bank-item">
      <strong>${coNameFull}</strong>
      <div>${b.bank} ${b.branch}</div>
      <div>${t.savings} ${b.number}</div>
    </div>`).join("")}
    <div class="payslip-note">${t.payslip}: accountant@entgroup.co.th</div>
  </div>` : ""}
</div>

<!-- ═══ TERMS ═══ -->
${c.quote_terms ? `<div class="terms-section no-break">
  <h3>${t.terms}</h3>
  <div class="terms-body">${c.quote_terms}</div>
</div>` : ""}

<!-- ═══ SIGNATURES ═══ -->
<div class="sigs">
  <div>
    <div class="sig">
      <p>${t.by_name} ${q.company || q.name}</p>
      <p class="name">${t.purchaser} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${t.date_label}</p>
    </div>
  </div>
  <div class="sig-stamp">
    <div class="stamp-placeholder">${t.company_seal}</div>
  </div>
  <div>
    <div class="sig">
      <p>${t.by_name} ${coNameFull}</p>
      <p class="name">${t.authorized} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${t.date_label} ${today}</p>
    </div>
  </div>
</div>

${(documentType === 'receipt_full' || documentType === 'receipt_simple') ? `
<!-- ═══ PAYMENT INFO ═══ -->
<div class="payment-info-section no-break">
  <div class="payment-info-grid">
    <div class="payment-info-row">
      <span class="payment-lb">${t.payment_date_label}:</span>
      <span class="payment-vl">${q.payment_date ? new Date(q.payment_date).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—"}</span>
    </div>
    <div class="payment-info-row">
      <span class="payment-lb">${t.payment_method_label}:</span>
      <span class="payment-vl">${q.payment_method || "—"}</span>
    </div>
    <div class="payment-info-row payment-amount-row">
      <span class="payment-lb">${t.amount_paid}:</span>
      <span class="payment-amount">${fp(q.amount_paid || 0)} ${t.currency}</span>
    </div>
  </div>
  ${documentType === 'receipt_simple' ? `<div class="thai-text" style="margin:8px 0 0;text-align:center">(${lang === 'th' ? numberToThaiText(q.amount_paid || 0) : numberToEnglishText(q.amount_paid || 0)})</div>` : ''}
</div>

<!-- ═══ RECEIPT SIGNATURE ═══ -->
<div class="receipt-signature-section">
  <div class="receipt-signature-box">
    <div class="receipt-signature-line"></div>
    <div class="receipt-signature-label">${t.receiver_signature}</div>
    ${q.receiver_name ? `<div class="receipt-signature-name">(${q.receiver_name})</div>` : `<div class="receipt-signature-name">(...........................)</div>`}
    ${q.receiver_position ? `<div class="receipt-signature-position">${t.receiver_position}: ${q.receiver_position}</div>` : ''}
    <div class="receipt-signature-date">${t.signed_date}: ........./........./...........</div>
  </div>
</div>
` : ''}

<!-- ═══ FOOTER ═══ -->
<div class="page-footer">
  <p>${coNameFull} | ${t.phone}. ${c.phone} | ${c.website} | ${c.email}</p>
</div>

</div><!-- /page-container -->

</body></html>`;

  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    // รอ font ภาษาไทยโหลดเสร็จก่อน print เพื่อป้องกันสระ/วรรณยุกต์ซ้อน
    const triggerPrint = () => {
      try {
        const docFonts = (w.document as any).fonts;
        if (docFonts && typeof docFonts.load === "function") {
          // โหลดทุก weight ของ Sarabun ที่ใช้ในเอกสาร แบบ explicit
          Promise.all([
            docFonts.load('300 10pt Sarabun'),
            docFonts.load('400 10pt Sarabun'),
            docFonts.load('600 11pt Sarabun'),
            docFonts.load('700 14pt Sarabun'),
            docFonts.load('700 22pt Sarabun'),
          ]).then(() => {
            // เพิ่ม delay เพื่อให้ browser layout ภาษาไทยเสร็จ
            setTimeout(() => w.print(), 500);
          }).catch(() => {
            setTimeout(() => w.print(), 2000);
          });
        } else {
          // Fallback สำหรับ browser เก่าที่ไม่มี document.fonts API
          setTimeout(() => w.print(), 2000);
        }
      } catch {
        setTimeout(() => w.print(), 2000);
      }
    };
    if (w.document.readyState === "complete") {
      triggerPrint();
    } else {
      w.addEventListener("load", triggerPrint);
    }
  }
};

export default printQuote;
