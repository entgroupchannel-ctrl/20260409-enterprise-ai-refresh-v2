/**
 * html2pdf helper — generate PDF พร้อม header/footer ทุกหน้า
 *
 * ใช้แทนการเรียก html2pdf().set(...).from(el).save() ตรงๆ
 * เพื่อให้ทุกเอกสารในระบบมี:
 *   - หัวกระดาษย่อ (ชื่อบริษัท + เลขที่เอกสาร) ตั้งแต่หน้า 2
 *   - หมายเลขหน้า (เช่น 1/2, 2/2) ทุกหน้า
 */

interface PDFHeaderFooterOptions {
  filename: string;
  /** ข้อความหัวกระดาษซ้าย (ปกติคือชื่อบริษัท) */
  headerLeft: string;
  /** ข้อความหัวกระดาษขวา (ปกติคือเลขที่เอกสาร เช่น QT2026... Rev #1) */
  headerRight: string;
  /** ข้อความ footer กลาง (optional — ปกติคือ "เอกสารออกโดยระบบ") */
  footerCenter?: string;
  margin?: number; // mm — side margin
  /** Override top margin (mm). Default 22 (room for header). */
  topMargin?: number;
  /** Override bottom margin (mm). Default 18 (room for page number). */
  bottomMargin?: number;
}

async function buildPdfWithHeaderFooter(
  element: HTMLElement,
  opts: PDFHeaderFooterOptions
) {
  const html2pdf = (await import('html2pdf.js')).default;
  const margin = opts.margin ?? 12;
  const topMargin = opts.topMargin ?? 22;
  const bottomMargin = opts.bottomMargin ?? 18;

  const worker = html2pdf()
    .set({
      margin: [topMargin, margin, bottomMargin, margin],
      filename: opts.filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 794 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['tr', '.pdf-keep'] },
    })
    .from(element)
    .toPdf();

  const pdfWorker = await worker.get('pdf');
  const totalPages = pdfWorker.internal.getNumberOfPages();
  const pageWidth = pdfWorker.internal.pageSize.getWidth();
  const pageHeight = pdfWorker.internal.pageSize.getHeight();

  // jsPDF built-in fonts (Helvetica) ไม่รองรับภาษาไทย → ASCII-only
  const toAscii = (s: string) =>
    (s || '').replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ').trim();

  const safeHeaderLeft = toAscii(opts.headerLeft) || 'ENT Group';
  const safeHeaderRight = toAscii(opts.headerRight);
  const safeFooterCenter = opts.footerCenter ? toAscii(opts.footerCenter) : '';

  for (let i = 1; i <= totalPages; i++) {
    pdfWorker.setPage(i);

    if (i > 1) {
      pdfWorker.setFontSize(9);
      pdfWorker.setTextColor(80);
      if (safeHeaderLeft) pdfWorker.text(safeHeaderLeft, margin, 12);
      if (safeHeaderRight) pdfWorker.text(safeHeaderRight, pageWidth - margin, 12, { align: 'right' });
      pdfWorker.setDrawColor(180);
      pdfWorker.setLineWidth(0.3);
      pdfWorker.line(margin, 15, pageWidth - margin, 15);
    }

    pdfWorker.setFontSize(8);
    pdfWorker.setTextColor(120);
    pdfWorker.text(`Page ${i} / ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    if (safeFooterCenter) {
      pdfWorker.text(safeFooterCenter, pageWidth / 2, pageHeight - 8, { align: 'center' });
    }
  }

  return pdfWorker;
}

export async function generatePDFWithHeaderFooter(
  element: HTMLElement,
  opts: PDFHeaderFooterOptions
): Promise<void> {
  const pdfWorker = await buildPdfWithHeaderFooter(element, opts);
  pdfWorker.save(opts.filename);
}

/** Same as generatePDFWithHeaderFooter but returns a Blob for upload flows. */
export async function generatePDFBlobWithHeaderFooter(
  element: HTMLElement,
  opts: PDFHeaderFooterOptions
): Promise<Blob> {
  const pdfWorker = await buildPdfWithHeaderFooter(element, opts);
  return pdfWorker.output('blob') as Blob;
}
