// src/components/admin/QuotePDFTemplate.tsx
// Pure inline-style template — no Tailwind classes, works correctly with html2pdf.js

interface QuotePDFTemplateProps {
  quote: {
    id: string;
    quote_number: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string | null;
    customer_company: string | null;
    customer_address: string | null;
    customer_tax_id: string | null;
    customer_line?: string | null;
    payment_terms: string | null;
    delivery_terms: string | null;
    warranty_terms: string | null;
    notes: string | null;
    created_at: string;
  };
  revision: {
    id: string;
    revision_number: number;
    products: any[];
    free_items: any[] | null;
    subtotal: number;
    discount_percent: number | null;
    discount_amount: number | null;
    discount_type?: 'percent' | 'baht' | null;
    vat_percent: number | null;
    vat_amount: number | null;
    grand_total: number;
    valid_until: string | null;
    created_at: string;
    created_by_name: string;
    customer_message: string | null;
  };
  companyInfo: {
    name_th: string;
    name_en: string | null;
    address_th: string | null;
    address_en: string | null;
    phone: string | null;
    fax: string | null;
    email: string | null;
    website: string | null;
    tax_id: string | null;
    branch_type: string | null;
    branch_code: string | null;
    branch_name: string | null;
    logo_url: string | null;
  };
  salePerson?: {
    full_name: string | null;
    position: string | null;
    signature_url: string | null;
    show_signature_on_quotes: boolean | null;
  };
  bankAccounts?: Array<{
    bank_name: string;
    account_number: string;
    account_name: string;
    branch: string | null;
    account_type: string | null;
    is_default: boolean;
  }>;
}

