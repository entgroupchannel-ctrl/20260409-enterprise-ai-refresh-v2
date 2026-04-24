// TouchWork Datasheet PDF Template
// Inline-style template (no Tailwind) — works correctly with html2pdf.js
// Theme matches QuotePDFTemplate (#1d4ed8) for consistency across all ENT documents.

import type { TouchWorkProduct, TouchWorkVariant } from "@/data/touchwork-products";

interface CompanyInfo {
  name_th: string;
  name_en: string | null;
  address_th: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  tax_id: string | null;
  logo_url: string | null;
}

interface TouchWorkDatasheetPDFProps {
  product: TouchWorkProduct;
  company: CompanyInfo;
  /** Pre-rendered QR PNG (data URL) — link to product page */
  qrProductDataUrl: string;
  /** Pre-rendered QR PNG (data URL) — link to quote request */
  qrQuoteDataUrl: string;
  /** Public URL ของหน้าสินค้า (เผื่อ user พิมพ์ลิงก์ตรง ๆ) */
  productUrl: string;
}

const BRAND = "#1d4ed8";
const BRAND_SOFT = "#eff6ff";
const BORDER = "#e5e7eb";
const INK = "#1a1a1a";
const MUTE = "#666";

const s = {
  page: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '10pt',
    color: '#222',
    lineHeight: 1.5,
    padding: 0,
    margin: 0,
  } as React.CSSProperties,

  // Header band
  headerWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: `2px solid ${BRAND}`,
    paddingBottom: '12px',
    marginBottom: '16px',
  } as React.CSSProperties,
  companyCol: { display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 } as React.CSSProperties,
  logo: { width: '64px', height: '64px', objectFit: 'contain' as const },
  companyName: { fontSize: '14pt', fontWeight: 'bold', color: BRAND, margin: '0 0 2px' } as React.CSSProperties,
  companyEn: { fontSize: '9pt', color: '#555', fontStyle: 'italic', margin: '0 0 4px' } as React.CSSProperties,
  companyDetail: { fontSize: '8pt', color: '#555', margin: '1px 0' } as React.CSSProperties,
  docTitle: { textAlign: 'right' as const, minWidth: '200px' } as React.CSSProperties,
  docTitleH: { fontSize: '16pt', fontWeight: 'bold', color: INK, margin: '0 0 2px' } as React.CSSProperties,
  docSub: { fontSize: '8pt', color: '#888', margin: '0 0 6px' } as React.CSSProperties,
  badge: {
    display: 'inline-block',
    background: BRAND_SOFT,
    color: BRAND,
    border: '1px solid #bfdbfe',
    borderRadius: '4px',
    padding: '2px 10px',
    fontSize: '9pt',
    fontWeight: 'bold',
  } as React.CSSProperties,

  // Hero — image + summary
  hero: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr',
    gap: '16px',
    marginBottom: '14px',
    border: `1px solid ${BORDER}`,
    borderRadius: '6px',
    padding: '12px',
    background: '#fafafa',
  } as React.CSSProperties,
  heroImg: {
    width: '100%',
    height: '160px',
    objectFit: 'contain' as const,
    background: '#fff',
    border: `1px solid ${BORDER}`,
    borderRadius: '4px',
  } as React.CSSProperties,
  heroH: { fontSize: '18pt', fontWeight: 'bold', color: INK, margin: '0 0 2px' } as React.CSSProperties,
  heroSub: { fontSize: '9pt', color: MUTE, margin: '0 0 8px' } as React.CSSProperties,
  chipRow: { display: 'flex', flexWrap: 'wrap' as const, gap: '4px', marginBottom: '8px' } as React.CSSProperties,
  chip: {
    fontSize: '7.5pt',
    padding: '2px 8px',
    border: `1px solid ${BORDER}`,
    borderRadius: '999px',
    background: '#fff',
    color: '#333',
  } as React.CSSProperties,
  chipPrimary: {
    fontSize: '7.5pt',
    padding: '2px 8px',
    border: '1px solid #bfdbfe',
    borderRadius: '999px',
    background: BRAND_SOFT,
    color: BRAND,
    fontWeight: 'bold',
  } as React.CSSProperties,
  highlightUl: { margin: '4px 0 0', padding: '0 0 0 14px', fontSize: '8.5pt', color: '#333' } as React.CSSProperties,

  // Variant cards
  variantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '14px',
  } as React.CSSProperties,
  variantCard: {
    border: `1px solid ${BORDER}`,
    borderRadius: '4px',
    padding: '8px 10px',
    background: '#fff',
  } as React.CSSProperties,
  variantTag: {
    display: 'inline-block',
    fontSize: '8pt',
    fontWeight: 'bold',
    padding: '1px 6px',
    borderRadius: '3px',
    background: BRAND,
    color: '#fff',
    marginBottom: '4px',
  } as React.CSSProperties,
  variantName: { fontSize: '9pt', fontWeight: 'bold', margin: '0 0 2px' } as React.CSSProperties,
  variantHint: { fontSize: '7.5pt', color: MUTE, margin: 0 } as React.CSSProperties,

  // Spec sections
  sectionH: {
    fontSize: '10pt',
    fontWeight: 'bold',
    color: '#fff',
    background: BRAND,
    padding: '5px 10px',
    borderRadius: '3px 3px 0 0',
    margin: '0',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '8.5pt',
    marginBottom: '10px',
    border: `1px solid ${BORDER}`,
  } as React.CSSProperties,
  trEven: { background: '#fafafa' } as React.CSSProperties,
  tdLabel: {
    padding: '5px 10px',
    color: MUTE,
    width: '40%',
    borderBottom: `1px solid ${BORDER}`,
  } as React.CSSProperties,
  tdVal: {
    padding: '5px 10px',
    fontWeight: 'bold',
    color: INK,
    borderBottom: `1px solid ${BORDER}`,
  } as React.CSSProperties,

  // Two-col grid for compact specs
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '10px',
  } as React.CSSProperties,

  // CPU options table
  cpuTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '8pt',
    marginBottom: '10px',
    border: `1px solid ${BORDER}`,
  } as React.CSSProperties,
  cpuTh: {
    background: '#f3f4f6',
    padding: '5px 8px',
    textAlign: 'left' as const,
    fontWeight: 'bold',
    color: '#333',
    borderBottom: `1px solid ${BORDER}`,
    fontSize: '8pt',
  } as React.CSSProperties,
  cpuTd: {
    padding: '5px 8px',
    borderBottom: `1px solid ${BORDER}`,
    verticalAlign: 'top' as const,
    fontSize: '8pt',
  } as React.CSSProperties,

  // Footer with QR codes
  footerWrap: {
    marginTop: '14px',
    paddingTop: '12px',
    borderTop: `2px solid ${BRAND}`,
    display: 'grid',
    gridTemplateColumns: '1fr 110px 110px',
    gap: '14px',
    alignItems: 'flex-start',
  } as React.CSSProperties,
  qrBox: { textAlign: 'center' as const } as React.CSSProperties,
  qrImg: { width: '90px', height: '90px', display: 'block', margin: '0 auto 4px' } as React.CSSProperties,
  qrLabel: { fontSize: '7.5pt', fontWeight: 'bold', color: INK, margin: 0 } as React.CSSProperties,
  qrSub: { fontSize: '7pt', color: MUTE, margin: '1px 0 0' } as React.CSSProperties,

  contactBox: { fontSize: '8.5pt', color: '#333' } as React.CSSProperties,
  contactH: { fontSize: '9pt', fontWeight: 'bold', color: BRAND, margin: '0 0 4px' } as React.CSSProperties,
  contactRow: { margin: '1px 0' } as React.CSSProperties,
  disclaimer: {
    marginTop: '10px',
    paddingTop: '8px',
    borderTop: `1px solid ${BORDER}`,
    fontSize: '7pt',
    color: '#999',
    textAlign: 'center' as const,
  } as React.CSSProperties,
};

