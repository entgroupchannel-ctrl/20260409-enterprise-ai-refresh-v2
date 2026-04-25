import type { Content, CustomTableLayout, TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';

type AnyObj = Record<string, any>;

interface QuotePdfParams {
  quote: AnyObj;
  revision: AnyObj;
  companyInfo: AnyObj;
  salePerson?: AnyObj;
  bankAccounts?: AnyObj[];
}

const BLUE = '#1d4ed8';
const TEXT = '#222222';
const MUTED = '#666666';
const LIGHT = '#e5e7eb';
const HEADER_BG = '#f3f6fb';

let pdfMakeReady: Promise<any> | null = null;

function money(value: any) {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0));
}

function thaiDate(value: any) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
}

function text(value: any) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

function cleanLines(value: any) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/g, ''))
    .join('\n')
    .trim();
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function fetchBase64(path: string) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Font load failed: ${path}`);
  return arrayBufferToBase64(await res.arrayBuffer());
}

async function loadImageDataUrl(url?: string | null): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!/^image\/(png|jpe?g)$/i.test(blob.type)) return null;
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function getPdfMake() {
  if (!pdfMakeReady) {
    pdfMakeReady = (async () => {
      const mod: any = await import('pdfmake/build/pdfmake');
      const pdfMake = mod.default ?? mod;
      const [regular, bold] = await Promise.all([
        fetchBase64('/fonts/Sarabun-Regular.ttf'),
        fetchBase64('/fonts/Sarabun-Bold.ttf'),
      ]);
      const vfs = {
        'Sarabun-Regular.ttf': regular,
        'Sarabun-Bold.ttf': bold,
      };
      const fonts = {
        Sarabun: {
          normal: 'Sarabun-Regular.ttf',
          bold: 'Sarabun-Bold.ttf',
          italics: 'Sarabun-Regular.ttf',
          bolditalics: 'Sarabun-Bold.ttf',
        },
      };

      if (typeof pdfMake.addVirtualFileSystem === 'function') {
        pdfMake.addVirtualFileSystem(vfs);
      } else {
        pdfMake.vfs = { ...(pdfMake.vfs || {}), ...vfs };
      }

      if (typeof pdfMake.addFonts === 'function') {
        pdfMake.addFonts(fonts);
      } else {
        pdfMake.fonts = { ...(pdfMake.fonts || {}), ...fonts };
      }
      return pdfMake;
    })();
  }
  return pdfMakeReady;
}

function cell(content: Content, options: AnyObj = {}): TableCell {
  const base = (typeof content === 'string' || Array.isArray(content)) ? { text: content } : (content as AnyObj);
  return {
    ...base,
    margin: options.margin ?? [3, 4, 3, 4],
    ...options,
  } as TableCell;
}

function labelValue(label: string, value: any): TableCell[] {
  return [
    cell(label, { color: MUTED, fontSize: 8, border: [false, false, false, false], margin: [0, 1, 4, 1] }),
    cell(text(value), { bold: true, alignment: 'right', fontSize: 8, border: [false, false, false, false], margin: [4, 1, 0, 1] }),
  ];
}

function buildHeader(companyInfo: AnyObj, quote: AnyObj, revision: AnyObj, logoDataUrl?: string | null): Content {
  const companyStack: Content[] = [
    { text: text(companyInfo.name_th), bold: true, color: BLUE, fontSize: 13, margin: [0, 0, 0, 1] },
  ];
  if (companyInfo.name_en) companyStack.push({ text: companyInfo.name_en, italics: true, color: MUTED, fontSize: 8, margin: [0, 0, 0, 2] } as any);
  if (companyInfo.address_th) companyStack.push({ text: companyInfo.address_th, color: MUTED, fontSize: 7.5 });
  companyStack.push({
    text: [companyInfo.phone && `โทร: ${companyInfo.phone}`, companyInfo.fax && `แฟกซ์: ${companyInfo.fax}`, companyInfo.email && `Email: ${companyInfo.email}`].filter(Boolean).join('  '),
    color: MUTED,
    fontSize: 7.5,
  });
  if (companyInfo.website) companyStack.push({ text: `เว็บไซต์: ${companyInfo.website}`, color: MUTED, fontSize: 7.5 });
  if (companyInfo.tax_id) {
    companyStack.push({
      text: `เลขประจำตัวผู้เสียภาษี: ${companyInfo.tax_id}${companyInfo.branch_type === 'head_office' ? ' (สำนักงานใหญ่)' : companyInfo.branch_type === 'branch' && companyInfo.branch_name ? ` (สาขา: ${companyInfo.branch_name})` : ''}`,
      bold: true,
      color: MUTED,
      fontSize: 7.5,
    });
  }

  return {
    table: {
      widths: [logoDataUrl ? 42 : 0, '*', 128],
      body: [[
        logoDataUrl ? cell({ image: logoDataUrl, fit: [38, 38] } as any, { border: [false, false, false, true], borderColor: [LIGHT, LIGHT, LIGHT, BLUE], margin: [0, 0, 8, 8] }) : cell('', { border: [false, false, false, true], borderColor: [LIGHT, LIGHT, LIGHT, BLUE], margin: [0, 0, 0, 8] }),
        cell({ stack: companyStack } as any, { border: [false, false, false, true], borderColor: [LIGHT, LIGHT, LIGHT, BLUE], margin: [0, 0, 0, 8] }),
        cell({
          stack: [
          { text: 'ใบเสนอราคา', bold: true, fontSize: 17, alignment: 'right', color: TEXT, noWrap: true },
            { text: 'QUOTATION', fontSize: 8, alignment: 'right', color: MUTED, margin: [0, 0, 0, 4] },
            { text: `Revision ${revision.revision_number ?? 1}`, bold: true, fontSize: 9, alignment: 'center', color: BLUE, margin: [42, 0, 0, 0] },
            { text: quote.quote_number || '', fontSize: 8, alignment: 'right', color: MUTED, margin: [0, 5, 0, 0] },
          ],
        } as any, { border: [false, false, false, true], borderColor: [LIGHT, LIGHT, LIGHT, BLUE], margin: [0, 0, 0, 8] }),
      ]],
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
    },
    margin: [0, 0, 0, 10],
  } as any;
}

function buildMeta(quote: AnyObj, revision: AnyObj): Content {
  return {
    columns: [
      {
        width: '*',
        stack: [
          { text: 'ลูกค้า', bold: true, fontSize: 8, color: TEXT, margin: [0, 0, 0, 3] },
          { text: text(quote.customer_name), bold: true, fontSize: 10 },
          quote.customer_company ? { text: quote.customer_company, fontSize: 8.2, color: MUTED } : null,
          quote.customer_address ? { text: quote.customer_address, fontSize: 8.2, color: MUTED } : null,
          quote.customer_tax_id ? { text: `เลขประจำตัวผู้เสียภาษี: ${quote.customer_tax_id}`, fontSize: 8.2, color: MUTED } : null,
          quote.customer_phone ? { text: `โทร: ${quote.customer_phone}`, fontSize: 8.2, color: MUTED } : null,
          quote.customer_email ? { text: `Email: ${quote.customer_email}`, fontSize: 8.2, color: MUTED } : null,
          quote.customer_line ? { text: `LINE: ${quote.customer_line}`, fontSize: 8.2, color: MUTED } : null,
        ].filter(Boolean) as Content[],
      },
      {
        width: 200,
        table: {
          widths: [86, '*'],
          body: [
            labelValue('เลขที่ใบเสนอราคา:', quote.quote_number),
            labelValue('Revision:', `#${revision.revision_number ?? 1}`),
            labelValue('วันที่:', thaiDate(revision.created_at || quote.created_at)),
            ...(revision.valid_until ? [labelValue('ใช้ได้ถึง:', thaiDate(revision.valid_until))] : []),
            labelValue('ผู้เสนอราคา:', revision.created_by_name || '-'),
          ],
        },
        layout: 'noBorders',
      },
    ],
    columnGap: 24,
    margin: [0, 0, 0, 10],
  } as any;
}