const s = {
  // Layout
  page: { fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '10pt', color: '#222', lineHeight: 1.5, padding: '0', margin: '0' } as React.CSSProperties,
  // Header band
  headerWrap: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #1d4ed8', paddingBottom: '12px', marginBottom: '16px' } as React.CSSProperties,
  companyCol: { display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 } as React.CSSProperties,
  logo: { width: '64px', height: '64px', objectFit: 'contain' as const },
  companyName: { fontSize: '14pt', fontWeight: 'bold', color: '#1d4ed8', margin: '0 0 2px' } as React.CSSProperties,
  companyEn: { fontSize: '9pt', color: '#555', fontStyle: 'italic', margin: '0 0 4px' } as React.CSSProperties,
  companyDetail: { fontSize: '8pt', color: '#555', margin: '1px 0' } as React.CSSProperties,
  docTitle: { textAlign: 'right' as const },
  docTitleH: { fontSize: '16pt', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 2px' } as React.CSSProperties,
  docSub: { fontSize: '8pt', color: '#888', margin: '0 0 6px' } as React.CSSProperties,
  revBadge: { display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '2px 10px', fontSize: '9pt', fontWeight: 'bold' } as React.CSSProperties,
  // Two-col meta
  metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '16px' } as React.CSSProperties,
  metaSectionLabel: { fontSize: '8pt', fontWeight: 'bold', color: '#444', textTransform: 'uppercase' as const, borderBottom: '1px solid #ddd', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '0.05em' } as React.CSSProperties,
  metaName: { fontSize: '11pt', fontWeight: 'bold', margin: '0 0 2px' } as React.CSSProperties,
  metaDetail: { fontSize: '9pt', color: '#555', margin: '1px 0' } as React.CSSProperties,
  metaTable: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '9pt' } as React.CSSProperties,
  metaTdLabel: { color: '#666', paddingBottom: '2px', whiteSpace: 'nowrap' as const } as React.CSSProperties,
  metaTdValue: { textAlign: 'right' as const, fontWeight: 'bold' as const, paddingBottom: '2px' } as React.CSSProperties,
  // Product table
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '9pt', marginBottom: '8px' } as React.CSSProperties,
  th: { background: '#1d4ed8', color: '#fff', padding: '6px 8px', textAlign: 'left' as const, fontWeight: 'bold', fontSize: '9pt' } as React.CSSProperties,
  thRight: { background: '#1d4ed8', color: '#fff', padding: '6px 8px', textAlign: 'right' as const, fontWeight: 'bold', fontSize: '9pt' } as React.CSSProperties,
  thCenter: { background: '#1d4ed8', color: '#fff', padding: '6px 8px', textAlign: 'center' as const, fontWeight: 'bold', fontSize: '9pt' } as React.CSSProperties,
  tdTop: { padding: '6px 8px', verticalAlign: 'top' as const, borderBottom: '1px solid #e5e7eb' } as React.CSSProperties,
  tdRight: { padding: '6px 8px', verticalAlign: 'top' as const, textAlign: 'right' as const, borderBottom: '1px solid #e5e7eb' } as React.CSSProperties,
  tdCenter: { padding: '6px 8px', verticalAlign: 'top' as const, textAlign: 'center' as const, borderBottom: '1px solid #e5e7eb' } as React.CSSProperties,
  productName: { fontWeight: 'bold', margin: '0 0 2px' } as React.CSSProperties,
  productDesc: { color: '#555', fontSize: '8.5pt', whiteSpace: 'pre-wrap' as const, margin: 0 } as React.CSSProperties,
  productNote: { color: '#1d4ed8', fontSize: '8.5pt', margin: '2px 0 0' } as React.CSSProperties,
  // Totals
  totalsWrap: { display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' } as React.CSSProperties,
  totalsTable: { borderCollapse: 'collapse' as const, fontSize: '9pt', minWidth: '260px' } as React.CSSProperties,
  totalsTdLabel: { padding: '3px 16px 3px 0', color: '#555' } as React.CSSProperties,
  totalsTdValue: { padding: '3px 0', textAlign: 'right' as const, fontWeight: 'bold' } as React.CSSProperties,
  totalsTdGrandLabel: { padding: '6px 16px 3px 0', fontWeight: 'bold', fontSize: '11pt', borderTop: '2px solid #1a1a1a' } as React.CSSProperties,
  totalsTdGrand: { padding: '6px 0 3px', textAlign: 'right' as const, fontWeight: 'bold', fontSize: '11pt', color: '#1d4ed8', borderTop: '2px solid #1a1a1a' } as React.CSSProperties,
  // Terms
  termsWrap: { borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '4px', fontSize: '9pt' } as React.CSSProperties,
  termsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' } as React.CSSProperties,
  termsLabel: { fontWeight: 'bold', color: '#333', marginBottom: '2px' } as React.CSSProperties,
  termsValue: { color: '#555', margin: 0 } as React.CSSProperties,
  // Bank
  bankWrap: { marginTop: '12px', fontSize: '9pt' } as React.CSSProperties,
  bankLabel: { fontWeight: 'bold', marginBottom: '6px', color: '#333' } as React.CSSProperties,
  bankGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } as React.CSSProperties,
  bankCard: (isDefault: boolean): React.CSSProperties => ({
    border: isDefault ? '1.5px solid #1d4ed8' : '1px solid #ddd',
    borderRadius: '4px',
    padding: '7px 10px',
    background: isDefault ? '#eff6ff' : '#fafafa',
    fontSize: '8.5pt',
  }),
  bankCardName: { fontWeight: 'bold', margin: '0 0 2px', color: '#222' } as React.CSSProperties,
  bankCardAcc: { fontFamily: 'monospace', margin: '0 0 1px' } as React.CSSProperties,
  bankCardSub: { color: '#666', margin: 0 } as React.CSSProperties,
  // Signature
  sigGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' } as React.CSSProperties,
  sigBox: { textAlign: 'center' as const } as React.CSSProperties,
  sigLine: { borderBottom: '1px solid #aaa', marginBottom: '6px', paddingBottom: '40px' } as React.CSSProperties,
  sigName: { fontSize: '9.5pt', fontWeight: 'bold' } as React.CSSProperties,
  sigRole: { fontSize: '8.5pt', color: '#666', margin: '1px 0' } as React.CSSProperties,
  sigDate: { fontSize: '8pt', color: '#888' } as React.CSSProperties,
  // Footer
  footer: { marginTop: '16px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', textAlign: 'center' as const, fontSize: '8pt', color: '#aaa' } as React.CSSProperties,
  // Misc
  freeItemsBox: { margin: '0 0 12px', padding: '8px 12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', fontSize: '9pt' } as React.CSSProperties,
  customerMsgBox: { margin: '0 0 12px', padding: '8px 12px', borderLeft: '3px solid #1d4ed8', background: '#eff6ff', borderRadius: '2px', fontSize: '9pt' } as React.CSSProperties,
};