const SpecBlock = ({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) => (
  <div style={{ marginBottom: '10px' }}>
    <h3 style={s.sectionH}>{title}</h3>
    <table style={s.table}>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.label} style={i % 2 ? s.trEven : undefined}>
            <td style={s.tdLabel}>{r.label}</td>
            <td style={s.tdVal}>{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const archLabel: Record<string, string> = {
  Monitor: 'Monitor (จอเปล่า)',
  ARM: 'ARM (Android)',
  X86: 'X86 (Windows)',
};

export default function TouchWorkDatasheetPDF({
  product,
  company,
  qrProductDataUrl,
  qrQuoteDataUrl,
  productUrl,
}: TouchWorkDatasheetPDFProps) {
  const heroImage = product.variants[0]?.image;

  return (
    <div id="touchwork-datasheet-pdf" style={s.page}>
      <style>{`
        @page { size: A4 portrait; margin: 12mm 12mm 14mm 12mm; }
        #touchwork-datasheet-pdf { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #222; }
        thead { display: table-header-group; }
        tr, .avoid-break { page-break-inside: avoid; }
      `}</style>

      {/* HEADER */}
      <div style={s.headerWrap}>
        <div style={s.companyCol}>
          {company.logo_url && (
            <img src={company.logo_url} alt={company.name_th} style={s.logo} crossOrigin="anonymous" />
          )}
          <div>
            <p style={s.companyName}>{company.name_th}</p>
            {company.name_en && <p style={s.companyEn}>{company.name_en}</p>}
            {company.address_th && <p style={s.companyDetail}>{company.address_th}</p>}
            <p style={s.companyDetail}>
              {[
                company.phone && `โทร: ${company.phone}`,
                company.email && `Email: ${company.email}`,
              ].filter(Boolean).join('  ')}
            </p>
            {company.website && <p style={s.companyDetail}>เว็บไซต์: {company.website}</p>}
          </div>
        </div>
        <div style={s.docTitle}>
          <p style={s.docTitleH}>PRODUCT DATASHEET</p>
          <p style={s.docSub}>เอกสารข้อมูลผลิตภัณฑ์</p>
          <span style={s.badge}>TouchWork Series</span>
        </div>
      </div>

      {/* HERO */}
      <div style={s.hero} className="avoid-break">
        {heroImage ? (
          <img src={heroImage} alt={product.model} style={s.heroImg} />
        ) : (
          <div style={s.heroImg} />
        )}
        <div>
          <h1 style={s.heroH}>{product.model}</h1>
          <p style={s.heroSub}>
            จอสัมผัสอุตสาหกรรม {product.size}″ {product.resolution} ({product.ratio}) — {product.touch}
          </p>
          <div style={s.chipRow}>
            <span style={s.chipPrimary}>{product.size}″</span>
            <span style={s.chip}>{product.resolution}</span>
            <span style={s.chip}>{product.brightness}</span>
            <span style={s.chip}>{product.ipRating}</span>
            {product.mounting.slice(0, 3).map((m) => (
              <span key={m} style={s.chip}>{m}</span>
            ))}
          </div>
          <ul style={s.highlightUl}>
            {product.highlights.slice(0, 4).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* VARIANTS */}
      <div style={s.variantGrid} className="avoid-break">
        {product.variants.map((v: TouchWorkVariant) => (
          <div key={v.arch} style={s.variantCard}>
            <span style={s.variantTag}>{archLabel[v.arch] || v.arch}</span>
            <p style={s.variantName}>{v.os}</p>
            <p style={s.variantHint}>{v.cpuHint}</p>
          </div>
        ))}
      </div>

      {/* TWO-COL: LCD + Touch */}
      <div style={s.twoCol}>
        <SpecBlock title="LCD Panel" rows={product.specs.lcd} />
        <SpecBlock title="Touch Panel" rows={product.specs.touch} />
      </div>

      {/* TWO-COL: Dimension + Environment */}
      <div style={s.twoCol}>
        <SpecBlock title="Dimension & Weight" rows={product.specs.dimension} />
        <SpecBlock title="Operating Environment" rows={product.specs.environment} />
      </div>

      {/* Power */}
      <SpecBlock title="Power Supply" rows={product.specs.power} />

      {/* CPU Options (Android) */}
      {product.specs.androidOptions && product.specs.androidOptions.length > 0 && (
        <div style={{ marginBottom: '10px' }} className="avoid-break">
          <h3 style={s.sectionH}>Android (ARM) CPU Options</h3>
          <table style={s.cpuTable}>
            <thead>
              <tr>
                <th style={s.cpuTh}>CPU</th>
                <th style={s.cpuTh}>Memory</th>
                <th style={s.cpuTh}>Storage</th>
                <th style={s.cpuTh}>OS</th>
              </tr>
            </thead>
            <tbody>
              {product.specs.androidOptions.map((o, i) => (
                <tr key={i} style={i % 2 ? s.trEven : undefined}>
                  <td style={s.cpuTd}><b>{o.cpu}</b><br /><span style={{ color: MUTE }}>{o.gpu}</span></td>
                  <td style={s.cpuTd}>{o.memory}</td>
                  <td style={s.cpuTd}>{o.storage}</td>
                  <td style={s.cpuTd}>{o.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CPU Options (Windows) */}
      {product.specs.windowsOptions && product.specs.windowsOptions.length > 0 && (
        <div style={{ marginBottom: '10px' }} className="avoid-break">
          <h3 style={s.sectionH}>Windows (X86) CPU Options</h3>
          <table style={s.cpuTable}>
            <thead>
              <tr>
                <th style={s.cpuTh}>CPU</th>
                <th style={s.cpuTh}>Memory</th>
                <th style={s.cpuTh}>Storage</th>
                <th style={s.cpuTh}>OS</th>
              </tr>
            </thead>
            <tbody>
              {product.specs.windowsOptions.map((o, i) => (
                <tr key={i} style={i % 2 ? s.trEven : undefined}>
                  <td style={s.cpuTd}><b>{o.cpu}</b><br /><span style={{ color: MUTE }}>{o.gpu}</span></td>
                  <td style={s.cpuTd}>{o.memory}</td>
                  <td style={s.cpuTd}>{o.storage}</td>
                  <td style={s.cpuTd}>{o.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* In the box */}
      <div style={{ marginBottom: '10px' }} className="avoid-break">
        <h3 style={s.sectionH}>Included in the Delivery (อุปกรณ์ในกล่อง)</h3>
        <div style={{
          border: `1px solid ${BORDER}`,
          borderTop: 'none',
          padding: '8px 12px',
          fontSize: '8.5pt',
          background: '#fff',
        }}>
          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
            {product.specs.delivery.map((d) => (
              <li key={d} style={{ margin: '2px 0' }}>{d}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* FOOTER — Contact + QR */}
      <div style={s.footerWrap} className="avoid-break">
        <div style={s.contactBox}>
          <p style={s.contactH}>ติดต่อสั่งซื้อ / ขอใบเสนอราคา</p>
          <p style={s.contactRow}>
            <b>{company.name_th}</b>
          </p>
          {company.address_th && <p style={s.contactRow}>{company.address_th}</p>}
          {company.phone && <p style={s.contactRow}>โทร: {company.phone}</p>}
          {company.email && <p style={s.contactRow}>Email: {company.email}</p>}
          {company.website && <p style={s.contactRow}>เว็บไซต์: {company.website}</p>}
          {company.tax_id && (
            <p style={{ ...s.contactRow, color: MUTE, fontSize: '7.5pt' }}>
              เลขประจำตัวผู้เสียภาษี: {company.tax_id}
            </p>
          )}
        </div>

        <div style={s.qrBox}>
          <img src={qrProductDataUrl} alt="QR Product" style={s.qrImg} />
          <p style={s.qrLabel}>ดูสินค้าออนไลน์</p>
          <p style={s.qrSub}>สแกนเพื่อดูรายละเอียด</p>
        </div>

        <div style={s.qrBox}>
          <img src={qrQuoteDataUrl} alt="QR Quote" style={s.qrImg} />
          <p style={s.qrLabel}>ขอใบเสนอราคา</p>
          <p style={s.qrSub}>พร้อมระบุรุ่นอัตโนมัติ</p>
        </div>
      </div>

      <p style={s.disclaimer}>
        ข้อมูลในเอกสารนี้อาจเปลี่ยนแปลงได้โดยไม่ต้องแจ้งล่วงหน้า • โปรดตรวจสอบสเปกล่าสุดผ่านลิงก์ {productUrl}
        <br />
        © {new Date().getFullYear()} {company.name_th} — All rights reserved.
      </p>
    </div>
  );
}