function buildProductTable(products: AnyObj[]): Content {
  const header = [
    cell('#', { bold: true, alignment: 'center', fillColor: HEADER_BG, fontSize: 8 }),
    cell('รายการ', { bold: true, fillColor: HEADER_BG, fontSize: 8 }),
    cell('จำนวน', { bold: true, alignment: 'center', fillColor: HEADER_BG, fontSize: 8 }),
    cell('ราคา/หน่วย', { bold: true, alignment: 'right', fillColor: HEADER_BG, fontSize: 8 }),
    cell('ส่วนลด', { bold: true, alignment: 'right', fillColor: HEADER_BG, fontSize: 8 }),
    cell('รวม', { bold: true, alignment: 'right', fillColor: HEADER_BG, fontSize: 8 }),
  ];

  const rows = products.map((p, idx) => {
    const qty = p.quantity ?? p.qty ?? 0;
    const unit = Number(p.unit_price || 0);
    const lineTotal = Number(p.line_total ?? qty * unit);
    const discount = Number(p.discount_amount || 0) > 0 ? money(p.discount_amount) : Number(p.discount_percent || 0) > 0 ? `${p.discount_percent}%` : '–';
    const description = cleanLines(p.description);
    const specs = cleanLines(p.specs && p.specs !== p.description ? p.specs : '');
    return [
      cell(String(idx + 1), { alignment: 'center', fontSize: 8, color: MUTED }),
      cell({
        stack: [
          { text: text(p.name || p.model), bold: true, fontSize: 8.8, color: TEXT, margin: [0, 0, 0, 1] },
          description ? { text: description, fontSize: 6.7, color: '#444444', lineHeight: 0.98, margin: [0, 1, 0, 0] } : null,
          specs ? { text: specs, fontSize: 6.7, color: '#444444', lineHeight: 0.98, margin: [0, 1, 0, 0] } : null,
          p.notes ? { text: `* ${p.notes}`, fontSize: 7.2, color: BLUE, margin: [0, 2, 0, 0] } : null,
        ].filter(Boolean),
      } as any, { margin: [4, 5, 5, 5] }),
      cell(String(qty), { alignment: 'center', fontSize: 8 }),
      cell(money(unit), { alignment: 'right', fontSize: 8 }),
      cell(discount, { alignment: 'right', fontSize: 8 }),
      cell(money(lineTotal), { alignment: 'right', bold: true, fontSize: 8 }),
    ];
  });

  return {
    table: {
      headerRows: 1,
      widths: [24, 271, 38, 64, 52, 74],
      keepWithHeaderRows: 1,
      dontBreakRows: false,
      body: [header, ...rows],
    },
    layout: quoteTableLayout,
    margin: [0, 0, 0, 8],
  } as any;
}