function fmt(n: number) {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function thDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function QuotePDFTemplate({ quote, revision, companyInfo, salePerson, bankAccounts }: QuotePDFTemplateProps) {
  const products = revision.products || [];
  const freeItems = (revision.free_items && Array.isArray(revision.free_items)) ? revision.free_items : [];

  return (
    <div id="quote-pdf-template" style={s.page}>

      {/* ── PAGE CSS injected inline for html2pdf ─────────────────────── */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 22mm 15mm 18mm 15mm;
          /* Running header — repeats on every page (print only) */
          @top-left {
            content: "${(companyInfo.name_th || '').replace(/"/g, '\\"')}";
            font-size: 8pt; color: #1d4ed8; font-weight: bold;
            border-bottom: 1px solid #1d4ed8; padding-bottom: 2mm; width: 100%;
          }
          @top-right {
            content: "ใบเสนอราคา ${quote.quote_number} • Rev ${revision.revision_number}";
            font-size: 8pt; color: #555;
            border-bottom: 1px solid #1d4ed8; padding-bottom: 2mm;
          }
          @bottom-right {
            content: "หน้า " counter(page) " / " counter(pages);
            font-size: 8pt; color: #aaa;
          }
          @bottom-left {
            content: "${(quote.quote_number || '').replace(/"/g, '\\"')}";
            font-size: 8pt; color: #aaa;
          }
        }
        #quote-pdf-template {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10pt;
          color: #222;
          line-height: 1.5;
        }
        /* Repeat the products table header on every page when it spans pages */
        #quote-pdf-template table.products thead { display: table-header-group; }
        #quote-pdf-template table.products tfoot { display: table-footer-group; }
        /* Allow long product rows (with full spec sheets) to break across pages,
           but try to keep the row together if it fits */
        #quote-pdf-template table.products tbody tr { page-break-inside: auto; }
        /* Blocks that must not be split across pages */
        #quote-pdf-template .pdf-keep { page-break-inside: avoid; break-inside: avoid; }
        /* Force a fresh page when needed */
        #quote-pdf-template .pdf-page-break { page-break-before: always; break-before: page; }
        /* Headings shouldn't be the last line on a page */
        #quote-pdf-template h1, #quote-pdf-template h2, #quote-pdf-template h3,
        #quote-pdf-template .pdf-keep-with-next { page-break-after: avoid; break-after: avoid; }
      `}</style>

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div style={s.headerWrap}>
        <div style={s.companyCol}>
          {companyInfo.logo_url && (
            <img src={companyInfo.logo_url} alt={companyInfo.name_th} style={s.logo} />
          )}
          <div>
            <p style={s.companyName}>{companyInfo.name_th}</p>
            {companyInfo.name_en && <p style={s.companyEn}>{companyInfo.name_en}</p>}
            {companyInfo.address_th && <p style={s.companyDetail}>{companyInfo.address_th}</p>}
            <p style={s.companyDetail}>
              {[
                companyInfo.phone && `โทร: ${companyInfo.phone}`,
                companyInfo.fax && `แฟกซ์: ${companyInfo.fax}`,
                companyInfo.email && `Email: ${companyInfo.email}`,
              ].filter(Boolean).join('  ')}
            </p>
            {companyInfo.website && <p style={s.companyDetail}>เว็บไซต์: {companyInfo.website}</p>}
            {companyInfo.tax_id && (
              <p style={{ ...s.companyDetail, fontWeight: 'bold' }}>
                เลขประจำตัวผู้เสียภาษี: {companyInfo.tax_id}
                {companyInfo.branch_type === 'head_office' && ' (สำนักงานใหญ่)'}
                {companyInfo.branch_type === 'branch' && companyInfo.branch_name && ` (สาขา: ${companyInfo.branch_name})`}
              </p>
            )}
          </div>
        </div>

        <div style={s.docTitle}>
          <p style={s.docTitleH}>ใบเสนอราคา</p>
          <p style={s.docSub}>QUOTATION</p>
          <span style={s.revBadge}>Revision {revision.revision_number}</span>
        </div>
      </div>

      {/* ── META: Customer + Quote Details ───────────────────────────── */}
      <div style={s.metaGrid}>
        <div>
          <p style={s.metaSectionLabel}>ลูกค้า</p>
          <p style={s.metaName}>{quote.customer_name}</p>
          {quote.customer_company && <p style={s.metaDetail}>{quote.customer_company}</p>}
          {quote.customer_address && <p style={{ ...s.metaDetail, whiteSpace: 'pre-line' }}>{quote.customer_address}</p>}
          {quote.customer_tax_id && (
            <p style={s.metaDetail}>เลขประจำตัวผู้เสียภาษี: <span style={{ fontFamily: 'monospace' }}>{quote.customer_tax_id}</span></p>
          )}
          {quote.customer_phone && <p style={s.metaDetail}>โทร: {quote.customer_phone}</p>}
          {quote.customer_email && <p style={s.metaDetail}>Email: {quote.customer_email}</p>}
          {quote.customer_line && <p style={s.metaDetail}>LINE: {quote.customer_line}</p>}
        </div>

        <div>
          <p style={s.metaSectionLabel}>รายละเอียด</p>
          <table style={s.metaTable}>
            <tbody>
              <tr>
                <td style={s.metaTdLabel}>เลขที่ใบเสนอราคา:</td>
                <td style={s.metaTdValue}>{quote.quote_number}</td>
              </tr>
              <tr>
                <td style={s.metaTdLabel}>Revision:</td>
                <td style={s.metaTdValue}>#{revision.revision_number}</td>
              </tr>
              <tr>
                <td style={s.metaTdLabel}>วันที่:</td>
                <td style={s.metaTdValue}>{thDate(revision.created_at)}</td>
              </tr>
              {revision.valid_until && (
                <tr>
                  <td style={s.metaTdLabel}>ใช้ได้ถึง:</td>
                  <td style={s.metaTdValue}>{thDate(revision.valid_until)}</td>
                </tr>
              )}
              <tr>
                <td style={s.metaTdLabel}>ผู้เสนอราคา:</td>
                <td style={s.metaTdValue}>{revision.created_by_name}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PRODUCTS TABLE (thead repeats on each page) ───────────────── */}
      <table style={s.table}>
        <thead>
          <tr>
            <th style={{ ...s.th, width: '32px' }}>#</th>
            <th style={s.th}>รายการ</th>
            <th style={{ ...s.thCenter, width: '52px' }}>จำนวน</th>
            <th style={{ ...s.thRight, width: '88px' }}>ราคา/หน่วย</th>
            <th style={{ ...s.thRight, width: '80px' }}>ส่วนลด</th>
            <th style={{ ...s.thRight, width: '96px' }}>รวม</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any, idx: number) => (
            <tr key={idx}>
              <td style={s.tdTop}>{idx + 1}</td>
              <td style={s.tdTop}>
                <p style={s.productName}>{p.name || p.model}</p>
                {p.description && <p style={s.productDesc}>{p.description}</p>}
                {p.specs && p.specs !== p.description && (
                  <p style={{ ...s.productDesc, whiteSpace: 'pre-wrap' }}>{p.specs}</p>
                )}
                {p.notes && <p style={s.productNote}>* {p.notes}</p>}
              </td>
              <td style={s.tdCenter}>{p.quantity ?? p.qty}</td>
              <td style={s.tdRight}>{fmt(p.unit_price)}</td>
              <td style={s.tdRight}>
                {p.discount_amount > 0 ? fmt(p.discount_amount)
                  : p.discount_percent > 0 ? `${p.discount_percent}%`
                  : '–'}
              </td>
              <td style={{ ...s.tdRight, fontWeight: 'bold' }}>
                {fmt(p.line_total ?? ((p.quantity ?? p.qty) * p.unit_price))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── FREE ITEMS ────────────────────────────────────────────────── */}
      {freeItems.length > 0 && (
        <div style={s.freeItemsBox}>
          <p style={{ fontWeight: 'bold', margin: '0 0 4px' }}>🎁 ของแถม</p>
          {freeItems.map((item: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name || item.model} × {item.quantity ?? item.qty}</span>
              {(item.value || item.total_value) && (
                <span style={{ color: '#666' }}>มูลค่า {fmt(item.value || item.total_value)}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── CUSTOMER MESSAGE ──────────────────────────────────────────── */}
      {revision.customer_message && (
        <div style={s.customerMsgBox}>
          <p style={{ margin: '0 0 2px', color: '#666', fontSize: '8.5pt' }}>ข้อความจากลูกค้า:</p>
          <p style={{ margin: 0, fontStyle: 'italic' }}>"{revision.customer_message}"</p>
        </div>
      )}

      {/* ── TOTALS ────────────────────────────────────────────────────── */}
      <div style={s.totalsWrap}>
        <table style={s.totalsTable}>
          <tbody>
            <tr>
              <td style={s.totalsTdLabel}>ยอดรวม:</td>
              <td style={s.totalsTdValue}>{fmt(revision.subtotal)} บาท</td>
            </tr>
            {(revision.discount_amount ?? 0) > 0 && (
              <tr>
                <td style={{ ...s.totalsTdLabel, color: '#16a34a' }}>
                  ส่วนลด{revision.discount_type === 'baht'
                    ? ` (฿${fmt(revision.discount_amount!)})`
                    : revision.discount_percent ? ` (${revision.discount_percent}%)` : ''}:
                </td>
                <td style={{ ...s.totalsTdValue, color: '#16a34a' }}>-{fmt(revision.discount_amount!)} บาท</td>
              </tr>
            )}
            {(revision.vat_amount ?? 0) > 0 && (
              <tr>
                <td style={s.totalsTdLabel}>VAT {revision.vat_percent ?? 7}%:</td>
                <td style={s.totalsTdValue}>{fmt(revision.vat_amount!)} บาท</td>
              </tr>
            )}
            <tr>
              <td style={s.totalsTdGrandLabel}>รวมสุทธิ:</td>
              <td style={s.totalsTdGrand}>{fmt(revision.grand_total)} บาท</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── TERMS ─────────────────────────────────────────────────────── */}
      {(quote.payment_terms || quote.delivery_terms || quote.warranty_terms || quote.notes) && (
        <div style={s.termsWrap}>
          <div style={s.termsGrid}>
            {quote.payment_terms && (
              <div>
                <p style={s.termsLabel}>เงื่อนไขการชำระเงิน:</p>
                <p style={s.termsValue}>{quote.payment_terms}</p>
              </div>
            )}
            {quote.delivery_terms && (
              <div>
                <p style={s.termsLabel}>เงื่อนไขการจัดส่ง:</p>
                <p style={s.termsValue}>{quote.delivery_terms}</p>
              </div>
            )}
            {quote.warranty_terms && (
              <div>
                <p style={s.termsLabel}>การรับประกัน:</p>
                <p style={s.termsValue}>{quote.warranty_terms}</p>
              </div>
            )}
          </div>
          {quote.notes && (
            <div>
              <p style={s.termsLabel}>หมายเหตุ:</p>
              <p style={s.termsValue}>{quote.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* ── BANK ACCOUNTS ─────────────────────────────────────────────── */}
      {bankAccounts && bankAccounts.length > 0 && (
        <div style={s.bankWrap}>
          <p style={s.bankLabel}>การชำระเงิน — โอนเข้าบัญชี:</p>
          <div style={s.bankGrid}>
            {bankAccounts.map((bank, idx) => (
              <div key={idx} style={s.bankCard(bank.is_default)}>
                <p style={s.bankCardName}>
                  {bank.bank_name}
                  {bank.is_default && <span style={{ marginLeft: '6px', fontSize: '8pt', color: '#1d4ed8' }}>⭐ หลัก</span>}
                </p>
                <p style={s.bankCardAcc}>{bank.account_number}</p>
                <p style={s.bankCardSub}>{bank.account_name}</p>
                {bank.branch && <p style={s.bankCardSub}>สาขา: {bank.branch}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SIGNATURES ────────────────────────────────────────────────── */}
      <div style={s.sigGrid}>
        <div style={s.sigBox}>
          {salePerson?.signature_url && salePerson?.show_signature_on_quotes !== false ? (
            <>
              <img src={salePerson.signature_url} alt="ลายเซ็น" style={{ maxHeight: '48px', margin: '0 auto 4px', display: 'block' }} />
              <div style={{ borderTop: '1px solid #aaa', paddingTop: '4px' }}>
                <p style={s.sigName}>{salePerson.full_name || 'พนักงานขาย'}</p>
                {salePerson.position && <p style={s.sigRole}>{salePerson.position}</p>}
              </div>
            </>
          ) : (
            <div style={s.sigLine} />
          )}
          <p style={s.sigRole}>ผู้เสนอราคา</p>
          <p style={s.sigDate}>วันที่: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div style={s.sigBox}>
          <div style={s.sigLine} />
          <p style={s.sigRole}>ผู้อนุมัติ</p>
          <p style={s.sigDate}>วันที่: ______________</p>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <div style={s.footer}>
        <p style={{ margin: 0 }}>เอกสารนี้ออกโดยระบบอัตโนมัติ ไม่ต้องลงนามเพื่อให้มีผลบังคับใช้</p>
      </div>

    </div>
  );
}