const quoteTableLayout: CustomTableLayout = {
  hLineWidth: (i) => (i === 0 || i === 1 ? 0.8 : 0.35),
  vLineWidth: () => 0,
  hLineColor: (i) => (i === 1 ? '#1f2937' : LIGHT),
  paddingLeft: () => 0,
  paddingRight: () => 0,
  paddingTop: () => 0,
  paddingBottom: () => 0,
};

function buildFreeItems(freeItems: AnyObj[]): Content | null {
  if (!freeItems?.length) return null;
  return {
    stack: [
      { text: 'ของแถม', bold: true, fontSize: 8.5, margin: [0, 0, 0, 3] },
      ...freeItems.map((item) => ({
        columns: [
          { text: `${item.name || item.model || '-'} × ${item.quantity ?? item.qty ?? '-'}`, fontSize: 8 },
          { text: item.value || item.total_value ? `มูลค่า ${money(item.value || item.total_value)}` : '', alignment: 'right', color: MUTED, fontSize: 8 },
        ],
      })),
    ],
    fillColor: '#fffbeb',
    margin: [0, 0, 0, 8],
  } as any;
}

function buildTotals(revision: AnyObj): Content {
  const rows: TableCell[][] = [
    [cell('ยอดรวม:', { border: [false, false, false, false], color: MUTED, margin: [0, 2, 12, 2] }), cell(`${money(revision.subtotal)} บาท`, { border: [false, false, false, false], alignment: 'right', bold: true, margin: [0, 2, 0, 2] })],
  ];
  if (Number(revision.discount_amount || 0) > 0) {
    rows.push([
      cell(`ส่วนลด${revision.discount_type === 'baht' ? ` (฿${money(revision.discount_amount)})` : revision.discount_percent ? ` (${revision.discount_percent}%)` : ''}:`, { border: [false, false, false, false], color: '#16a34a', margin: [0, 2, 12, 2] }),
      cell(`-${money(revision.discount_amount)} บาท`, { border: [false, false, false, false], alignment: 'right', bold: true, color: '#16a34a', margin: [0, 2, 0, 2] }),
    ]);
  }
  if (Number(revision.vat_amount || 0) > 0) {
    rows.push([
      cell(`VAT ${revision.vat_percent ?? 7}%:`, { border: [false, false, false, false], color: MUTED, margin: [0, 2, 12, 2] }),
      cell(`${money(revision.vat_amount)} บาท`, { border: [false, false, false, false], alignment: 'right', bold: true, margin: [0, 2, 0, 2] }),
    ]);
  }
  rows.push([
    cell('รวมสุทธิ:', { border: [false, true, false, false], borderColor: [LIGHT, TEXT, LIGHT, LIGHT], bold: true, fontSize: 10, margin: [0, 5, 12, 2] }),
    cell(`${money(revision.grand_total)} บาท`, { border: [false, true, false, false], borderColor: [LIGHT, TEXT, LIGHT, LIGHT], alignment: 'right', bold: true, color: BLUE, fontSize: 10, margin: [0, 5, 0, 2] }),
  ]);

  return {
    columns: [
      { width: '*', text: '' },
      { width: 230, table: { widths: ['*', 102], body: rows }, layout: 'noBorders' },
    ],
    margin: [0, 0, 0, 10],
  } as any;
}

function buildTerms(quote: AnyObj): Content | null {
  if (!quote.payment_terms && !quote.delivery_terms && !quote.warranty_terms && !quote.notes) return null;
  const items = [
    quote.payment_terms ? { text: [{ text: 'เงื่อนไขการชำระเงิน: ', bold: true }, quote.payment_terms], fontSize: 8, margin: [0, 1, 0, 1] } : null,
    quote.delivery_terms ? { text: [{ text: 'เงื่อนไขการจัดส่ง: ', bold: true }, quote.delivery_terms], fontSize: 8, margin: [0, 1, 0, 1] } : null,
    quote.warranty_terms ? { text: [{ text: 'การรับประกัน: ', bold: true }, quote.warranty_terms], fontSize: 8, margin: [0, 1, 0, 1] } : null,
    quote.notes ? { text: [{ text: 'หมายเหตุ: ', bold: true }, quote.notes], fontSize: 8, margin: [0, 1, 0, 1] } : null,
  ].filter(Boolean) as Content[];
  return { stack: items, margin: [0, 0, 0, 8] } as any;
}

function buildBanks(bankAccounts?: AnyObj[]): Content | null {
  if (!bankAccounts?.length) return null;
  return {
    stack: [
      { text: 'การชำระเงิน — โอนเข้าบัญชี:', bold: true, fontSize: 8.5, margin: [0, 0, 0, 4] },
      {
        table: {
          widths: bankAccounts.length > 1 ? ['*', '*'] : ['*'],
          body: bankAccounts.reduce<TableCell[][]>((rows, bank, idx) => {
            const bankCell = cell({
              stack: [
                { text: `${bank.bank_name || '-'}${bank.is_default ? '  (หลัก)' : ''}`, bold: true, fontSize: 8 },
                { text: bank.account_number || '-', fontSize: 8, color: TEXT },
                { text: bank.account_name || '-', fontSize: 7.6, color: MUTED },
                bank.branch ? { text: `สาขา: ${bank.branch}`, fontSize: 7.6, color: MUTED } : null,
              ].filter(Boolean),
            } as any, { fillColor: bank.is_default ? '#eff6ff' : '#fafafa', borderColor: [LIGHT, LIGHT, LIGHT, LIGHT], margin: [6, 5, 6, 5] });
            if (bankAccounts.length === 1) rows.push([bankCell]);
            else if (idx % 2 === 0) rows.push([bankCell, cell('', { border: [false, false, false, false] })]);
            else rows[rows.length - 1][1] = bankCell;
            return rows;
          }, []),
        },
        layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 6, paddingTop: () => 0, paddingBottom: () => 4 },
      },
    ],
    margin: [0, 0, 0, 10],
  } as any;
}

function buildSignatures(salePerson?: AnyObj, signatureDataUrl?: string | null): Content {
  const sellerStack: Content[] = [];
  if (signatureDataUrl && salePerson?.show_signature_on_quotes !== false) {
    sellerStack.push({ image: signatureDataUrl, fit: [92, 38], alignment: 'center', margin: [0, 0, 0, 2] } as any);
  } else {
    sellerStack.push({ text: '\n\n', margin: [0, 0, 0, 2] });
  }
  sellerStack.push(
    { canvas: [{ type: 'line', x1: 18, y1: 0, x2: 160, y2: 0, lineWidth: 0.5, lineColor: '#999999' }], margin: [0, 0, 0, 4] } as any,
    { text: salePerson?.full_name || ' ', bold: true, fontSize: 8.5, alignment: 'center' },
    { text: salePerson?.position || (salePerson?.full_name ? 'ผู้เสนอราคา' : ' '), fontSize: 7.5, color: MUTED, alignment: 'center' },
    { text: salePerson?.full_name ? `วันที่: ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}` : ' ', fontSize: 7, color: MUTED, alignment: 'center' }
  );

  return {
    columns: [
      { width: '*', stack: sellerStack },
      {
        width: '*',
        stack: [
          { text: '\n\n', margin: [0, 0, 0, 2] },
          { canvas: [{ type: 'line', x1: 18, y1: 0, x2: 160, y2: 0, lineWidth: 0.5, lineColor: '#999999' }], margin: [0, 0, 0, 4] } as any,
          { text: 'ผู้อนุมัติ', fontSize: 7.5, color: MUTED, alignment: 'center' },
          { text: 'วันที่: ______________', fontSize: 7, color: MUTED, alignment: 'center' },
        ],
      },
    ],
    columnGap: 38,
    margin: [0, 14, 0, 0],
  } as any;
}

export function createQuotePdfDefinition(params: QuotePdfParams, assets: { logoDataUrl?: string | null; signatureDataUrl?: string | null } = {}): TDocumentDefinitions {
  const { quote, revision, companyInfo, salePerson, bankAccounts } = params;
  const products = Array.isArray(revision.products) ? revision.products : [];
  const freeItems = Array.isArray(revision.free_items) ? revision.free_items : [];
  const content: Content[] = [
    buildHeader(companyInfo, quote, revision, assets.logoDataUrl),
    buildMeta(quote, revision),
    buildProductTable(products),
  ];

  const free = buildFreeItems(freeItems);
  if (free) content.push(free);
  if (revision.customer_message) {
    content.push({ text: [{ text: 'ข้อความจากลูกค้า: ', bold: true }, `"${revision.customer_message}"`], color: MUTED, fontSize: 8, margin: [0, 0, 0, 8] } as any);
  }
  content.push(buildTotals(revision));
  const terms = buildTerms(quote);
  if (terms) content.push(terms);
  const banks = buildBanks(bankAccounts);
  if (banks) content.push(banks);
  content.push(buildSignatures(salePerson, assets.signatureDataUrl));

  return {
    pageSize: 'A4',
    pageMargins: [36, 52, 36, 40],
    defaultStyle: { font: 'Sarabun', fontSize: 8.5, color: TEXT, lineHeight: 1.12 },
    header: (currentPage) => currentPage === 1 ? '' : {
      columns: [
        { text: companyInfo.name_th || 'ENT Group', color: BLUE, bold: true, fontSize: 7.5 },
        { text: `ใบเสนอราคา ${quote.quote_number} • Rev ${revision.revision_number ?? 1}`, color: MUTED, alignment: 'right', fontSize: 7.5 },
      ],
      margin: [36, 20, 36, 0],
    } as any,
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: quote.quote_number || '', color: '#999999', fontSize: 7 },
        { text: 'เอกสารนี้ออกโดยระบบอัตโนมัติ', color: '#999999', alignment: 'center', fontSize: 7 },
        { text: `หน้า ${currentPage} / ${pageCount}`, color: '#999999', alignment: 'right', fontSize: 7 },
      ],
      margin: [36, 8, 36, 0],
    }) as any,
    content,
    compress: true,
    info: {
      title: `${quote.quote_number || 'Quotation'} Rev ${revision.revision_number ?? 1}`,
      author: companyInfo.name_th || 'ENT Group',
      subject: 'Quotation',
      creator: 'ENT Group Quotation System',
    },
  };
}

async function createPdf(params: QuotePdfParams) {
  const pdfMake = await getPdfMake();
  const [logoDataUrl, signatureDataUrl] = await Promise.all([
    loadImageDataUrl(params.companyInfo?.logo_url),
    loadImageDataUrl(params.salePerson?.signature_url),
  ]);
  return pdfMake.createPdf(createQuotePdfDefinition(params, { logoDataUrl, signatureDataUrl }));
}

export async function downloadQuotePdf(params: QuotePdfParams, filename: string) {
  const pdf = await createPdf(params);
  await pdf.download(filename);
}

export async function printQuotePdf(params: QuotePdfParams) {
  const pdf = await createPdf(params);
  await pdf.print();
}

export async function getQuotePdfBlob(params: QuotePdfParams): Promise<Blob> {
  const pdf = await createPdf(params);
  return pdf.getBlob();
}